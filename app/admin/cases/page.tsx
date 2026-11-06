'use client';
import {useEffect,useState,type FormEvent} from 'react';
import {supabaseClient,type CasePost} from '@/lib/supabase';
import type {User} from '@supabase/supabase-js';
import {deleteCaseAndImages} from '@/lib/delete-case';
import OrphanImageCleanup from '@/components/OrphanImageCleanup';
import CaseRichEditor from '@/components/CaseRichEditor';
import CasePhotoDropzone from '@/components/CasePhotoDropzone';
const serviceRegions=['부산','창원','마산','진해','김해','양산','진주','사천','거제','통영','고성','창녕','함안','밀양','기타 지역'];
export default function CaseAdmin(){
 const [client]=useState(()=>supabaseClient()),[user,setUser]=useState<User|null>(null),[email,setEmail]=useState(''),[password,setPassword]=useState(''),[loading,setLoading]=useState(true),[message,setMessage]=useState('');
 const [editorKey,setEditorKey]=useState(0);
 const [readError,setReadError]=useState(''),[items,setItems]=useState<CasePost[]>([]),[editing,setEditing]=useState<string|null>(null),[title,setTitle]=useState(''),[region,setRegion]=useState(''),[description,setDescription]=useState(''),[cover,setCover]=useState<File|null>(null),[details,setDetails]=useState(''),[gallery,setGallery]=useState<{url?:string;file?:File;name:string}[]>([]),[galleryKey,setGalleryKey]=useState(0),[saving,setSaving]=useState(false),[coverInputKey,setCoverInputKey]=useState(0);
 useEffect(()=>{if(!client){setLoading(false);return}client.auth.getUser().then(({data})=>{setUser(data.user);setLoading(false)});const {data:{subscription}}=client.auth.onAuthStateChange((_event,session)=>setUser(session?.user||null));return ()=>subscription.unsubscribe()},[client]);
 useEffect(()=>{if(user&&client)client.from('case_posts').select('*').order('created_at',{ascending:false}).then(({data,error})=>{setReadError(error?`조회 오류: ${error.message} (${error.code||'unknown'})`:'');const list=(data||[]) as CasePost[];setItems(list);const editId=new URLSearchParams(window.location.search).get('edit');const item=list.find(x=>x.id===editId);if(item){setEditing(item.id);setTitle(item.title);setRegion(item.region);setDescription(item.description);setDetails(item.details||'');setEditorKey(k=>k+1);setGallery((item.gallery||[]).map(url=>({url,name:'등록된 사진'})))}})},[client,user]);
 async function login(e:FormEvent){e.preventDefault();if(!client)return;setMessage('');const {error}=await client.auth.signInWithPassword({email,password});setMessage(error?error.message:'로그인되었습니다.')}
 function reset(){window.history.replaceState(null,'','/admin/cases/');setEditing(null);setTitle('');setRegion('');setDescription('');setDetails('');setEditorKey(k=>k+1);setGallery([]);setGalleryKey(k=>k+1);setCover(null);setCoverInputKey(k=>k+1)}
 const [saveStage,setSaveStage]=useState('');
 const [lastError,setLastError]=useState('');
 const wait=(ms:number)=>new Promise(resolve=>setTimeout(resolve,ms));
 function errorText(error:unknown,stage:string){
  const e=error as {message?:string;status?:number;code?:string};
  const msg=e?.message||String(error);
  if(/failed to fetch|networkerror|load failed|fetch failed/i.test(msg))return stage+' 중 네트워크 연결에 실패했습니다. 인터넷 연결 또는 Supabase 서비스 상태를 확인한 뒤 다시 저장해 주세요. 작성한 내용은 화면에 그대로 남아 있습니다.';
  return stage+' 실패: '+msg+(e?.code?' ('+e.code+')':'');
 }
 async function upload(file:File){
  if(!client||!user)throw Error('로그인이 필요합니다.');
  const originalExt=(file.name.split('.').pop()||'').toLowerCase();
  const mime=file.type.toLowerCase();
  const isHeic=['heic','heif'].includes(originalExt)||/^image\/hei[cf]$/.test(mime);
  const allowed=['jpg','jpeg','png','webp','gif','heic','heif'].includes(originalExt)||['image/jpeg','image/png','image/webp','image/gif','image/heic','image/heif'].includes(mime);
  if(!allowed)throw Error('지원하지 않는 사진 형식입니다: '+file.name+'. JPG, PNG, WEBP, HEIC 사진을 선택해 주세요.');
  if(file.size>10*1024*1024)throw Error('사진 한 장의 크기는 10MB 이하여야 합니다: '+file.name+' ('+(file.size/1024/1024).toFixed(1)+'MB)');
  let target=file;
  // Detect actual file content: a JPEG renamed to .heic must not be decoded as HEIC.
  const header=new Uint8Array(await file.slice(0,16).arrayBuffer());
  const jpegSignature=header[0]===0xff&&header[1]===0xd8&&header[2]===0xff;
  const pngSignature=header[0]===0x89&&header[1]===0x50&&header[2]===0x4e&&header[3]===0x47;
  const webpSignature=String.fromCharCode(...header.slice(0,4))==='RIFF'&&String.fromCharCode(...header.slice(8,12))==='WEBP';
  if(jpegSignature&&isHeic){
   target=new File([file],file.name.replace(/\.hei[cf]$/i,'.jpg'),{type:'image/jpeg'});
  }else if(pngSignature&&isHeic){
   target=new File([file],file.name.replace(/\.hei[cf]$/i,'.png'),{type:'image/png'});
  }else if(webpSignature&&isHeic){
   target=new File([file],file.name.replace(/\.hei[cf]$/i,'.webp'),{type:'image/webp'});
  }else if(isHeic){
   setSaveStage('HEIC 사진 변환 중: '+file.name);
   try{
    const {heicTo}=await import('heic-to');
    const jpeg=await heicTo({blob:file,type:'image/jpeg',quality:0.85});
    if(!jpeg||jpeg.size===0)throw Error('변환 결과가 비어 있습니다.');
    target=new File([jpeg],file.name.replace(/\.hei[cf]$/i,'.jpg'),{type:'image/jpeg'});
   }catch(error){
    const reason=error instanceof Error?error.message:String(error);
    throw Error('HEIC 사진 변환 실패: '+file.name+' ('+reason+'). 원본 사진을 JPG로 내보내 다시 시도해 주세요.');
   }
  }
  const ext=(target.name.split('.').pop()||'jpg').toLowerCase();
  const path=user.id+'/'+crypto.randomUUID()+'.'+ext;
  for(let attempt=0;attempt<2;attempt++){
   try{
    const {error}=await client.storage.from('case-images').upload(path,target,{contentType:target.type||'image/jpeg',upsert:true});
    if(error)throw error;
    return client.storage.from('case-images').getPublicUrl(path).data.publicUrl;
   }catch(error){
    if(attempt===0&&/failed to fetch|networkerror|load failed|fetch failed/i.test(String((error as Error).message))){await wait(900);continue}
    throw new Error(errorText(error,'사진 업로드 ('+file.name+')'));
   }
  }
  throw Error('사진 업로드에 실패했습니다.');
 }
 async function save(e:FormEvent){
  e.preventDefault();if(!client||!user)return;
  if(!region.trim()){setMessage('시공 지역을 하나 이상 선택해 주세요.');return;}
  setSaving(true);setMessage('');setLastError('');
  let stage='저장 준비';
  try{
   const old=items.find(x=>x.id===editing);
   const uploadedGallery:string[]=[];
   for(let i=0;i<gallery.length;i++){
    const photo=gallery[i];
    stage='추가 사진 '+(i+1)+'/'+gallery.length+' 업로드';setSaveStage(stage);
    uploadedGallery.push(photo.file?await upload(photo.file):photo.url!);
   }
   stage='대표 사진 업로드';setSaveStage(stage);
   const after_url=cover?await upload(cover):old?.after_url||null;
   if(!after_url)throw Error('대표 사진을 등록해 주세요.');
   stage='시공 사례 데이터 저장';setSaveStage(stage);
   const payload={title,region,description,details,gallery:uploadedGallery,before_url:old?.before_url||null,after_url};
   // Do not automatically repeat a database insert: the first request might have succeeded.
   const result=editing?await client.from('case_posts').update(payload).eq('id',editing):await client.from('case_posts').insert({...payload,slug:crypto.randomUUID()});
   if(result.error)throw result.error;
   reset();
   setMessage('시공 사례가 저장되었습니다.');
   setSaveStage('');
   // A subsequent list refresh failure must not turn a successful save into a failure.
   try{
    const {data,error}=await client.from('case_posts').select('*').order('created_at',{ascending:false});
    if(!error)setItems((data||[]) as CasePost[]);
    else setMessage('저장되었습니다. 목록 갱신이 지연되므로 새로고침하여 확인해 주세요.');
   }catch{setMessage('저장되었습니다. 목록 갱신이 지연되므로 새로고침하여 확인해 주세요.')}
  }catch(error){
   const friendly=errorText(error,stage);
   setMessage(friendly);setLastError(stage);
  }finally{setSaving(false);setSaveStage('')}
 }
 async function remove(id:string){if(!client||!confirm('이 시공 사례와 해당 원본 사진을 삭제하시겠습니까?'))return;try{const result=await deleteCaseAndImages(client,id);setItems(items.filter(x=>x.id!==id));if(editing===id)reset();setMessage(result.warning||'시공 사례와 해당 원본 사진이 삭제되었습니다.')}catch(e){setMessage(e instanceof Error?e.message:'삭제에 실패했습니다.')}}
 if(!client)return <div className="wrap section"><h1>관리자 설정 필요</h1><p>Supabase 환경 변수를 연결한 뒤 사용할 수 있습니다.</p></div>;
 if(loading)return <div className="wrap section">로그인 확인 중...</div>;
 if(!user)return <div className="wrap section" style={{maxWidth:520}}><h1>시공 사례 관리자 로그인</h1><form onSubmit={login} style={{display:'grid',gap:12}}><label>이메일<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%',padding:12}}/></label><label>비밀번호<input required type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:'100%',padding:12}}/></label><button className="btn-primary">로그인</button></form><p role="status">{message}</p></div>;
 return <div className="wrap section" style={{maxWidth:900}}><h1>시공 사례 관리</h1><p><a href='/cases/'>← 시공 사례 페이지로 돌아가기</a>　|　<a href='/admin/analytics/'>📊 방문자 분석</a> <a href="/admin/search-rank/">검색 노출 확인</a></p><button onClick={()=>client.auth.signOut()}>로그아웃</button><p>대표 사진 1장과 상세 설명, 추가 사진 여러 장을 등록하세요.</p><form onSubmit={save} style={{display:'grid',gap:14,margin:'24px 0',padding:24,border:'1px solid #ddd',borderRadius:12}}><h2>{editing?'시공 사례 수정':'새 시공 사례 등록'}</h2><label>제목<input required value={title} onChange={e=>setTitle(e.target.value)} style={{display:'block',width:'100%',padding:12}}/></label><fieldset style={{border:'1px solid #ddd',borderRadius:10,padding:14}}><legend style={{fontWeight:700}}>시공 지역 (복수 선택 가능)</legend><p style={{fontSize:13,margin:'4px 0 12px',color:'#666'}}>해당하는 지역을 모두 선택하세요. 최소 1개 이상 선택해야 합니다.</p><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(105px,1fr))',gap:10}}>{[...serviceRegions,...region.split(',').map(v=>v.trim()).filter(v=>v&&!serviceRegions.includes(v))].map(v=><label key={v} style={{display:'flex',alignItems:'center',gap:7,cursor:'pointer',padding:'8px 5px'}}><input type="checkbox" checked={region.split(',').map(x=>x.trim()).includes(v)} onChange={e=>setRegion(current=>{const selected=current.split(',').map(x=>x.trim()).filter(Boolean);return (e.target.checked?[...selected,v]:selected.filter(x=>x!==v)).join(', ')})}/><span>{v}</span></label>)}</div><p style={{fontSize:13,marginTop:12}}>선택 지역: <strong>{region||'없음'}</strong></p></fieldset><label>간단한 설명<textarea required value={description} onChange={e=>setDescription(e.target.value)} rows={4} style={{display:'block',width:'100%',padding:12}}/></label><div><label><strong>상세 시공 설명 (선택)</strong></label><CaseRichEditor key={editorKey} value={details} onChange={setDetails}/></div><div><label htmlFor="cover-photo"><strong>대표 사진 (필수)</strong></label><p style={{fontSize:13}}>시공 사례 목록과 상세 페이지의 첫 사진입니다. 수정할 때 새 파일을 선택하지 않으면 기존 사진을 유지합니다.</p><CasePhotoDropzone id="cover-photo" resetKey={coverInputKey} onFiles={files=>setCover(files[0])}/>{cover&&<div style={{display:'flex',gap:12,alignItems:'center'}}><strong>{cover.name}</strong><button type="button" onClick={()=>{setCover(null);setCoverInputKey(k=>k+1)}}>선택 취소</button></div>}{editing&&!cover&&items.find(x=>x.id===editing)?.after_url&&<img src={items.find(x=>x.id===editing)!.after_url!} alt="현재 대표 사진" style={{width:140,height:100,objectFit:'cover',borderRadius:8}}/>}</div><div><label htmlFor='gallery-photos'>상세 설명 사진 (여러 장 선택 가능)</label><CasePhotoDropzone id="gallery-photos" multiple resetKey={galleryKey} onFiles={files=>setGallery(prev=>[...prev,...files.map(file=>({file,name:file.name}))])}/><p style={{fontSize:13}}>사진을 여러 장 추가하고 위로/아래로 순서를 조정할 수 있습니다.</p>{gallery.map((photo,i)=><div key={(photo.url||photo.name)+'-'+i} style={{display:'flex',alignItems:'center',gap:8,padding:8,borderBottom:'1px solid #eee'}}>{photo.url&&<img src={photo.url} alt={'추가 사진 '+(i+1)} style={{width:70,height:55,objectFit:'cover'}}/>}<span style={{flex:1,overflowWrap:'anywhere'}}>{i+1}. {photo.name}</span><button type='button' disabled={i===0} onClick={()=>setGallery(prev=>{const next=[...prev];[next[i-1],next[i]]=[next[i],next[i-1]];return next})}>↑</button><button type='button' disabled={i===gallery.length-1} onClick={()=>setGallery(prev=>{const next=[...prev];[next[i],next[i+1]]=[next[i+1],next[i]];return next})}>↓</button><button type='button' onClick={()=>setGallery(prev=>prev.filter((_,index)=>index!==i))}>삭제</button></div>)}</div><button className="btn-primary" disabled={saving}>{saving?(saveStage||'저장 중...'):'저장하기'}</button>{editing&&<button type="button" onClick={reset}>수정 취소</button>}</form><p role="status" style={{color:lastError?"#b42318":"#146b46",whiteSpace:"pre-wrap"}}>{message}</p>{lastError&&<p style={{fontSize:13}}>저장에 실패한 단계: {lastError}. 동일한 오류가 계속되면 이 메시지를 알려주세요.</p>}<h2>등록한 사례</h2>{readError&&<p role='alert' style={{color:'#b42318'}}>{readError}</p>}{!readError&&items.length===0&&<p>조회 결과 0건입니다. Supabase 프로젝트 연결 및 공개 조회 정책을 확인해야 합니다.</p>}{items.map(item=><div key={item.id} style={{padding:16,borderBottom:'1px solid #ddd'}}><strong>{item.title}</strong> · {item.region}<div style={{display:'flex',gap:8,marginTop:8}}>{item.after_url&&<img src={item.after_url} alt='대표 사진' style={{width:120,height:90,objectFit:'cover'}}/>}</div><div style={{display:'flex',gap:12,marginTop:8}}><button onClick={()=>{setEditing(item.id);setTitle(item.title);setRegion(item.region);setDescription(item.description);setDetails(item.details||'');setEditorKey(k=>k+1);setGallery((item.gallery||[]).map(url=>({url,name:'등록된 사진'})));setGalleryKey(k=>k+1);setCover(null);setCoverInputKey(k=>k+1);window.scrollTo({top:0,behavior:'smooth'})}}>수정</button><button onClick={()=>remove(item.id)}>삭제</button></div></div>)}{user.email==='ssg-sink@naver.com'&&<OrphanImageCleanup client={client} userId={user.id}/>}</div>;
}
