import { createClient } from '@supabase/supabase-js';
export type CasePost={id:string;slug:string;title:string;description:string;region:string;before_url:string|null;after_url:string|null;created_at:string};
export function supabaseClient(){
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL, key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 if(!url||!key)return null;
 return createClient(url,key);
}
export async function getManualCases():Promise<CasePost[]>{
 const client=supabaseClient();if(!client)return [];
 const {data,error}=await client.from('case_posts').select('id,slug,title,description,region,before_url,after_url,created_at').order('created_at',{ascending:false}).limit(100);
 return error?[]:(data||[]) as CasePost[];
}
