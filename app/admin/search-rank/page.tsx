'use client';
import {useEffect,useRef,useState} from 'react';
import type {User} from '@supabase/supabase-js';
import {supabaseClient} from '@/lib/supabase';
import ApiUsage from './ApiUsage';
import {latestResults,type Row,type Scheduled} from './results';
import {rankColor} from './rankColor';
import './rank.css';
type Config={screenScope?:string;words:string[];target:string;time:string;enabled:boolean;saved:string};
type Result={version?:string;error?:string;count?:number;targets?:{type:string;hits:{rank:number;title:string;url:string}[]}[]};
const wordsOf=(text:string)=>Array.from(new Set(text.split('\n').map(w=>w.trim()).filter(Boolean)));
const searchUrl=(word:string)=>'https://search.naver.com/search.naver?'+new URLSearchParams({where:'nexearch',query:word});
const korea=(time:string)=>new Date(time).toLocaleString('ko-KR',{timeZone:'Asia/Seoul'});
function bridge(type:string,payload:object={}):Promise<Result>{
 return new Promise((resolve,reject)=>{
  const id=crypto.randomUUID();
  const listener=(e:MessageEvent)=>{if(e.source!==window||e.origin!==location.origin||e.data?.source!=='ssg-rank-extension'||e.data.id!==id)return;clearTimeout(timer);window.removeEventListener('message',listener);const result=e.data.result||{};if(result.error&&type!=='scan')reject(Error(result.error));else resolve(result);};
  const timer=setTimeout(()=>{window.removeEventListener('message',listener);reject(Error(type==='ping'?'PC에 연결 프로그램을 설치하고 페이지를 새로고침하세요.':'검색 시간 초과. 검색 탭을 확인하세요.'));},type==='scan'?55000:5000);
  window.addEventListener('message',listener);window.postMessage({source:'ssg-rank-page',id,type,...payload},location.origin);
 });
}
export default function SearchRankAdmin(){
 const [client]=useState(()=>supabaseClient()),[user,setUser]=useState<User|null>(null),[allowed,setAllowed]=useState(false),[loading,setLoading]=useState(true);
 const [keywords,setKeywords]=useState(''),[target,setTarget]=useState('both'),[tab,setTab]=useState('블로그'),[time,setTime]=useState('09:00'),[enabled,setEnabled]=useState(false),[saved,setSaved]=useState<Config|null>(null);
 const [rows,setRows]=useState<Row[]>([]),[jobs,setJobs]=useState<Scheduled[]>([]),[message,setMessage]=useState(''),[jobError,setJobError]=useState(''),[ready,setReady]=useState(false),[sharedReady,setSharedReady]=useState(false),[limit,setLimit]=useState(50);
 const [screenScope,setScreenScope]=useState('both');
 const [running,setRunning]=useState(false),[saving,setSaving]=useState(false),[filter,setFilter]=useState(''),[delay,setDelay]=useState(1000),[elapsed,setElapsed]=useState(0);
 const stop=useRef(false),started=useRef(0),liveUser=useRef<string|null>(null);
 useEffect(()=>{
  if(!client){setLoading(false);return;}
  const apply=(u:User|null)=>{if(liveUser.current!==(u?.id||null)){stop.current=true;setAllowed(false);setRows([]);setJobs([]);}liveUser.current=u?.id||null;setUser(prev=>prev?.id===u?.id?prev:u);};
  client.auth.getUser().then(({data})=>apply(data.user)).finally(()=>setLoading(false));
  const {data:{subscription}}=client.auth.onAuthStateChange((_e,s)=>apply(s?.user||null));
  return()=>{stop.current=true;subscription.unsubscribe();};
 },[client]);
 useEffect(()=>{
  if(!client||!user)return;let active=true;
  (async()=>{
   try{
    const {data:{session}}=await client.auth.getSession();
    const response=await fetch('/api/admin/search-rank/',{headers:{Authorization:'Bearer '+session?.access_token},cache:'no-store'});
    if(!response.ok)throw Error('관리자 권한 확인 실패');
    const {data:{user:fresh}}=await client.auth.getUser();
    const config=fresh?.user_metadata.rank_schedule as Config|undefined;
    const raw=localStorage.getItem('ssg-rank-'+user.id);let local:{keywords?:string;rows?:Row[]}={};
    try{local=raw?JSON.parse(raw):{};}catch{}
    if(!active)return;
    setAllowed(true);setRows(local.rows||[]);
    setKeywords(config?.words?.join('\n')??local.keywords??'부산 싱크볼 교체');
    setScreenScope(config?.target==='홈페이지'&&config?.screenScope==='blog'?'web':config?.screenScope||'both');setTarget(config?.target||'both');setTime(config?.time||'09:00');setEnabled(config?.enabled||false);setSaved(config||null);
   }catch(e){if(active)setMessage(e instanceof Error?e.message:'불러오기 실패');}
  })();return()=>{active=false;};
 },[client,user]);
 useEffect(()=>{
  if(!client||!user||!allowed)return;let active=true,busy=false;
  async function refresh(){
   if(busy)return;busy=true;
   try{
    const [state,version,cap]=await Promise.all([client!.rpc('rank_schedule_ready'),client!.rpc('rank_shared_config_version'),client!.rpc('rank_keyword_limit')]);
    if(!active)return;setReady(!state.error&&state.data===true);setSharedReady(!version.error&&version.data===1);setLimit(cap.data===200?200:50);
    const result=await client!.from('rank_observations').select('id,day,keyword,target,status,position,link,sent').eq('owner',user!.id).order('day',{ascending:false}).order('id',{ascending:false}).limit(1000);
    if(result.error)throw Error('예약 결과를 불러오지 못했습니다. 잠시 후 새로고침하세요.');
    if(active){setJobs(result.data||[]);setJobError('');}
   }catch(e){if(active)setJobError(e instanceof Error?e.message:'예약 결과 조회 실패');}
   finally{busy=false;}
  }
  void refresh();const timer=setInterval(refresh,15000);return()=>{active=false;clearInterval(timer);};
 },[client,user,allowed]);
 useEffect(()=>{if(!running)return;const timer=setInterval(()=>setElapsed(Math.floor((Date.now()-started.current)/1000)),1000);return()=>clearInterval(timer);},[running]);
 const words=wordsOf(keywords),targets=target==='both'?['블로그','홈페이지']:[target];
 const activeTab=targets.includes(tab)?tab:targets[0];
 const results=latestResults(words,activeTab,rows,jobs);
 const last=results.filter(r=>r.time).sort((a,b)=>b.time.localeCompare(a.time))[0];
 const shown=results.filter(r=>r.keyword.includes(filter.trim()));
 const dirty=!saved||screenScope!==(saved.screenScope||'both')||JSON.stringify(words)!==JSON.stringify(saved.words)||target!==(saved.target||'both')||time!==saved.time||enabled!==saved.enabled;
 function persist(next:Row[]){if(user)localStorage.setItem('ssg-rank-'+user.id,JSON.stringify({keywords,rows:next}));}
 async function save(){
  if(!client||!user||!allowed)return false;
  if(!words.length||words.length>limit||words.some(w=>w.length>150)){setMessage('검색어는 1~'+limit+'개, 각 150자 이내로 입력하세요.');return false;}
  if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)){setMessage('예약 시간을 확인하세요.');return false;}
  if(enabled&&!sharedReady){setMessage('예약에 공통 확인 대상을 적용하려면 아래 서버 업데이트 SQL을 먼저 실행해 주세요.');return false;}
  setSaving(true);
  try{
   const config={words,target,screenScope,time,enabled,saved:new Date().toISOString()};
   const {error}=await client.auth.updateUser({data:{rank_schedule:config}});if(error)throw error;
   setSaved(config);persist(rows);setMessage('수동·예약 공통 설정을 저장했습니다.');return true;
  }catch{setMessage('설정 저장 실패. 다시 시도해 주세요.');return false;}finally{setSaving(false);}
 }
 async function run(){
  if(running||saving||!user)return;
  if(dirty&&!await save())return;
  setRunning(true);stop.current=false;started.current=Date.now();setElapsed(0);
  let next:Row[]=[];
  try{
   const connection=await bridge('ping');if(connection.version!=='1.2.3')throw Error('연결 프로그램 v1.2.3으로 업데이트하고 이 페이지를 새로고침하세요.');setRows([]);persist([]);
   const modes=screenScope==='both'?(targets.includes('블로그')?['web','blog']:['web']):[screenScope];
   const scans=words.flatMap(keyword=>modes.map(mode=>({keyword,mode})));
   for(let i=0;i<scans.length;i++){
    if(stop.current||liveUser.current!==user.id)break;
    const {keyword,mode}=scans[i];setMessage((i+1)+'/'+scans.length+' · '+keyword+' · '+(mode==='web'?'PC 통합':'PC 블로그 탭'));
    let r:Result;try{r=await bridge('scan',{keyword,mode});}catch(e){r={error:e instanceof Error?e.message:'조회 실패'};}
    if(stop.current||liveUser.current!==user.id)break;
    if(r.error&&/보안|연결 오류|시간 초과|다른 검색/.test(r.error))throw Error(r.error);
    const stamp=new Date().toISOString();
    for(const type of targets){
     if(mode==='blog'&&type==='홈페이지')continue;
     const hits=r.targets?.find(t=>t.type===type)?.hits||[];
     for(const hit of hits.length?hits:[null])next.push({keyword,mode,type,time:stamp,rank:hit?.rank??null,scope:r.count||0,title:hit?.title||'',url:hit?.url||searchUrl(keyword),error:r.error||(!r.count?'검색 결과 인식 실패':undefined)});
    }
    setRows([...next]);persist(next);
    if(i<scans.length-1)await new Promise(r=>setTimeout(r,delay));
   }
   const failures=next.filter(r=>r.error);setMessage(stop.current?'중지했습니다.':failures.length?'조회 종료 · 실패 '+failures.length+'건 · '+failures[0].error:'조회 완료');
  }catch(e){setMessage(e instanceof Error?e.message:'조회 실패');}finally{try{await bridge('finish');}catch{}setElapsed(Math.floor((Date.now()-started.current)/1000));setRunning(false);document.getElementById('rank-results-heading')?.scrollIntoView({behavior:'smooth',block:'start'});}
 }
 function csv(){
  const cell=(v:unknown)=>{let s=String(v??'');if(/^[\s]*[=+@-]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';};
  const data=[['검색어','방식','조회 시간(한국)','기준','순위','글 제목','링크'],...results.flatMap(r=>r.rows.map(x=>[r.keyword,r.source==='manual'?'수동':'예약',korea(x.time),x.mode==='api'?'검색 API':x.mode==='web'?'PC 통합':'PC 블로그 탭',x.error?'조회 실패':x.rank??'미발견',x.title,x.url]))];
  const url=URL.createObjectURL(new Blob(['\uFEFF'+data.map(r=>r.map(cell).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'}));
  const a=document.createElement('a');a.href=url;a.download='신세계싱크_최신검색결과.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
 if(loading)return <div className="wrap section">로그인 확인 중…</div>;
 if(!user)return <div className="wrap section"><a href="/admin/cases/">관리자 로그인</a></div>;
 if(!allowed)return <div className="wrap section">{message||'관리자 권한 확인 중…'}</div>;
 return <div className="wrap section rank-page" style={{maxWidth:1100}}>
  <div className="rank-heading"><h1>검색 노출 확인</h1><a href="/admin/cases/">관리자 홈</a></div>
  <section className="rank-panel">
   <div className="rank-heading"><h2>검색 설정</h2><span>{words.length}개 검색어 · {dirty?'저장하지 않은 변경 있음':'저장됨'}</span></div>
   <p>검색어와 대상을 저장하고, PC에서 확인할 영역을 선택하세요. 예약 API는 PC 통합검색·블로그 탭을 직접 조회하지 않습니다.</p>
   <label htmlFor="keywords">검색어 · 한 줄에 하나씩</label>
   <textarea id="keywords" disabled={running||saving} value={keywords} rows={5} onChange={e=>{setKeywords(e.target.value);setRows([]);}} style={{width:'100%',padding:12,margin:'8px 0 16px'}}/>
   <div className="rank-settings-row">
    <label>대상 <select disabled={running||saving} value={target} onChange={e=>{setTarget(e.target.value);if(e.target.value==='홈페이지'&&screenScope==='blog')setScreenScope('web');}}><option value="both">블로그 + 홈페이지</option><option value="블로그">블로그</option><option value="홈페이지">홈페이지</option></select></label>
    <label>PC 확인 영역 <select disabled={running||saving} value={screenScope} onChange={e=>setScreenScope(e.target.value)}><option value="both">통합검색 + 블로그 탭</option><option value="web">통합검색</option><option value="blog" disabled={target==='홈페이지'}>블로그 탭</option></select></label>
    <label><input type="checkbox" disabled={running||saving} checked={enabled} onChange={e=>setEnabled(e.target.checked)}/> 매일 예약 검색</label>
    <label>예약 시간 (한국) <input type="time" disabled={running||saving} value={time} onChange={e=>setTime(e.target.value)}/></label>
   </div>
   <div className="rank-settings-row" style={{marginTop:18}}>
    <button disabled={running||saving||!dirty} onClick={save}>{saving?'저장 중…':'설정 저장'}</button>
    <button className="btn-primary" disabled={running||saving} onClick={run}>지금 검색</button>
    {running&&<button onClick={()=>{stop.current=true;setMessage('현재 검색 후 중지합니다.');}}>중지</button>}
    <span>{saved?.enabled?'매일 '+saved.time+' 예약됨':'예약 꺼짐'} · {ready?'서버 연결됨':'예약 서버 준비 필요'}</span>
   </div>
   <p role="status">{message}{running&&' · '+Math.floor(elapsed/60)+'분 '+elapsed%60+'초'}</p>
   {!sharedReady&&<p className="rank-setup-note">예약 확인 대상 통합을 위한 서버 업데이트가 필요합니다. <a href="/downloads/rank-shared-settings.sql" download>업데이트 SQL 다운로드</a> → Supabase SQL Editor에서 한 번 실행해 주세요. 기존 예약은 업데이트 전까지 기존 대상대로 실행됩니다.</p>}
   <details><summary>PC 연결 프로그램 및 검색 속도</summary><p><a href="/downloads/naver-rank-v1.2.3.zip" download>연결 프로그램 v1.2.3 다운로드</a> · 압축 해제 후 chrome://extensions에서 개발자 모드 → 압축해제된 확장 프로그램 로드 → 이 페이지 새로고침</p><label>검색 사이 대기 <select disabled={running} value={delay} onChange={e=>setDelay(Number(e.target.value))}><option value={500}>0.5초</option><option value={1000}>1초</option><option value={3000}>3초</option></select></label><p>수동 검색은 PC 연결 프로그램이 필요합니다. 예약 검색은 컴퓨터를 꺼도 서버에서 실행됩니다.</p></details>
  </section>
  <section className="rank-panel">
   <div className="rank-heading"><h2 id="rank-results-heading">{activeTab} 노출 순위</h2><span>{last?<>{last.source==='manual'?'수동 검색':'예약 검색'} · {korea(last.time)}</>:'아직 조회 기록 없음'}</span></div>
   <div className="rank-settings-row"><div role="group" aria-label="확인 대상">{targets.map(t=><button key={t} aria-pressed={activeTab===t} onClick={()=>setTab(t)}>{t}</button>)}</div><input aria-label="검색어 찾기" placeholder="검색어 찾기" value={filter} onChange={e=>setFilter(e.target.value)}/><button disabled={!results.some(r=>r.rows.length)} onClick={csv}>CSV 다운로드</button></div>
   <p>검색어별 최신 결과입니다. 색상은 PC 통합검색 순위 기준입니다. API 숫자는 실제 블로그 탭 순위와 다르며, API로 확인할 수 없는 통합검색은 —로 표시합니다.</p>
   {jobError&&<p role="alert">{jobError}</p>}
   <div className="rank-list"><table><thead><tr><th>검색어</th><th>통합검색</th><th>{activeTab==='블로그'?'블로그 탭':'웹문서 API'}</th><th>노출된 글</th></tr></thead><tbody>{shown.map(r=>{
    const integrated=r.rows.filter(x=>x.mode==='web'&&!x.error&&x.rank!=null).map(x=>x.rank!);
    const color=rankColor(integrated.length?Math.min(...integrated):null);
    const position=(mode:string)=>{
     const batch=r.rows.filter(x=>x.mode===mode),hits=batch.filter(x=>x.rank!=null&&!x.error);
     if(!batch.length)return <span>{r.source==='scheduled'&&mode==='web'?'—':'미확인'}</span>;
     return <div className="rank-positions">{mode==='api'&&<span title="검색 API 기준이며 PC 화면 순위가 아닙니다">API</span>}{hits.length?hits.map(x=><a key={x.url+x.rank} href={x.url} title={x.title} target="_blank" rel="noopener noreferrer">{x.rank}위</a>):batch.some(x=>x.error)?<span title={batch.find(x=>x.error)?.error}>조회 실패</span>:'미발견'}</div>;
    };
    return <tr key={r.keyword} className={color}><th scope="row"><a href={searchUrl(r.keyword)} target="_blank" rel="noopener noreferrer">{r.keyword}</a></th><td>{position('web')}</td><td>{position(r.source==='scheduled'||activeTab==='홈페이지'?'api':'blog')}</td><td className="rank-excerpt">{r.rows.filter(x=>x.rank!=null&&!x.error&&x.url).map(x=><a key={x.mode+x.url+x.rank} href={x.url} target="_blank" rel="noopener noreferrer" title={x.mode==='api'?'글 보기':x.title}>{x.mode==='api'?'API':x.mode==='web'?'통합':'블로그 탭'} {x.rank}위 · {x.mode==='api'?'글 보기':x.title||'글 보기'}</a>)}</td></tr>;
   })}</tbody></table></div>
   {!shown.length&&<p>표시할 검색어가 없습니다.</p>}
   <small>예약 시간 표시는 서버 요청 시작 시각입니다. 예약 결과는 15초마다 갱신합니다. 수동 기록은 현재 기기에 저장됩니다.</small>
  </section>
  <ApiUsage client={client!} owner={user.id}/>
 </div>;
}
