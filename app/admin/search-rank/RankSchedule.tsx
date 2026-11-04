'use client';
import {useState,useEffect} from 'react';
import type {SupabaseClient,User} from '@supabase/supabase-js';

type Setting={time:string;enabled:boolean;words:string[];saved:string};
type Entry={id:number;day:string;keyword:string;target:string;status:string;position:number|null;link:string|null};
export default function RankSchedule({client,user,keywords,target}:{client:SupabaseClient;user:User;keywords:string;target:string}){
 const initial=user.user_metadata.rank_schedule as Setting|undefined;
 const [time,setTime]=useState(initial?.time||'09:00');
 const [enabled,setEnabled]=useState(initial?.enabled||false);
 const [saved,setSaved]=useState(initial);
 const [ready,setReady]=useState(false),[busy,setBusy]=useState(false),[message,setMessage]=useState('');
 const [entries,setEntries]=useState<Entry[]>([]);
 useEffect(()=>{
  let active=true;
  async function refresh(){
   const {data,error}=await client.rpc('rank_schedule_ready');
   if(!active)return;
   setReady(!error&&data===true);
   if(error)return;
   const history=await client.from('rank_observations').select('id,day,keyword,target,status,position,link').eq('owner',user.id).eq('target',target).order('id',{ascending:false}).limit(100);
   if(active)setEntries(history.data||[]);
  }
  setEntries([]);void refresh();
  const timer=setInterval(refresh,60000);
  return ()=>{active=false;clearInterval(timer)};
 },[client,user.id,target]);
 async function save(){
  const words=Array.from(new Set(keywords.split('\n').map(x=>x.trim()).filter(Boolean)));
  if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)){setMessage('예약 시간을 선택하세요.');return}
  if(enabled&&(!words.length||words.length>50||words.some(w=>w.length>150))){setMessage('예약 검색어는 1~50개, 한 줄당 150자 이내로 입력하세요.');return}
  setBusy(true);
  try{
   const config={time,enabled,words:enabled?words:(saved?.words||[]),saved:new Date().toISOString()};
   const {error}=await client.auth.updateUser({data:{rank_schedule:config}});
   if(error)throw error;
   setSaved(config);setMessage('예약 설정을 저장했습니다.');
  }catch{setMessage('저장하지 못했습니다. 로그인 상태를 확인하고 다시 시도하세요.')}
  finally{setBusy(false)}
 }
 return <section style={{padding:20,margin:'24px 0',border:'1px solid #ddd',borderRadius:10}}>
  <h2>매일 자동 검색</h2>
  <p>한국 시간에 맞춰 서버에서 검색합니다. 위 입력란의 검색어를 변경한 뒤에는 예약 설정도 다시 저장하세요.</p>
  <div style={{display:'flex',alignItems:'center',gap:16,flexWrap:'wrap'}}>
   <label><input type="checkbox" checked={enabled} onChange={e=>setEnabled(e.target.checked)}/> 예약 사용</label>
   <label>매일 실행 시간 (한국) <input required type="time" value={time} onChange={e=>setTime(e.target.value)}/></label>
   <button disabled={busy} onClick={save}>{busy?'저장 중…':'예약 설정 저장'}</button>
  </div>
  <p>{saved?.enabled?'저장된 예약 · 매일 '+saved.time+' · 검색어 '+saved.words.length+'개':'저장된 예약 · 꺼짐'}</p>
  <p>{ready?'자동 검색 서버 연결됨':'자동 실행 준비 전 · 서버에 예약 작업과 네이버 검색 API 키 연결이 필요합니다.'}</p>
  <p role="status">{message}</p>
  <h3>{target} 예약 검색 기록</h3>
  <p>네이버 {target==='블로그'?'블로그':'웹문서'} 검색 API 상위 100건 기준 · 최근 100개 기록</p>
  {entries.length?<ul>{entries.map(e=><li key={e.id}>{e.day} · {e.keyword} · {e.position?<a href={e.link||undefined} target="_blank" rel="noopener noreferrer">{e.position}번째</a>:e.status==='done'?'상위 100건 내 미발견':e.status==='error'?'조회 실패':'확인 대기'}</li>)}</ul>:<p>저장된 예약 검색 기록이 없습니다.</p>}
 </section>;
}
