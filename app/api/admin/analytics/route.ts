import {NextRequest,NextResponse} from 'next/server';
import {createClient} from '@supabase/supabase-js';
import {createSign} from 'node:crypto';
export const runtime='nodejs';
export const dynamic='force-dynamic';
const encode=(v:object)=>Buffer.from(JSON.stringify(v)).toString('base64url');
async function accessToken(email:string,key:string){
 const now=Math.floor(Date.now()/1000);
 const assertion=encode({alg:'RS256',typ:'JWT'})+'.'+encode({iss:email,scope:'https://www.googleapis.com/auth/analytics.readonly',aud:'https://oauth2.googleapis.com/token',iat:now,exp:now+3600});
 const signer=createSign('RSA-SHA256');signer.update(assertion);signer.end();
 const jwt=assertion+'.'+signer.sign(key.replace(/\\n/g,'\n'),'base64url');
 const response=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion:jwt}),cache:'no-store'});
 if(!response.ok)throw Error('Google 인증에 실패했습니다. 서비스 계정 키를 확인하세요.');
 const json=await response.json() as {access_token:string};
 return json.access_token;
}
type GAResponse={rows?:{dimensionValues?:{value:string}[];metricValues?:{value:string}[]}[];totals?:{metricValues?:{value:string}[]}[];error?:{message?:string}};
export async function GET(request:NextRequest){
 const auth=request.headers.get('authorization')||'';
 if(!auth.startsWith('Bearer '))return NextResponse.json({error:'로그인이 필요합니다.'},{status:401});
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL,anon=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 if(!url||!anon)return NextResponse.json({error:'Supabase 설정이 없습니다.'},{status:503});
 const supabase=createClient(url,anon,{auth:{persistSession:false,autoRefreshToken:false}});
 const {data:{user},error}=await supabase.auth.getUser(auth.slice(7));
 if(error||!user)return NextResponse.json({error:'로그인이 필요합니다.'},{status:401});
 const adminEmails=(process.env.ADMIN_EMAILS||'').split(',').map(s=>s.trim().toLowerCase()).filter(Boolean);
 if(adminEmails.length&&(!user.email||!adminEmails.includes(user.email.toLowerCase())))return NextResponse.json({error:'관리자 권한이 없습니다.'},{status:403});
 const property=process.env.GA4_PROPERTY_ID,email=process.env.GA4_CLIENT_EMAIL,key=process.env.GA4_PRIVATE_KEY;
 if(!property||!email||!key)return NextResponse.json({configured:false,error:'GA4 연결 설정이 필요합니다. Vercel 환경 변수 GA4_PROPERTY_ID, GA4_CLIENT_EMAIL, GA4_PRIVATE_KEY를 등록하세요.'});
 try{
  const token=await accessToken(email,key);
  const endpoint='https://analyticsdata.googleapis.com/v1beta/properties/'+encodeURIComponent(property)+':runReport';
  async function report(body:object):Promise<GAResponse>{
   const response=await fetch(endpoint,{method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify(body),cache:'no-store'});
   const result=await response.json() as GAResponse;
   if(!response.ok)throw Error(result.error?.message||'GA4 데이터 조회 실패');
   return result;
  }
  const [summary,channels,pages,trend]=await Promise.all([
   report({dateRanges:[{startDate:'today',endDate:'today'},{startDate:'yesterday',endDate:'yesterday'},{startDate:'7daysAgo',endDate:'today'},{startDate:'30daysAgo',endDate:'today'}],metrics:[{name:'totalUsers'},{name:'sessions'}],keepEmptyRows:true}),
   report({dateRanges:[{startDate:'30daysAgo',endDate:'today'}],dimensions:[{name:'sessionDefaultChannelGroup'},{name:'sessionSource'}],metrics:[{name:'sessions'}],limit:30,orderBys:[{metric:{metricName:'sessions'},desc:true}]}),
   report({dateRanges:[{startDate:'30daysAgo',endDate:'today'}],dimensions:[{name:'pagePath'}],metrics:[{name:'screenPageViews'}],limit:10,orderBys:[{metric:{metricName:'screenPageViews'},desc:true}]}),
   report({dateRanges:[{startDate:'13daysAgo',endDate:'today'}],dimensions:[{name:'date'}],metrics:[{name:'totalUsers'}],orderBys:[{dimension:{dimensionName:'date'}}]})
  ]);
  return NextResponse.json({configured:true,summary:summary.rows||[],channels:channels.rows||[],pages:pages.rows||[],trend:trend.rows||[]},{headers:{'Cache-Control':'private, no-store'}});
 }catch(e){return NextResponse.json({configured:true,error:e instanceof Error?e.message:'통계 조회에 실패했습니다.'},{status:502})}
}
