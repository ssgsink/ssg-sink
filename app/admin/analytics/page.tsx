'use client';
import {useEffect,useState,type FormEvent} from 'react';
import {supabaseClient} from '@/lib/supabase';
import type {User} from '@supabase/supabase-js';
type Row={dimensionValues?:{value:string}[];metricValues?:{value:string}[]};
type Data={configured?:boolean;error?:string;summary?:Row[];channels?:Row[];pages?:Row[];trend?:Row[]};
const value=(r:Row|undefined,i=0)=>Number(r?.metricValues?.[i]?.value||0);
const dim=(r:Row|undefined,i=0)=>r?.dimensionValues?.[i]?.value||'기타';
const channel=(s:string)=>({'Organic Search':'검색 유입','Direct':'직접 방문','Referral':'다른 사이트','Organic Social':'SNS','Paid Search':'유료 검색','Unassigned':'기타'}[s]||s);
export default function AnalyticsAdmin(){
 const [client]=useState(()=>supabaseClient());
 const [user,setUser]=useState<User|null>(null);
 const [loading,setLoading]=useState(true),[data,setData]=useState<Data|null>(null);
 const [email,setEmail]=useState(''),[password,setPassword]=useState(''),[message,setMessage]=useState('');
 useEffect(()=>{if(!client){setLoading(false);return}client.auth.getUser().then(({data})=>{setUser(data.user);setLoading(false)}).catch(()=>setLoading(false));const {data:{subscription}}=client.auth.onAuthStateChange((_e,s)=>setUser(s?.user||null));return ()=>subscription.unsubscribe()},[client]);
 useEffect(()=>{if(!user||!client){setData(null);return}let cancelled=false;setLoading(true);client.auth.getSession().then(async({data:{session}})=>{if(!session)throw Error('로그인이 필요합니다.');const r=await fetch('/api/admin/analytics/',{headers:{Authorization:'Bearer '+session.access_token},cache:'no-store'});const d=await r.json() as Data;if(!cancelled)setData(d)}).catch(e=>{if(!cancelled)setData({error:e instanceof Error?e.message:'데이터를 불러오지 못했습니다.'})}).finally(()=>{if(!cancelled)setLoading(false)});return()=>{cancelled=true}},[client,user]);
 async function login(e:FormEvent){e.preventDefault();if(!client)return;const {error}=await client.auth.signInWithPassword({email,password});setMessage(error?.message||'로그인되었습니다.')}
 if(!client)return <main className="wrap section"><h1>방문자 분석</h1><p>Supabase 환경 변수를 확인해 주세요.</p></main>;
 if(loading&&!user)return <div className="wrap section">로그인 확인 중...</div>;
 if(!user)return <div className="wrap section" style={{maxWidth:520}}><h1>관리자 로그인</h1><p>시공 사례 관리자와 동일한 계정으로 로그인하세요.</p><form onSubmit={login} style={{display:'grid',gap:12}}><input type="email" required placeholder="이메일" value={email} onChange={e=>setEmail(e.target.value)} style={{padding:12}}/><input type="password" required placeholder="비밀번호" value={password} onChange={e=>setPassword(e.target.value)} style={{padding:12}}/><button className="btn-primary">로그인</button></form><p role="status">{message}</p></div>;
 const summary=data?.summary||[];
 const metrics=[['오늘 방문자',value(summary[0])],['어제 방문자',value(summary[1])],['최근 7일',value(summary[2])],['최근 30일',value(summary[3])]];
 const channels=data?.channels||[],pages=data?.pages||[],trend=data?.trend||[];
 const max=Math.max(1,...trend.map(x=>value(x)));
 return <div className="wrap section admin-analytics">
  <div className="admin-analytics-head"><div><span className="site-kicker">SHINSEGAE SINK · ADMIN</span><h1>방문자 분석</h1><p>Google Analytics 4 기준 · 한국 시간 기준은 GA4 속성 시간대 설정을 따릅니다.</p></div><div><a href="/admin/cases/">시공 사례 관리</a> <button type="button" onClick={()=>client.auth.signOut()}>로그아웃</button></div></div>
  {loading?<p>방문자 데이터를 불러오는 중...</p>:data?.error?<div className="admin-analytics-notice"><strong>{data.configured?'통계 조회 오류':'분석 연결 설정 필요'}</strong><p>{data.error}</p><p>설정이 완료되면 실제 방문자 수와 유입 경로가 표시됩니다. 임의의 수치는 표시하지 않습니다.</p></div>:<>
   <div className="admin-analytics-metrics">{metrics.map(([label,n])=><div key={label}><span>{label}</span><strong>{Number(n).toLocaleString('ko-KR')}<small>명</small></strong></div>)}</div>
   <section><h2>최근 14일 방문 추이</h2><div className="admin-analytics-chart">{trend.map((r,i)=><div key={i} title={dim(r)+': '+value(r)+'명'}><span style={{height:Math.max(3,value(r)/max*100)+'%'}}/><small>{dim(r).slice(4,6)}/{dim(r).slice(6,8)}</small></div>)}</div></section>
   <section><h2>유입 경로 <small>최근 30일 · 세션 수</small></h2>{channels.length?channels.map((r,i)=><div className="admin-analytics-list" key={i}><span>{channel(dim(r))} <small>· {dim(r,1)}</small></span><strong>{value(r).toLocaleString('ko-KR')}회</strong></div>):<p>수집된 데이터가 없습니다.</p>}</section>
   <section><h2>인기 페이지 <small>최근 30일 · 조회 수</small></h2>{pages.length?pages.map((r,i)=><div className="admin-analytics-list" key={i}><a href={dim(r)} target="_blank" rel="noopener noreferrer">{dim(r)}</a><strong>{value(r).toLocaleString('ko-KR')}회</strong></div>):<p>수집된 데이터가 없습니다.</p>}</section>
   <p className="admin-analytics-note">방문자 수는 GA4의 사용자 수입니다. 유입 경로는 세션 기준이며, 개인정보 보호 설정과 광고 차단 등으로 실제 방문과 차이가 있을 수 있습니다. 검색어 상세 정보는 Google Search Console에서 별도로 확인합니다.</p>
  </>}
 </div>;
}
