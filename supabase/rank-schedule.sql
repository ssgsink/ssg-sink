-- Run once in the SQL Editor. In Vault add NAVER_CLIENT_ID and NAVER_CLIENT_SECRET.
-- Only the verified business account can submit scheduled searches.
begin;
create extension if not exists pg_cron;
create extension if not exists pg_net;
create extension if not exists supabase_vault;
create table if not exists public.rank_observations (
 id bigint generated always as identity primary key,
 owner uuid not null references auth.users(id) on delete cascade,
 day date not null, keyword text not null, target text not null,
 status text not null default 'queued', req bigint, sent timestamptz,
 position integer, link text, unique(owner,day,keyword,target)
);
alter table public.rank_observations enable row level security;
revoke all on public.rank_observations from anon,authenticated;
grant select on public.rank_observations to authenticated;
drop policy if exists rank_owner_read on public.rank_observations;
create policy rank_owner_read on public.rank_observations for select to authenticated using(owner=auth.uid());
create or replace function public.rank_schedule_ready() returns boolean
language sql security definer set search_path='' as $$
 select exists(select 1 from auth.users where id=auth.uid() and email='ssg-sink@naver.com' and email_confirmed_at is not null)
 and exists(select 1 from cron.job where jobname='ssg-rank-minute' and active)
 and (select count(distinct name)=2 from vault.decrypted_secrets where name in ('NAVER_CLIENT_ID','NAVER_CLIENT_SECRET') and length(decrypted_secret)>0);
$$;
revoke all on function public.rank_schedule_ready() from public,anon;
grant execute on function public.rank_schedule_ready() to authenticated;
create or replace function public.ssg_rank_tick() returns void language plpgsql security definer set search_path='' as $$
declare
 kst timestamp:=now() at time zone 'Asia/Seoul';
 cid text; secret text; job record; num int; dest text; payload jsonb;
begin
 if not pg_try_advisory_xact_lock(82193471) then return; end if;
 -- Skip HTTP response processing and Vault access when nothing is due.
 if not exists (select 1 from public.rank_observations where status in ('sent','queued'))
 and not exists (select 1 from auth.users where email='ssg-sink@naver.com'
   and raw_user_meta_data->'rank_schedule'->>'enabled'='true'
   and raw_user_meta_data->'rank_schedule'->>'time'=to_char(kst,'HH24:MI')) then
  return;
 end if;
 for job in select o.*,r.status_code,r.content from public.rank_observations o
 join net._http_response r on r.id=o.req where o.status='sent' loop
  begin
   if job.status_code is distinct from 200 then raise exception 'http';end if;
   payload:=job.content::jsonb;
   if jsonb_typeof(payload->'items') is distinct from 'array' then raise exception 'format';end if;
   select n::int,item->>'link' into num,dest from jsonb_array_elements(payload->'items') with ordinality a(item,n)
    where case when job.target='홈페이지' then item->>'link' ~* '^https?://ssg-sink[.]vercel[.]app([/?#]|$)'
    else item->>'bloggerlink' ~* '^(https?://)?(m[.])?blog[.]naver[.]com/ssg-sink([/?#]|$)' or item->>'link' ~* '^https?://(m[.])?blog[.]naver[.]com/ssg-sink/' end
    order by n limit 1;
   update public.rank_observations set status='done',position=num,link=case when dest ~* '^https?://' then dest end where id=job.id;
  exception when others then update public.rank_observations set status='error' where id=job.id;end;
 end loop;
 update public.rank_observations set status='error' where status='sent' and sent<now()-interval '10 minutes';
 select decrypted_secret into cid from vault.decrypted_secrets where name='NAVER_CLIENT_ID';
 select decrypted_secret into secret from vault.decrypted_secrets where name='NAVER_CLIENT_SECRET';
 if coalesce(cid,'')='' or coalesce(secret,'')='' then return;end if;
 insert into public.rank_observations(owner,day,keyword,target)
 select u.id,kst::date,w,t from auth.users u
 cross join lateral (select u.raw_user_meta_data->'rank_schedule' as cfg) c
 cross join lateral jsonb_array_elements_text(case when jsonb_typeof(cfg->'words')='array' then cfg->'words' else '[]'::jsonb end) with ordinality words(w,i)
 cross join (values ('블로그'),('홈페이지')) targets(t)
 where u.email='ssg-sink@naver.com' and u.email_confirmed_at is not null and cfg->>'enabled'='true'
 and (coalesce(cfg->>'target','both')='both' or cfg->>'target'=t)
 and cfg->>'time'=to_char(kst,'HH24:MI') and i<=200 and length(w) between 1 and 150
 on conflict do nothing;
 -- Small batches every five seconds while there is work.
 for job in select o.* from public.rank_observations o join auth.users u on u.id=o.owner
 where o.status='queued' and (coalesce(u.raw_user_meta_data->'rank_schedule'->>'target','both')='both' or u.raw_user_meta_data->'rank_schedule'->>'target'=o.target)
 and (u.raw_user_meta_data->'rank_schedule'->'words') ? o.keyword
 and u.raw_user_meta_data->'rank_schedule'->>'enabled'='true' and u.email='ssg-sink@naver.com'
 order by o.id limit 2 loop
  update public.rank_observations set req=net.http_get(
   url=>'https://naverapihub.apigw.ntruss.com/search/v1/'||(case when job.target='블로그' then 'blog' else 'webkr' end),
   params=>jsonb_build_object('query',job.keyword,'display','100'),
   headers=>jsonb_build_object('X-NCP-APIGW-API-KEY-ID',cid,'X-NCP-APIGW-API-KEY',secret),timeout_milliseconds=>10000),
   status='sent',sent=now() where id=job.id;
 end loop;
end;$$;
revoke all on function public.ssg_rank_tick() from public,anon,authenticated;
create or replace function public.rank_keyword_limit() returns integer language sql immutable as 'select 200';
grant execute on function public.rank_keyword_limit() to authenticated;
select cron.schedule('ssg-rank-minute','5 seconds','select public.ssg_rank_tick()');
create or replace function public.rank_shared_config_version() returns integer language sql immutable as 'select 1';
revoke all on function public.rank_shared_config_version() from public,anon;
grant execute on function public.rank_shared_config_version() to authenticated;
commit;
