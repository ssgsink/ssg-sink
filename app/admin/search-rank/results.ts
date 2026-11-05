export type Row={time:string;keyword:string;mode:string;type:string;rank:number|null;scope:number;title:string;url:string;error?:string};
export type Scheduled={id:number;day:string;keyword:string;target:string;status:string;position:number|null;link:string|null;sent:string|null};
export type Latest={keyword:string;source:'manual'|'scheduled';time:string;rows:Row[]};
export function latestResults(words:string[],target:string,manual:Row[],scheduled:Scheduled[]):Latest[]{
 return words.map(keyword=>{
  const candidates=manual.filter(r=>r.keyword===keyword&&r.type===target);
  const newest=new Map<string,string>();
  for(const row of candidates)if(!newest.has(row.mode)||Date.parse(row.time)>Date.parse(newest.get(row.mode)!))newest.set(row.mode,row.time);
  const rows=candidates.filter(r=>r.time===newest.get(r.mode));
  const time=rows.reduce((t,r)=>r.time>t?r.time:t,'');
  const job=scheduled.filter(r=>r.keyword===keyword&&r.target===target&&r.sent&&['done','error'].includes(r.status)).sort((a,b)=>Date.parse(b.sent!)-Date.parse(a.sent!))[0];
  if(job&&(!time||Date.parse(job.sent!)>Date.parse(time)))return {keyword,source:'scheduled',time:job.sent!,rows:[{keyword,type:target,mode:'api',time:job.sent!,rank:job.position,scope:100,title:'예약 API 결과 글 보기',url:job.link||'',error:job.status==='error'?'예약 검색 실패':undefined}]};
  return {keyword,source:'manual',time,rows};
 });
}
