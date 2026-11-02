import type {Metadata} from 'next';
export const metadata:Metadata={title:'싱크볼 교체 상담 문의 | 신세계싱크',description:'부산·경남 싱크볼 교체 상담. 전화 또는 문자로 싱크볼 사진과 크기, 지역을 알려주시면 상담해 드립니다.',alternates:{canonical:'/contact/'}};
const smsHref='sms:01055043858?body='+encodeURIComponent('[싱크볼 교체 상담]\n시공 지역(시·구·동):\n타공 사이즈 가로×세로(mm):\n주소(아파트명·동·호수):\n연락처:\n상담 내용:\n\n싱크볼 전체, 가로·세로 측정, 하부장 내부 사진을 첨부해 주세요.');
const benefits=[['☎','빠른 상담 응대'],['▣','시공 일정 조율'],['⚒','맞춤 시공 상담'],['♢','대표가 직접 시공']];
export default function Contact(){return <main className="contact-ref">
 <section className="contact-ref-hero"><div className="contact-ref-hero-shade"><div className="wrap contact-ref-hero-inner"><span>CONTACT</span><h1>상담 <em>문의</em></h1><p>싱크볼 교체, 제품 상담, 시공 일정 등<br/>궁금한 점이 있으시면<br/>언제든지 편하게 문의해 주세요.</p></div></div></section>
 <section className="contact-ref-benefits"><div className="wrap">{benefits.map(([symbol,title])=><div key={title}><span>{symbol}</span><strong>{title}</strong></div>)}</div></section>
 <section className="contact-ref-main"><div className="wrap">
  <div className="contact-ref-panel"><div className="contact-ref-panel-heading"><h2><span aria-hidden="true">☏</span> 편하게 <em>상담하세요!</em></h2><p>지금 바로 전화나 문자로 문의주시면<br/>친절하고 정확하게 안내해 드립니다.</p></div><div className="contact-ref-cta-grid"><div><a className="contact-ref-phone" href="tel:01055043858">☎ &nbsp; 전화 상담하기 ›</a><p>지금 바로 통화로 상담이 가능합니다.</p></div><div><a className="contact-ref-sms" href={smsHref}>✉ &nbsp; 문자 상담하기 ›</a><p>사진과 함께 보내주시면<br/>더 정확한 상담이 가능합니다.</p></div></div></div>
  <section className="contact-ref-guide" id="sms-consult"><div className="contact-ref-guide-heading"><span aria-hidden="true">▣</span><div><h2>문자 상담 시 <em>이렇게 보내주세요!</em></h2><p>아래와 같이 사진과 정보를 함께 보내주시면 보다 정확하고 빠르게 상담해 드립니다.</p></div></div>
  <div className="contact-ref-guide-grid">
   <article className="contact-ref-guide-card"><div className="contact-ref-guide-image"><img src="/images/sms-sink-overview.webp" alt="고객이 보내주실 싱크볼 전체 사진 예시" loading="lazy"/></div><div className="contact-ref-guide-caption"><span>1</span><div><h3>싱크볼 전체 사진</h3><p>주방에서 전체 모습이 보이게</p></div></div></article>
   <article className="contact-ref-guide-card"><div className="contact-ref-guide-image"><img src="/images/sms-sink-measure.webp" alt="싱크대 상판 타공부의 가로·세로 길이를 측정하는 예시 사진" loading="lazy"/></div><div className="contact-ref-guide-caption"><span>2</span><div><h3>싱크볼 가로·세로 길이</h3><p><mark>상판 타공부 끝에서 끝까지 측정</mark><br/>예: 가로 850mm, 세로 520mm</p></div></div></article>
   <article className="contact-ref-guide-card"><div className="contact-ref-guide-image"><img src="/images/sms-under-cabinet.webp" alt="좌우 양쪽 경첩과 배수관이 보이도록 촬영한 하부장 내부 예시 사진" loading="lazy"/></div><div className="contact-ref-guide-caption"><span>3</span><div><h3>하부장 내부 사진</h3><p><mark>양쪽 경첩이 모두 보이도록</mark><br/>넓게 촬영해 주세요.</p></div></div></article>
   <article className="contact-ref-guide-card contact-ref-guide-info"><div className="contact-ref-guide-info-title"><span>4</span><div><h3>기타 정보</h3><p>아래 내용도 함께 알려주시면<br/>더 정확한 상담이 가능합니다.</p></div></div><ul><li><strong>주소</strong><small>시·구·동까지</small></li><li><strong>연락처</strong><small>전화번호</small></li><li><strong>원하시는 제품</strong><small>사각 싱크볼, 언더 싱크볼 등</small></li><li><strong>특이사항</strong><small>누수, 악취, 배수구 교체 등</small></li></ul></article>
  </div></section>
 </div></section>

 </main>}