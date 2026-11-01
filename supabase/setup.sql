-- Run in Supabase SQL Editor. Replace the email below with your actual administrator email.
create table if not exists public.case_posts (
 id uuid primary key default gen_random_uuid(),
 slug text not null unique,
 title text not null,
 description text not null,
 region text not null,
 before_url text,
 after_url text,
 created_at timestamptz not null default now()
);
alter table public.case_posts enable row level security;
create policy "Public can read cases" on public.case_posts for select using (true);
create policy "Admin inserts" on public.case_posts for insert to authenticated with check ((auth.jwt()->>'email') = 'REPLACE_WITH_ADMIN_EMAIL');
create policy "Admin updates" on public.case_posts for update to authenticated using ((auth.jwt()->>'email') = 'REPLACE_WITH_ADMIN_EMAIL') with check ((auth.jwt()->>'email') = 'REPLACE_WITH_ADMIN_EMAIL');
create policy "Admin deletes" on public.case_posts for delete to authenticated using ((auth.jwt()->>'email') = 'REPLACE_WITH_ADMIN_EMAIL');
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values ('case-images','case-images',true,10485760,array['image/jpeg','image/png','image/webp']) on conflict(id) do nothing;
create policy "Public case images" on storage.objects for select using (bucket_id='case-images');
create policy "Admin image upload" on storage.objects for insert to authenticated with check (bucket_id='case-images' and (auth.jwt()->>'email')='REPLACE_WITH_ADMIN_EMAIL' and (storage.foldername(name))[1]=auth.uid()::text);
