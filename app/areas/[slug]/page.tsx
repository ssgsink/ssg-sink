import {getManualCases} from '@/lib/supabase';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

type AreaInfo = { name: string; fullName: string; focus: string; localNote: string };
const areas: Record<string, AreaInfo> = {
  busan: { name: '부산', fullName: '부산광역시', focus: '부산 싱크볼 교체 및 부산 사각싱크볼 교체', localNote: '부산 전 지역의 아파트와 주택을 방문해 싱크볼 교체 상담을 제공합니다.' },
  'busan-jung': { name: '부산 중구', fullName: '부산광역시 중구', focus: '부산 중구 싱크볼 교체', localNote: '중구 주택과 아파트의 싱크볼 교체를 상담합니다.' },
  'busan-seo': { name: '부산 서구', fullName: '부산광역시 서구', focus: '부산 서구 싱크볼 교체', localNote: '서구 지역의 싱크볼 교체와 사각싱크볼 시공을 상담합니다.' },
  'busan-dong': { name: '부산 동구', fullName: '부산광역시 동구', focus: '부산 동구 싱크볼 교체', localNote: '동구 지역의 주방 환경에 맞춰 싱크볼 교체를 안내합니다.' },
  'busan-yeongdo': { name: '부산 영도구', fullName: '부산광역시 영도구', focus: '부산 영도구 싱크볼 교체', localNote: '영도구 아파트와 주택의 싱크볼 교체를 상담합니다.' },
  'busan-busanjin': { name: '부산 부산진구', fullName: '부산광역시 부산진구', focus: '부산 부산진구 싱크볼 교체', localNote: '부산진구 지역의 사각싱크볼과 언더싱크볼 교체를 안내합니다.' },
  'busan-dongnae': { name: '부산 동래구', fullName: '부산광역시 동래구', focus: '부산 동래구 싱크볼 교체', localNote: '동래구 주방 환경에 맞는 싱크볼 교체를 상담합니다.' },
  'busan-nam': { name: '부산 남구', fullName: '부산광역시 남구', focus: '부산 남구 싱크볼 교체', localNote: '남구 아파트와 주택의 싱크볼 교체를 안내합니다.' },
  'busan-buk': { name: '부산 북구', fullName: '부산광역시 북구', focus: '부산 북구 싱크볼 교체', localNote: '북구 지역의 사각싱크볼 및 일반 싱크볼 교체를 상담합니다.' },
  'busan-haeundae': { name: '부산 해운대구', fullName: '부산광역시 해운대구', focus: '부산 해운대구 싱크볼 교체', localNote: '해운대구 아파트와 주택의 싱크볼 교체를 안내합니다.' },
  'busan-saha': { name: '부산 사하구', fullName: '부산광역시 사하구', focus: '부산 사하구 싱크볼 교체', localNote: '사하구 지역의 싱크볼 교체 상담을 제공합니다.' },
  'busan-geumjeong': { name: '부산 금정구', fullName: '부산광역시 금정구', focus: '부산 금정구 싱크볼 교체', localNote: '금정구 주택과 아파트의 싱크볼 교체를 안내합니다.' },
  'busan-gangseo': { name: '부산 강서구', fullName: '부산광역시 강서구', focus: '부산 강서구 싱크볼 교체', localNote: '강서구 지역의 싱크볼 교체와 설치를 상담합니다.' },
  'busan-yeonje': { name: '부산 연제구', fullName: '부산광역시 연제구', focus: '부산 연제구 싱크볼 교체', localNote: '연제구 아파트와 주택의 싱크볼 교체를 안내합니다.' },
  'busan-suyeong': { name: '부산 수영구', fullName: '부산광역시 수영구', focus: '부산 수영구 싱크볼 교체', localNote: '수영구 지역의 사각싱크볼과 언더싱크볼 교체를 상담합니다.' },
  'busan-sasang': { name: '부산 사상구', fullName: '부산광역시 사상구', focus: '부산 사상구 싱크볼 교체', localNote: '사상구 지역의 싱크볼 교체를 안내합니다.' },
  'busan-gijang': { name: '부산 기장군', fullName: '부산광역시 기장군', focus: '부산 기장군 싱크볼 교체', localNote: '기장군 주택과 아파트의 싱크볼 교체를 상담합니다.' },

  changwon: { name: '창원', fullName: '경상남도 창원시', focus: '창원 싱크볼 교체 및 창원 사각싱크볼 교체', localNote: '창원 전 지역의 싱크볼 교체와 사각싱크볼 시공을 상담합니다.' },
  masan: { name: '마산', fullName: '경상남도 창원시 마산 지역', focus: '마산 싱크볼 교체 및 마산 사각싱크볼 교체', localNote: '마산 지역의 싱크볼 교체와 사각싱크볼 시공을 안내합니다.' },
  jinhae: { name: '진해', fullName: '경상남도 창원시 진해 지역', focus: '진해 싱크볼 교체 및 진해 사각싱크볼 교체', localNote: '진해 지역의 싱크볼 교체 상담을 제공합니다.' },

  gimhae: { name: '김해', fullName: '경상남도 김해시', focus: '김해 싱크볼 교체 및 김해 사각싱크볼 교체', localNote: '김해 장유와 율하를 포함한 김해 전 지역을 상담합니다.' },
  yangsan: { name: '양산', fullName: '경상남도 양산시', focus: '양산 싱크볼 교체 및 양산 사각싱크볼 교체', localNote: '양산 물금과 동면 등 양산 지역의 싱크볼 교체를 안내합니다.' },
  jinju: { name: '진주', fullName: '경상남도 진주시', focus: '진주 싱크볼 교체', localNote: '진주 지역의 싱크볼 교체와 사각싱크볼 시공을 상담합니다.' },
  sacheon: { name: '사천', fullName: '경상남도 사천시', focus: '사천 싱크볼 교체', localNote: '사천 지역의 주택과 아파트 싱크볼 교체를 안내합니다.' },
  geoje: { name: '거제', fullName: '경상남도 거제시', focus: '거제 싱크볼 교체', localNote: '거제 지역의 싱크볼 교체와 설치를 상담합니다.' },
  tongyeong: { name: '통영', fullName: '경상남도 통영시', focus: '통영 싱크볼 교체', localNote: '통영 지역의 싱크볼 교체 상담을 제공합니다.' },
  goseong: { name: '고성', fullName: '경상남도 고성군', focus: '고성 싱크볼 교체', localNote: '고성 지역의 주택과 아파트 싱크볼 교체를 안내합니다.' },
  miryang: { name: '밀양', fullName: '경상남도 밀양시', focus: '밀양 싱크볼 교체', localNote: '밀양 지역의 싱크볼 교체와 언더싱크볼 시공을 상담합니다.' },
  haman: { name: '함안', fullName: '경상남도 함안군', focus: '함안 싱크볼 교체', localNote: '함안 지역의 싱크볼 교체 상담을 제공합니다.' },
  changnyeong: { name: '창녕', fullName: '경상남도 창녕군', focus: '창녕 싱크볼 교체', localNote: '창녕 지역의 싱크볼 교체와 설치를 안내합니다.' },
  gyeongnam: { name: '경남 기타 지역', fullName: '경상남도 기타 지역', focus: '경남 싱크볼 교체', localNote: '위에 안내된 지역 외 경남 지역도 방문 가능 여부를 상담합니다.' },
};
export function generateStaticParams() { return Object.keys(areas).map((slug) => ({ slug })); }
export const dynamicParams = false;
 
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const area = areas[slug];
  if (!area) return {};

  const title = `${area.name} 싱크볼 교체 | 사각싱크볼·언더싱크볼 시공 | 신세계싱크`;
  const description = `신세계싱크는 ${area.fullName} 싱크볼·씽크볼·싱크대볼 교체 전문 업체입니다. ${area.localNote} 사각싱크볼과 언더싱크볼 교체 상담을 제공합니다.`;

  return {
    title,
    description,
    alternates: { canonical: `/areas/${slug}/` },
    openGraph: {
      type: 'website',
      locale: 'ko_KR',
      siteName: '신세계싱크',
      title,
      description,
      images: ['/og-image.png'],
    },
  };
}

export default async function AreaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const area = areas[slug]; if (!area) notFound();
  const cases = await getManualCases();
  const areaCases = cases.filter(item => {
    // Use the entered region and the case title: titles often include the district
    // while the admin region field contains only the broader city.
    const region = item.region.replace(/\s+/g, '');
    const title = item.title.replace(/\s+/g, '');
    const combined = region + ' ' + title;
    const has = (name: string) => combined.includes(name.replace(/\s+/g, ''));
    const busanDistricts: Record<string, string[]> = {
      'busan-jung': ['중구'], 'busan-seo': ['서구'], 'busan-dong': ['동구'],
      'busan-yeongdo': ['영도구'], 'busan-busanjin': ['부산진구'],
      'busan-dongnae': ['동래구'], 'busan-nam': ['남구'], 'busan-buk': ['북구'],
      'busan-haeundae': ['해운대구', '해운대'], 'busan-saha': ['사하구'],
      'busan-geumjeong': ['금정구'], 'busan-gangseo': ['강서구'],
      'busan-yeonje': ['연제구'], 'busan-suyeong': ['수영구'],
      'busan-sasang': ['사상구'], 'busan-gijang': ['기장군', '기장']
    };
    const gyeongnamCities = ['창원','마산','진해','김해','양산','진주','사천','거제','통영','고성','밀양','함안','창녕'];
    if (slug === 'gyeongnam') return gyeongnamCities.some(has);
    if (slug === 'busan') return has('부산') || (region.includes('부산') && title.length > 0);
    if (slug === 'changwon') return ['창원','마산','진해'].some(has);
    if (slug === 'masan' || slug === 'jinhae') return has(area.name);
    if (slug.startsWith('busan-')) {
      // District-only terms must be supported by explicit Busan context.
      // Avoid assigning generic "중구/남구" cases from other cities.
      const isBusan = has('부산') || region.includes('부산');
      return isBusan && (busanDistricts[slug] || []).some(has);
    }
    return has(area.name);
  }).slice(0,6);
  const smsHref = 'sms:01055043858?body=' + encodeURIComponent("[싱크볼 교체 상담]\n*싱크볼 전체 사진과 하부장 내부 사진과 아래 정보를 보내주시면 감사하겠습니다.\n\n거주 지역(시 · 동):\n싱크볼 가로 · 세로 크기(mm):\n상담 내용:");
  return <main className="local-page">
    <section className="local-hero">
      <div className="wrap">
        <nav className="local-breadcrumb" aria-label="현재 위치"><a href="/">홈</a><span>›</span><span>지역별 안내</span><span>›</span><strong>{area.name}</strong></nav>
        <div className="local-hero-grid">
          <div className="local-hero-copy">
            <span className="local-eyebrow">{area.fullName} · SINK BOWL SERVICE</span>
            <h1>{area.name} <span>싱크볼 교체</span></h1>
            <p>{area.localNote}<br/>현재 주방에 맞는 교체 방법을 사진으로 상담해 드립니다.</p>
            <div className="local-trust">
              <span><b>✓</b> 대표 직접 시공</span><span><b>✓</b> 꼼꼼한 마무리</span><span><b>✓</b> 부산·경남 출장 상담</span>
            </div>
            <a className="local-hero-link" href="#local-consult">교체 상담 바로가기 <span aria-hidden="true">↗</span></a>
          </div>
          <div className="local-hero-photo" role="img" aria-label="사각 싱크볼과 언더 싱크볼 제품 사진"><span>신세계싱크 · SINK BOWL SPECIALIST</span></div>
        </div>
      </div>
    </section>

    <section className="local-section local-needs">
      <div className="wrap">
        <div className="local-section-heading"><span className="local-eyebrow">WHEN TO REPLACE</span><h2>이런 경우, 싱크볼 교체를 고려해 보세요</h2><p>오래된 싱크볼의 상태와 주방 구조에 따라 적합한 교체 방법이 달라집니다.</p></div>
        <div className="local-reason-grid">
          <div className="local-reason"><span aria-hidden="true">◉</span><strong>누수·물샘</strong><p>배수구 주변이나 고정 부위에서 물이 새는 경우</p></div>
          <div className="local-reason"><span aria-hidden="true">✦</span><strong>녹·오염</strong><p>물때와 얼룩, 표면 손상이 심해진 경우</p></div>
          <div className="local-reason"><span aria-hidden="true">⌁</span><strong>처짐·탈락</strong><p>싱크볼이 아래로 처지거나 떨어진 경우</p></div>
          <div className="local-reason"><span aria-hidden="true">▣</span><strong>주방 분위기 변경</strong><p>투볼을 원볼 또는 사각 싱크볼로 바꾸고 싶은 경우</p></div>
        </div>
        <p className="local-detail-note">교체 전에는 상판 타공 크기와 소재, 수전·배수구 위치, 하부장 내부 고정 상태를 함께 확인해야 합니다.</p>
      </div>
    </section>

    <section className="local-section local-work">
      <div className="wrap">
        <div className="local-section-heading"><span className="local-eyebrow">REAL INSTALLATION</span><h2>{area.name} 실제 시공 사례</h2><p>직접 등록한 현장 사진으로 시공 결과를 확인해 보세요.</p></div>
        {areaCases.length > 0 ? <>
          <div className="local-case-grid">{areaCases.map(item => <a className="local-case-card" key={item.id} href={'/cases/'+item.slug+'/'}>
            {(item.after_url||item.before_url) && <div className="local-case-image"><img src={item.after_url||item.before_url||''} alt={item.title+' 실제 시공 사진'} loading="lazy"/><span>시공 사진 보기 ↗</span></div>}
            <div className="local-case-body"><span>시공 사례</span><h3>{item.title}</h3>{item.description&&<p>{item.description}</p>}<strong>자세히 보기 →</strong></div>
          </a>)}</div>
          <a className="local-all-cases" href="/cases/">전체 시공 사례 보기 <span aria-hidden="true">→</span></a>
        </> : <div className="local-empty-cases"><div className="local-empty-visual" aria-hidden="true"></div><div><h3>실제 시공 사례를 준비하고 있습니다</h3><p>다른 지역의 싱크볼 교체 전후 사진도 확인해 보세요.</p><a href="/cases/">전체 시공 사례 확인 →</a></div></div>}
      </div>
    </section>

    <section className="local-section local-prep">
      <div className="wrap local-prep-grid">
        <div className="local-prep-card"><span className="local-prep-symbol" aria-hidden="true">☑</span><h2>상담 전, 이렇게 준비해 주세요</h2><ul><li>싱크볼 전체와 상판이 함께 보이는 사진</li><li>싱크볼 가로·세로 크기(mm)</li><li>싱크대 하부장 내부와 고정 부위 사진</li><li>거주 지역(시·동)과 희망 교체 형태</li></ul></div>
        <div className="local-prep-card local-prep-second"><span className="local-prep-symbol" aria-hidden="true">✧</span><h2>사진으로 간편하게 상담하세요</h2><p>사진과 기본 정보를 보내주시면 제품 규격과 설치 구조를 확인하고 상담해 드립니다.</p><p>출장 가능 여부와 작업 비용은 지역, 제품 규격, 상판 소재 및 현장 상태에 따라 달라집니다.</p></div>
      </div>
    </section>

    <section className="local-contact" id="local-consult">
      <div className="wrap local-contact-grid">
        <div><span className="local-eyebrow">CONTACT US</span><h2>{area.name} 싱크볼 교체 <em>상담 문의</em></h2><p>전화 또는 문자로 편하게 문의해 주세요.<br/>문자 상담 시 사진을 직접 첨부하실 수 있습니다.</p></div>
        <div className="local-contact-actions">
          <a className="local-contact-call" href="tel:01055043858" aria-label="010-5504-3858 전화 상담 연결"><span className="local-contact-icon" aria-hidden="true">☎</span><span><strong>전화 상담</strong><small>010-5504-3858</small></span><span className="local-contact-arrow" aria-hidden="true">↗</span></a>
          <a className="local-contact-sms" href={smsHref} aria-label="010-5504-3858 문자 상담 앱 열기"><span className="local-contact-icon" aria-hidden="true">✉</span><span><strong>문자 상담</strong><small>사진 첨부 후 전송</small></span><span className="local-contact-arrow" aria-hidden="true">↗</span></a>
        </div>
      </div>
    </section>
  </main>;
}
