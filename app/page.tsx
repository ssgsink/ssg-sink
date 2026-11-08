import CaseRegionLinks from '@/components/CaseRegionLinks';
import {smsHref} from '@/lib/contact';
import {getManualCases} from '@/lib/supabase';
import type {Metadata} from 'next';
export const metadata:Metadata={
 title:'신세계싱크 | 부산·경남 싱크볼 교체 전문',
 description:'신세계싱크 | 부산·경남 전 지역 싱크볼 교체 전문 업체. 사각 싱크볼, 언더 싱크볼, 씽크볼·개수대 교체 및 설치 상담.',
 alternates:{canonical:'/'},
 openGraph:{type:'website',locale:'ko_KR',siteName:'신세계싱크',title:'신세계싱크 | 부산·경남 싱크볼 교체 전문',description:'부산·경남 전 지역 싱크볼 교체 전문 신세계싱크. 대표가 직접 상담부터 시공까지 진행합니다.',url:'/',images:[{url:'/og-image.png',width:1200,height:630,alt:'신세계싱크 싱크볼 교체 전문'}]},
 twitter:{card:'summary_large_image',images:['/og-image.png']}
};
export const revalidate=60;
const areas=[['부산','busan'],['창원','changwon'],['마산','masan'],['진해','jinhae'],['김해','gimhae'],['양산','yangsan'],['진주','jinju'],['사천','sacheon'],['거제','geoje'],['통영','tongyeong'],['고성','goseong'],['창녕','changnyeong'],['함안','haman'],['밀양','miryang'],['기타 지역','gyeongnam']];
export default async function Home(){
 const cases=(await getManualCases()).filter(item=>Boolean(item.after_url)).slice(0,3);
 const siteUrl=(process.env.NEXT_PUBLIC_SITE_URL||'https://ssg-sink.vercel.app').replace(/\/$/,'');
 const website={'@context':'https://schema.org','@type':'WebSite',name:'신세계싱크',alternateName:['신세계싱크 싱크볼 교체','SHINSEGAE SINK'],url:siteUrl+'/'};
 return <main className="ref-home"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(website).replace(/</g,'\\u003c')}}/>
  <section className="ref-hero"><div className="ref-hero-shade"><div className="wrap ref-hero-content">
   <span className="ref-eyebrow">SHINSEGAE SINK</span>
   <h1>싱크볼 교체 전문<br/><em>신세계싱크</em></h1>
   <p className="ref-hero-description">부산·경남 전 지역<br/>대표가 직접 상담부터 시공까지 합니다.</p>
   <div className="ref-hero-actions"><a href="tel:01055043858" className="ref-hero-phone">☎ 전화 상담</a><a href={smsHref} className="ref-hero-sms">✉ 문자 상담</a><a href="/cases/" className="ref-hero-cases">▣ 시공 사례</a></div>
  </div></div></section>
  <section className="ref-benefits"><div className="wrap"><h2>“싱크볼 하나로 <em>새로워지는 주방</em>”</h2><p>낡고 불편한 싱크볼, 이제 새롭게 교체하고 더 깨끗하고 편리한 주방을 만나보세요.</p><div className="ref-benefit-grid">
   <div><span>✧</span><strong>깔끔한 주방</strong></div><div><span>♢</span><strong>위생적인 관리</strong></div><div><span>◇</span><strong>세련된 인테리어</strong></div><div><span>⬡</span><strong>편리한 사용</strong></div>
  </div></div></section>
  <section className="ref-process"><div className="wrap"><h2>상담부터 시공까지 <em>꼼꼼하게</em></h2><p>처음 상담부터 시공 후 마무리까지, 대표가 직접 확인하며 책임감 있게 진행합니다.</p><div className="ref-process-grid">
   <article><span>▤</span><strong>상담 및 문의</strong><p>싱크볼 상태 확인 및<br/>교체 상담</p></article>
   <article><span>▱</span><strong>현장 확인</strong><p>실측 및 최적의<br/>제품 제안</p></article>
   <article><span>⚒</span><strong>교체 시공</strong><p>대표 직접 시공으로<br/>꼼꼼하고 안전하게</p></article>
   <article><span>✓</span><strong>시공 완료</strong><p>마무리 점검 및<br/>사용 안내</p></article>
  </div></div></section>
  <section className="ref-cases"><div className="wrap"><h2>실제 <em>시공 사례</em></h2><p>부산·경남 곳곳에서 진행한 신세계싱크의 실제 시공 사례를 확인해 보세요.</p><div className="ref-case-grid">
   {cases.map(item=><div className="ref-case" key={item.id}><a href={`/cases/${item.slug}/`} className="ref-case-photo-link" aria-label={item.title+" 시공 사례 보기"}><img src={item.after_url!} alt={item.title} loading="lazy"/></a><CaseRegionLinks region={item.region} overlay/></div>)}
   {Array.from({length:Math.max(0,3-cases.length)},(_,i)=><a href="/cases/" className="ref-case ref-case-placeholder" key={`placeholder-${i}`}><div className="ref-case-placeholder-photo"/><span>시공 사례</span></a>)}
   <a className="ref-case-all" href="/cases/"><span>⌂</span><strong>더 많은<br/>시공사례 보기 ›</strong></a>
  </div><a href="/cases/" className="ref-more-button">더 많은 시공사례 보기 ❯</a></div></section>
  <section className="ref-areas"><div className="wrap ref-areas-grid"><div className="ref-areas-copy"><h2>부산·경남 <em>전지역 시공 가능</em></h2><p>부산을 비롯한 경남 전지역에서 싱크볼 교체 시공이 가능합니다.</p><small>☞ 지역 버튼을 클릭하시면 해당 지역 안내 페이지로 이동합니다.</small></div><div className="ref-region-buttons">{areas.map(([name,slug])=><a key={slug} href={`/areas/${slug}/`}><span aria-hidden="true">●</span>{name}</a>)}</div></div></section>
  <section className="ref-contact"><div className="wrap ref-contact-grid"><div className="ref-contact-title"><span>☎</span><div><h2>지금, 편하게 상담하세요!</h2><p>싱크볼 교체 상담부터 견적, 시공 일정까지 친절하게 안내해 드립니다.</p></div></div><div className="ref-contact-actions"><a className="ref-call" href="tel:01055043858">☎ &nbsp; 전화 상담하기 ❯</a><a className="ref-sms" href={smsHref}>● &nbsp; 문자 상담하기 ❯</a></div></div></section>
 </main>;
}
