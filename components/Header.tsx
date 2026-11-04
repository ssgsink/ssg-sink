'use client';
import {useEffect,useState} from 'react';
import {supabaseClient} from '@/lib/supabase';

const links=[['홈','/'],['업체소개','/about/'],['시공사례','/cases/'],['상담문의','/contact/']];
export default function Header(){
 const [isAdmin,setIsAdmin]=useState(false);
 useEffect(()=>{
  const client=supabaseClient();
  if(!client)return;
  let active=true;
  client.auth.getUser().then(({data})=>{if(active)setIsAdmin(Boolean(data.user))}).catch(()=>{if(active)setIsAdmin(false)});
  const {data:{subscription}}=client.auth.onAuthStateChange((_event,session)=>{if(active)setIsAdmin(Boolean(session?.user))});
  return()=>{active=false;subscription.unsubscribe()};
 },[]);
 return <header className="site-header ref-site-header"><div className="wrap header-inner"><a className="brand" href="/">⌂ 신세계싱크<small>SHINSEGAE SINK</small></a><span className="ref-header-tag">부산·경남 싱크볼 교체 전문</span><nav className="nav">{links.map(([t,u])=><a key={u} href={u}>{t}</a>)}{isAdmin&&<><a href="/admin/cases/" style={{fontWeight:700}}>시공 사례 관리</a><a href="/admin/analytics/" style={{fontWeight:700}}>방문자 분석</a></>}</nav></div></header>;
}