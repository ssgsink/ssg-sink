'use client';
import {useEffect,useState} from 'react';
import {supabaseClient} from '@/lib/supabase';
export default function CaseActions({caseId}:{caseId?:string}){
 const [authorized,setAuthorized]=useState(false);
 useEffect(()=>{const client=supabaseClient();if(!client)return;let active=true;const check=async()=>{const {data}=await client.auth.getUser();if(active)setAuthorized(data.user?.email==='ssg-sink@naver.com')};void check();const {data:{subscription}}=client.auth.onAuthStateChange(()=>{void check()});return()=>{active=false;subscription.unsubscribe()}},[]);
 if(!authorized)return null;
 return <div style={{display:'flex',gap:10,flexWrap:'wrap',margin:'16px 0'}}>{!caseId?<a className="btn-primary" href="/admin/cases/">＋ 새 시공 사례 작성</a>:<a href={'/admin/cases/?edit='+encodeURIComponent(caseId)} style={{border:'1px solid #bbb',padding:'7px 14px',borderRadius:6}}>수정 · 삭제</a>}</div>
}
