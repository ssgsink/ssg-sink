import type {SupabaseClient} from '@supabase/supabase-js';
import type {CasePost} from './supabase';

const BUCKET='case-images';

// Only remove files in this project's own bucket. External URLs and legacy images are untouched.
function storagePath(url:string,projectUrl:string):string|null{
 try{
  const actual=new URL(url),project=new URL(projectUrl);
  if(actual.origin!==project.origin)return null;
  const prefix='/storage/v1/object/public/'+BUCKET+'/';
  if(!actual.pathname.startsWith(prefix))return null;
  const path=decodeURIComponent(actual.pathname.slice(prefix.length));
  if(!path||path.includes('..')||path.startsWith('/'))return null;
  return path;
 }catch{return null}
}
export async function deleteCaseAndImages(client:SupabaseClient,id:string):Promise<{warning?:string}>{
 const {data,error}=await client.from('case_posts').delete().eq('id',id)
  .select('id,before_url,after_url,gallery').single();
 if(error)throw error;
 const record=data as Pick<CasePost,'id'|'before_url'|'after_url'|'gallery'>;
 const projectUrl=process.env.NEXT_PUBLIC_SUPABASE_URL||'';
 const urls=[record.before_url,record.after_url,...(record.gallery||[])].filter((x):x is string=>typeof x==='string');
 const paths=[...new Set(urls.map(url=>storagePath(url,projectUrl)).filter((x):x is string=>Boolean(x)))];
 if(!paths.length)return {};
 // Prevent removing a file that another case still references.
 const {data:otherCases,error:lookupError}=await client.from('case_posts')
  .select('before_url,after_url,gallery');
 if(lookupError)return {warning:'게시글은 삭제했지만 사진 공유 여부를 확인하지 못해 원본 사진은 남겨 두었습니다.'};
 const referenced=new Set<string>();
 for(const other of otherCases||[]){
  for(const url of [other.before_url,other.after_url,...(other.gallery||[])]){
   if(typeof url==='string'){const path=storagePath(url,projectUrl);if(path)referenced.add(path)}
  }
 }
 const unused=paths.filter(path=>!referenced.has(path));
 if(!unused.length)return {};
 const {error:storageError}=await client.storage.from(BUCKET).remove(unused);
 if(storageError)return {warning:'게시글은 삭제됐지만 일부 원본 사진 삭제에 실패했습니다: '+storageError.message};
 return {};
}
