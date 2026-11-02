export type BlogPost={id:string;title:string;link:string;description:string;image:string|null};
function decode(text:string){return text.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&#x([0-9a-f]+);/gi,(_,hex)=>String.fromCodePoint(parseInt(hex,16))).replace(/&#(\d+);/g,(_,num)=>String.fromCodePoint(Number(num)))}
function read(item:string,tag:string){const m=item.match(new RegExp('<'+tag+'(?:\\s[^>]*)?>([\\s\\S]*?)<\\/'+tag+'>','i'));return decode((m?.[1]||'').replace(/^<!\[CDATA\[|\]\]>$/g,'').trim())}
function validImage(src:string|null):string|null{if(!src)return null;try{const u=new URL(decode(src),'https://blog.naver.com');if(u.protocol!=='https:')return null;if(!/(^|\.)(pstatic\.net|naver\.com|naver\.net)$/.test(u.hostname))return null;return u.toString()}catch{return null}}
function imageFromMeta(html:string):string|null{
 const tags=html.match(/<meta\b[^>]*>/gi)||[];
 for(const tag of tags){if(!/(?:og:image|twitter:image)/i.test(tag))continue;const m=tag.match(/content\s*=\s*["']([^"']+)["']/i);const src=validImage(m?.[1]||null);if(src)return src}
 return null
}
async function representativeImage(link:string):Promise<string|null>{
 try{
  const parsed=new URL(link);
  if(parsed.hostname!=='blog.naver.com'&&parsed.hostname!=='m.blog.naver.com')return null;
  const match=parsed.pathname.match(/\/(\d+)(?:\/|$)/)||parsed.search.match(/logNo=(\d+)/);
  if(!match)return null;
  const url='https://m.blog.naver.com/ssg-sink/'+match[1];
  const res=await fetch(url,{headers:{'User-Agent':'Mozilla/5.0 (compatible; ShinsegaeSink/1.0)'},next:{revalidate:3600},signal:AbortSignal.timeout(4500)});
  if(!res.ok)return null;
  return imageFromMeta(await res.text());
 }catch{return null}
}
export async function getBlogPosts():Promise<BlogPost[]>{
 try{
  const res=await fetch('https://rss.blog.naver.com/ssg-sink.xml',{next:{revalidate:3600}});
  if(!res.ok)return [];
  const xml=await res.text();
  const posts=[...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].slice(0,24).map((match,index)=>{
   const item=match[1],raw=read(item,'description'),link=read(item,'link');
   const rssImage=validImage(raw.match(/<img[^>]*src=["']([^"']+)["']/i)?.[1]||null);
   const thumbnail=validImage(item.match(/<media:thumbnail[^>]*url=["']([^"']+)["']/i)?.[1]||null);
   return{id:'naver-'+index,title:read(item,'title'),link,description:raw.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').slice(0,150),image:thumbnail||rssImage}
  }).filter(p=>p.title&&/^https:\/\/(?:m\.)?blog\.naver\.com\//.test(p.link));
  // The Naver post's og:image is normally its configured representative thumbnail.
  // RSS description images are only a fallback and may not be the representative.
  const images=await Promise.all(posts.map(p=>representativeImage(p.link)));
  return posts.map((p,i)=>({...p,image:images[i]||p.image}));
 }catch{return []}
}
