'use client';
import {useState} from 'react';
import type {SupabaseClient} from '@supabase/supabase-js';
import type {CasePost} from '@/lib/supabase';

type Candidate={name:string;path:string;created_at?:string};
const bucket='case-images';
const uuidFile=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|jpeg|png|webp|gif|heic|avif)$/i;
function pathFromUrl(url:string,origin:string){
 try{
  const parsed=new URL(url);
  if(parsed.origin!==new URL(origin).origin)return null;
  const prefix='/storage/v1/object/public/'+bucket+'/';
  if(!parsed.pathname.startsWith(prefix))return null;
  return decodeURIComponent(parsed.pathname.slice(prefix.length));
 }catch{return null}
}
async function usedPaths(client:SupabaseClient){
 const paths=new Set<string>(),origin=process.env.NEXT_PUBLIC_SUPABASE_URL||'';
 for(let offset=0;;offset+=500){
  const {data,error}=await client.from('case_posts').select('before_url,after_url,gallery').order('id').range(offset,offset+499);
  if(error)throw error;
  for(const item of (data||[]) as Pick<CasePost,'before_url'|'after_url'|'gallery'>[]){
   for(const url of [item.before_url,item.after_url,...(item.gallery||[])]){
    if(typeof url==='string'){const path=pathFromUrl(url,origin);if(path)paths.add(path)}
   }
  }
  if(!data||data.length<500)break;
  if(offset>49500)throw Error('게시글이 너무 많아 안전하게 전체 조회할 수 없습니다.');
 }
 return paths;
}
async function candidates(client:SupabaseClient,userId:string){
 const found:Candidate[]=[];
 for(let offset=0;;offset+=100){
  const {data,error}=await client.storage.from(bucket).list(userId,{limit:100,offset,sortBy:{column:'name',order:'asc'}});
  if(error)throw error;
  for(const file of data||[]){
   if(!uuidFile.test(file.name)||!file.id||!file.created_at)continue;
   const age=Date.now()-new Date(file.created_at).getTime();
   if(!Number.isFinite(age)||age<24*60*60*1000)continue;
   found.push({name:file.name,path:userId+'/'+file.name,created_at:file.created_at});
  }
  if(!data||data.length<100)break;
  if(offset>99900)throw Error('사진이 너무 많아 안전하게 전체 조회할 수 없습니다.');
 }
 const used=await usedPaths(client);
 return found.filter(file=>!used.has(file.path));
}
export default function OrphanImageCleanup({client,userId}:{client:SupabaseClient;userId:string}){
 const [found,setFound]=useState<Candidate[]|null>(null),[selected,setSelected]=useState(false),[busy,setBusy]=useState(false),[message,setMessage]=useState('');
 async function scan(){
  setBusy(true);setMessage('');setSelected(false);setFound(null);
  try{const result=await candidates(client,userId);setFound(result);setMessage('현재 게시글에서 사용하지 않는 사진 후보를 조회했습니다.');}
  catch(e){setMessage(e instanceof Error?e.message:'조회에 실패했습니다.')}
  finally{setBusy(false)}
 }
 async function remove(){
  if(!found?.length||!selected||busy)return;
  if(!window.confirm('선택한 미사용 사진 후보를 영구 삭제할까요? 이 작업은 되돌릴 수 없습니다.'))return;
  setBusy(true);setMessage('');
  try{
   // Re-read both the file listing and ALL case references immediately before removal.
   const fresh=await candidates(client,userId);
   const approved=new Set(found.map(f=>f.path));
   const safe=fresh.filter(f=>approved.has(f.path));
   if(!safe.length){setFound([]);setMessage('삭제할 사진이 없습니다.');return}
   let removed=0;
   for(let i=0;i<safe.length;i+=50){
    const batch=safe.slice(i,i+50).map(f=>f.path);
    const {error}=await client.storage.from(bucket).remove(batch);
    if(error)throw Error(removed+'개 삭제 후 오류: '+error.message);
    removed+=batch.length;
   }
   setFound(null);setSelected(false);setMessage(removed+'개의 미사용 사진을 삭제했습니다. 다시 조회해 확인할 수 있습니다.');
  }catch(e){setFound(null);setSelected(false);setMessage((e instanceof Error?e.message:'삭제 실패')+' 다시 조회해 주세요.')}
  finally{setBusy(false)}
 }
 return <section style={{margin:'32px 0',padding:20,border:'1px solid #ddd',borderRadius:12}}>
  <h2>사용하지 않는 사진 정리</h2>
  <p>현재 게시글에서 사용하지 않는 업로드 사진을 찾아 정리합니다. 24시간 이내 사진, 외부 사진, 다른 폴더의 사진은 제외합니다. 먼저 목록을 확인한 후 직접 삭제를 승인해야 합니다.</p>
  <button type="button" disabled={busy} onClick={scan}>{busy?'처리 중...':'미사용 사진 조회'}</button>
  {found&&<div style={{marginTop:16}}>
   <p><strong>삭제 후보 {found.length}개</strong> — 현재 게시글에서 참조하지 않는 사진입니다.</p>
   {found.length>0&&<>
    <div style={{maxHeight:260,overflowY:'auto',border:'1px solid #eee',padding:8}}>
     {found.map(f=><div key={f.path} style={{fontSize:12,padding:4,overflowWrap:'anywhere'}}>{f.name}</div>)}
    </div>
    <label style={{display:'block',margin:'12px 0'}}><input type="checkbox" checked={selected} onChange={e=>setSelected(e.target.checked)}/> 목록을 확인했으며 원본 사진이 영구 삭제되는 것에 동의합니다.</label>
    <button type="button" disabled={busy||!selected} onClick={remove} style={{color:'#b42318'}}>미사용 사진 {found.length}개 삭제</button>
   </>}
  </div>}
  {message&&<p role="status">{message}</p>}
 </section>
}
