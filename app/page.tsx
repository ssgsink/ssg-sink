import {getManualCases} from '@/lib/supabase';
import type {Metadata} from 'next';
export const metadata:Metadata={alternates:{canonical:'/'}};
export const revalidate=60;
const areas = [
  ['부산', 'busan'],
  ['양산', 'yangsan'],
  ['김해', 'gimhae'],
  ['창원', 'changwon'],
  ['마산', 'masan'],
  ['진해', 'jinhae'],
  ['진주', 'jinju'],
  ['사천', 'sacheon'],
  ['밀양', 'miryang'],
  ['거제', 'geoje'],
  ['통영', 'tongyeong'],
  ['고성', 'goseong'],
  ['함안', 'haman'],
  ['기타 지역', 'gyeongnam'],
];

const smsHref = 'sms:01055043858?body=' + encodeURIComponent('[싱크볼 교체 상담]\n*싱크볼 전체 사진과 하부장 내부 사진과 아래 정보를 보내주시면 감사하겠습니다.\n\n거주 지역(시 · 동):\n싱크볼 가로 · 세로 크기(mm):\n상담 내용:');

export default async function Home() {
  const cases = (await getManualCases()).filter(item=>Boolean(item.after_url)).slice(0,4);
  return (
    <>
      <section className="premium-hero home-blue-hero">
        <div className="wrap premium-hero-inner">
          <div className="premium-hero-copy">
            <div className="premium-kicker">SINK BOWL SPECIALIST</div>
            <h1>
              주방의 품격을 바꾸는
              <br />
              <span>싱크볼 교체</span>
            </h1>
            <p>
              매일 사용하는 싱크볼,
              <br />
              완성도 높은 시공으로 주방의 분위기를 새롭게 바꿔드립니다.
            </p>
            <div className="premium-actions premium-actions-three">
              <a href="tel:01055043858" className="gold-button home-blue-button">☎ 전화 상담</a>
              <a href={smsHref} className="outline-button">✉ 문자 상담</a>
              <a href="/cases/" className="outline-button">▣ 시공 사례</a>
            </div>
          </div>
          <div className="premium-hero-visual">
            <div className="hero-visual-label">
              <span>SHINSEGAE SINK</span>
              <strong>DETAIL MAKES THE DIFFERENCE</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="premium-intro premium-intro-refined home-tone-ivory home-blue-intro" >
        <div className="wrap">
          <div className="premium-intro-story">
            <div className="premium-intro-story-copy">
              <div className="premium-eyebrow">WHY SHINSEGAE SINK</div>
              <h2>싱크볼 하나로<br/>새로워지는 주방</h2>
              <p>오래된 싱크볼을 교체하고 주방의 분위기를 새롭게 바꿔보세요.<br/>상담부터 시공, 마무리까지 신세계싱크가 꼼꼼하게 함께합니다.</p>
            </div>
            <div className="premium-intro-story-photo" role="img" aria-label="실제 주방의 싱크볼 사진">
              <span>SMALL CHANGE, BETTER KITCHEN</span>
            </div>
          </div>
          <div className="premium-values">
            <div>
              <span>01</span>
              <strong>전문 시공</strong>
              <p>싱크볼 교체에 집중한 전문 작업</p>
            </div>
            <div>
              <span>02</span>
              <strong>꼼꼼한 마감</strong>
              <p>설치부터 마무리까지 세심하게</p>
            </div>
            <div>
              <span>03</span>
              <strong>부산·경남 출장</strong>
              <p>지역에 맞춰 편리하게 상담</p>
            </div>
          </div>
        </div>
      </section>

      <section className="premium-process home-tone-gray home-blue-process" >
        <div className="wrap">
          <div className="premium-section-heading">
            <div className="premium-eyebrow">OUR PROCESS</div>
            <h2>상담부터 시공까지 꼼꼼하게</h2>
          </div>
          <div className="premium-steps">
            <div><span>01</span><strong>상담 문의</strong><p>지역과 교체 희망 사항 확인</p></div>
            <div><span>02</span><strong>사진 확인</strong><p>싱크볼과 하부장 상태 확인</p></div>
            <div><span>03</span><strong>제품 및 일정 안내</strong><p>시공 가능 여부와 비용 안내</p></div>
            <div><span>04</span><strong>교체 시공</strong><p>설치와 마무리 상태 점검</p></div>
          </div>
        </div>
      </section>

      <section className="premium-cases home-tone-ivory home-case-light home-blue-cases" >
        <div className="wrap premium-case-inner">
          <div>
            <div className="premium-eyebrow">INSTALLATION STORIES</div>
            <h2>실제 시공 사례로 확인하세요</h2>
            <p>
              부산과 경남 곳곳에서 진행한
              다양한 싱크볼 교체 사례를 확인하실 수 있습니다.
            </p>
            {cases.length===0&&<p className="home-case-empty">등록된 교체 후 사진을 준비 중입니다.</p>}
          </div>
          <div className="home-case-gallery">{cases.map(item=><a className="home-case-card" href={`/cases/${item.slug}/`} key={item.id}><img src={item.after_url!} alt={`${item.title} 교체 후 사진`} loading="lazy"/><div className="home-case-card-info"><strong>{item.title}</strong><span>{item.region}</span></div></a>)}</div>
          <div className="home-case-more"><a href="/cases/" className="dark-button">더 많은 시공 사례 보기</a></div>
        </div>
      </section>

      <section className="premium-areas premium-areas-refined home-tone-gray home-blue-areas" style={{backgroundColor:"#eae8e1"}}>
        <div className="wrap">
          <div className="premium-section-heading">
            <div className="premium-eyebrow">SERVICE AREA</div>
            <h2>부산·경남 싱크볼 교체 상담 지역</h2>
            <p>아래 지역 버튼을 누르면 상담 안내 페이지로 이동합니다.</p>
          </div>

          <div className="premium-area-links premium-area-compact premium-area-city-links">
            {areas.map(([name, slug]) => (
              <a key={slug} href={`/contact/?region=${encodeURIComponent(name)}`}>{name}</a>
            ))}
          </div>
        </div>
      </section>

      <section className="premium-contact premium-contact-refined home-blue-contact">
        <div className="wrap home-contact-row">
          <div className="home-contact-copy">
            <div className="premium-eyebrow">CONTACT US</div>
            <h2>지금, 편하게 상담하세요!</h2>
            <p>싱크볼 사진과 지역을 알려주시면 상담에 도움이 됩니다.</p>
          </div>
          <div className="premium-actions premium-contact-buttons home-contact-actions"><a href="tel:01055043858" className="gold-button">☎ 전화 상담하기</a><a href={smsHref} className="outline-button home-sms-button">✉ 문자 상담하기</a></div>
          
        </div>
      </section>
    </>
  );
}
// Deployment quota reset test — 2026-11-02 (no UI changes)
