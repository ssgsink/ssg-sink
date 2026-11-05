'use client';
import {useEffect,useState} from 'react';
import type {SupabaseClient} from '@supabase/supabase-js';
const LIMIT=775000;
export function usageWindow(now=new Date()){
 const date=new Date(now.getTime()+9*3600000).toISOString().slice(0,10);
 const month=date.slice(0,7);
 return {date,month,today:date+'T00:00:00+09:00',start:month+'-01T00:00:00+09:00',end:now.toISOString()};
}
export default function ApiUsage({client,owner}:{client:SupabaseClient;owner:string}){
 const [counts,setCounts]=useState<number[]|null>(null),[error,setError]=useState(''),[updated,setUpdated]=useState(''),[period,setPeriod]=useState(''),[busy,setBusy]=useState(false),[revision,setRevision]=useState(0);
 useEffect(()=>{
  let active=true,inFlight=false;
  async function refresh(){
   if(inFlight)return;inFlight=true;
   if(active)setBusy(true);
   try{
    const window=usageWindow();
    const responses=await Promise.all(['블로그','홈페이지'].flatMap(target=>[window.today,window.start].map(start=>
     client.from('rank_observations').select('id',{count:'exact',head:true}).eq('owner',owner).eq('target',target).not('req','is',null).gte('sent',start).lte('sent',window.end)
    )));
    if(responses.some(r=>r.error||r.count===null))throw Error('사용 기록을 읽지 못했습니다. 잠시 후 다시 확인해 주세요.');
    if(!active)return;
    setCounts(responses.map(r=>r.count!));setError('');setUpdated(window.end);setPeriod(window.month);
   }catch(e){if(active){setCounts(null);setError(e instanceof Error?e.message:'사용량 조회 실패');}}
   finally{inFlight=false;if(active)setBusy(false);}
  }
  setCounts(null);void refresh();const timer=setInterval(refresh,60000);
  return()=>{active=false;clearInterval(timer);};
 },[client,owner,revision]);
 const total=counts?counts[1]+counts[3]:null;
 return <section className="rank-panel">
  <div className="rank-heading"><h2>검색 API 사용량</h2><button disabled={busy} onClick={()=>setRevision(v=>v+1)}>{busy?'조회 중…':'사용량 새로고침'}</button></div>
  {total!==null&&<><p style={{margin:'8px 0'}}>이번 달 {total.toLocaleString()} / {LIMIT.toLocaleString()}회 · {(total/LIMIT*100).toFixed(3)}%</p><progress aria-label="홈페이지 기록 기준 월 한도 사용률" value={Math.min(total,LIMIT)} max={LIMIT} style={{width:'100%'}}/><small>블로그 {counts![1].toLocaleString()}회 · 웹문서 {counts![3].toLocaleString()}회 · 홈페이지 서버 기록 기준</small></>}
  {error&&<p role="alert">{error}</p>}{!counts&&!error&&<p role="status">사용량 확인 중…</p>}
  <details style={{marginTop:12}}><summary>자세히 보기</summary>
  <p>블로그·웹문서 공통 월 한도 <strong>{LIMIT.toLocaleString('ko-KR')}회</strong> · 한시적 무료 제공 (공식 안내 확인: 2026.11.05)</p>
  <p>한국 시간 기준 · {period||'이번 달'} · 이 홈페이지의 서버 요청 기록으로 집계</p>
  {counts&&<>
   <div style={{overflowX:'auto'}}><table style={{width:'100%',minWidth:400}}><thead><tr><th>API</th><th>오늘</th><th>이번 달</th><th>공통 월 한도 대비</th></tr></thead><tbody>
    {['블로그','웹문서'].map((name,i)=><tr key={name}><th scope="row">{name}</th><td>{counts[i*2].toLocaleString()}회</td><td>{counts[i*2+1].toLocaleString()}회</td><td>{(counts[i*2+1]/LIMIT*100).toFixed(3)}%</td></tr>)}
    <tr><th scope="row">합계</th><td>{(counts[0]+counts[2]).toLocaleString()}회</td><td>{total!.toLocaleString()}회</td><td>{(total!/LIMIT*100).toFixed(3)}%</td></tr>
   </tbody></table></div>
   <progress aria-label="홈페이지 기록 기준 월 한도 사용률" value={Math.min(total!,LIMIT)} max={LIMIT} style={{width:'100%',marginTop:12}}/>
   <p>이 기록 기준 남은 한도: {Math.max(0,LIMIT-total!).toLocaleString()}회</p>
  </>}
  <p>대기 중인 검색은 제외하고, API로 전송된 요청은 오류 응답도 포함합니다. 검색어를 지우거나 수동 결과를 초기화해도 사용량은 유지됩니다.</p>
  <p>PC 확장 프로그램의 수동 검색은 API 사용량에 포함되지 않습니다. 다른 프로그램의 호출·삭제된 서버 기록은 집계하지 못하므로, 실제 사용량과 잔여 한도는 네이버 콘솔을 확인하세요.</p>
  <p><a href="https://console.ncloud.com/naver-api-hub/application" target="_blank" rel="noopener noreferrer">네이버 API HUB 공식 사용량 확인 ↗</a> · <a href="https://guide.ncloud-docs.com/docs/apihub-overview" target="_blank" rel="noopener noreferrer">무료 정책·공통 한도 안내 ↗</a></p>
  {updated&&<small>마지막 갱신: {new Date(updated).toLocaleString('ko-KR',{timeZone:'Asia/Seoul'})} · 1분마다 갱신</small>}
 </details></section>;
}
