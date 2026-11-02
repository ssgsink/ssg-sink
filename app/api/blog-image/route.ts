import {NextRequest,NextResponse} from 'next/server';
export const runtime='nodejs';
export async function GET(request:NextRequest){
 const src=request.nextUrl.searchParams.get('url');
 if(!src)return new NextResponse('Missing image',{status:400});
 let url:URL;
 try{url=new URL(src)}catch{return new NextResponse('Invalid URL',{status:400})}
 if(url.protocol!=='https:'||!/(^|\.)(pstatic\.net|naver\.com|naver\.net)$/.test(url.hostname))return new NextResponse('Image host not allowed',{status:400});
 try{
  const response=await fetch(url.toString(),{headers:{'User-Agent':'Mozilla/5.0','Referer':'https://blog.naver.com/'},next:{revalidate:86400},signal:AbortSignal.timeout(7000),redirect:'error'});
  if(!response.ok)return new NextResponse('Image unavailable',{status:404});
  const type=response.headers.get('content-type')||'';
  if(!type.startsWith('image/'))return new NextResponse('Not an image',{status:415});
  const size=Number(response.headers.get('content-length')||0);
  if(size>8*1024*1024)return new NextResponse('Image too large',{status:413});
  const bytes=await response.arrayBuffer();
  if(bytes.byteLength>8*1024*1024)return new NextResponse('Image too large',{status:413});
  return new NextResponse(bytes,{headers:{'Content-Type':type,'Cache-Control':'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400','X-Content-Type-Options':'nosniff'}});
 }catch{return new NextResponse('Image unavailable',{status:502})}
}
