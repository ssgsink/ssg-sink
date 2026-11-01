'use client';
import {useEffect,useState} from 'react';
import {supabaseClient} from '@/lib/supabase';
import {deleteCaseAndImages} from '@/lib/delete-case';

export default function CaseActions({caseId}:{caseId?:string}){
 const [authorized,setAuthorized]=useState(false);
 const [deleting,setDeleting]=useState(false);
 const [error,setError]=useState('');
 useEffect(()=>{
  const client=supabaseClient();if(!client)return;
  let active=true;
  const check=async()=>{const {data}=await client.auth.getUser();if(active)setAuthorized(data.user?.email==='ssg-sink@naver.com')};
  void check();
  const {data:{subscription}}=client.auth.onAuthStateChange(()=>{void check()});
  return()=>{active=false;subscription.unsubscribe()};
 },[]);
 async function remove(){
  if(!caseId||deleting||!authorized||!window.confirm('이 시공 사례를 삭제하시겠습니까? 삭제한 사례는 복구할 수 없습니다.'))return;
  const client=supabaseClient();if(!client)return;
  setDeleting(true);setError('');
  try{
   const result=await deleteCaseAndImages(client,caseId);
   if(result.warning){setError(result.warning);setDeleting(false);return;}
   window.location.reload();
  }catch(e){setError(e instanceof Error?e.message:'삭제하지 못했습니다. 다시 시도해 주세요.');setDeleting(false)}
 }
 if(!authorized)return null;
 return <div style={{margin:'16px 0'}}>
  <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
   {!caseId?<a className="btn-primary" href="/admin/cases/">＋ 새 시공 사례 작성</a>:<>
    <a href={'/admin/cases/?edit='+encodeURIComponent(caseId)} style={{border:'1px solid #bbb',padding:'7px 14px',borderRadius:6}}>수정</a>
    <button type="button" onClick={remove} disabled={deleting} style={{border:'1px solid #c33',color:'#b42318',background:'transparent',padding:'7px 14px',borderRadius:6,cursor:deleting?'wait':'pointer'}}>{deleting?'삭제 중...':'삭제'}</button>
   </>}
  </div>
  {error&&<p role="alert" style={{color:'#b42318'}}>{error}</p>}
 </div>;
}
