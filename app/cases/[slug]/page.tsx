import {getManualCases} from '@/lib/supabase';import {sanitizeCaseDetails,caseMetaDescription} from '@/lib/case-rich-text';import {notFound} from 'next/navigation';import type {Metadata} from 'next';export const revalidate=3600;type Props={params:Promise<{slug:string}>};export async function generateMetadata({params}:Props):Promise<Metadata>{const {slug}=await params;const item=(await getManualCases()).find(x=>x.slug===slug);return item?{title:item.title,description:caseMetaDescription(item.description,item.details),alternates:{canonical:'/cases/'+slug+'/'}}:{title:'시공 사례를 찾을 수 없습니다',robots:{index:false}}}export default async function CaseDetail({params}:Props){
 const {slug}=await params;
 const item=(await getManualCases()).find(x=>x.slug===slug);
 if(!item)notFound();
 return <article>
 <header className="site-detail-top"><div className="wrap site-case-content"><nav className="site-crumb"><a href="/">홈</a><span>›</span><a href="/cases/">시공 사례</a><span>›</span><span>상세 보기</span></nav><span className="site-kicker">REAL INSTALLATION</span><h1>{item.title}</h1><p>{item.region}</p></div></header>
 <div className="site-section"><div className="wrap site-case-content">
 {item.after_url&&<figure className="case-detail-cover"><img src={item.after_url} alt={item.title+' 대표 시공 사진'}/><figcaption>대표 시공 사진</figcaption></figure>}
 <p className="site-detail-copy" style={{marginTop:30}}>{item.description}</p>
 {item.details&&<section style={{marginTop:35}}><div className="site-heading"><span className="site-kicker">INSTALLATION DETAILS</span><h2>시공 과정과 상세 설명</h2></div><div className="site-detail-copy case-rich-output" dangerouslySetInnerHTML={{__html:sanitizeCaseDetails(item.details)}}/></section>}
 {(item.gallery||[]).length>0&&<section style={{marginTop:35}}><div className="site-heading"><h2>상세 시공 사진</h2></div><div className="site-gallery">{(item.gallery||[]).map((url,i)=><figure key={url+i}><img src={url} alt={item.region+' '+item.title+' 시공 사진 '+(i+1)} loading="lazy"/><figcaption>시공 사진 {i+1}</figcaption></figure>)}</div></section>}
 <div style={{marginTop:35}}><a className="site-action secondary" href="/cases/">← 시공 사례 목록으로</a></div>
 </div></div>
 <section className="site-callout"><div className="wrap site-callout-inner"><div><span className="site-kicker">CONTACT US</span><h2>우리 집 싱크볼도 교체할 수 있을까요?</h2><p>전화 또는 문자로 사진을 보내 상담해 주세요.</p></div><div className="site-actions"><a className="site-action phone" href="tel:01055043858">☎ 전화 상담</a><a className="site-action sms" href="/contact/#sms-consult">✉ 문자 상담 안내</a></div></div></section>
 </article>;
}