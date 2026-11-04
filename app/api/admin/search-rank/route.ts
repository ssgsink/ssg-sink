import {NextRequest,NextResponse} from 'next/server';
import {createClient} from '@supabase/supabase-js';
export const dynamic='force-dynamic';
export async function GET(request:NextRequest){
 const token=request.headers.get('authorization')?.replace(/^Bearer /,'');
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 if(!token)return NextResponse.json({error:'로그인이 필요합니다.'},{status:401});
 if(!url||!key)return NextResponse.json({error:'인증 설정 필요'},{status:503});
 const client=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
 const {data:{user},error}=await client.auth.getUser(token);
 if(error||!user)return NextResponse.json({error:'로그인이 필요합니다.'},{status:401});
 const admins=(process.env.ADMIN_EMAILS||'ssg-sink@naver.com').split(',').map(s=>s.trim().toLowerCase()).filter(Boolean);
 if(!user.email||!admins.includes(user.email.toLowerCase()))return NextResponse.json({error:'관리자 권한이 필요합니다.'},{status:403});
 return NextResponse.json({ok:true},{headers:{'Cache-Control':'private, no-store'}});
}
