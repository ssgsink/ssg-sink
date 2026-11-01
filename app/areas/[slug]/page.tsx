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
    const region = item.region.trim().replace(/\s+/g,'');
    const label = area.name.replace(/\s+/g,'');
    if(slug === 'gyeongnam') return ['창원','마산','진해','김해','양산','진주','사천','거제','통영','고성','밀양','함안','창녕'].some(name=>region.includes(name));
    if(slug === 'busan') return region.includes('부산');
    if(slug === 'changwon') return ['창원','마산','진해'].some(name=>region.includes(name));
    if(slug === 'masan'||slug === 'jinhae') return region.includes(label);
    if(slug.startsWith('busan-')) return region.includes(label)||region.includes(label.replace('부산',''))&&region.includes('부산');
    return region.includes(label);
  }).slice(0,6);
  return <>
    <section className="page-hero"><div className="wrap"><div className="breadcrumbs"><a href="/">홈</a> / 지역별 안내 / {area.name}</div><div className="kicker">LOCAL SINK BOWL SERVICE</div><h1>{area.name} 싱크볼 교체</h1><p>{area.localNote}</p></div></section>
    <section className="section"><div className="wrap content">
      <h2>{area.focus}</h2>
      <p>{area.fullName}에서 싱크볼이 낡거나 녹이 생긴 경우, 배수구 주변 오염이 심한 경우, 싱크볼이 처지거나 떨어진 경우에는 새 싱크볼로 교체하는 방법을 고려할 수 있습니다. 기존 개수대를 사각싱크볼로 바꾸고 싶은 경우에도 먼저 규격과 설치 구조를 확인해야 합니다.</p>
      <p>싱크볼 교체는 제품의 가로·세로 크기뿐 아니라 상판 타공 형태, 상판 소재, 수전과 배수구 위치, 하부장 안쪽의 고정 상태에 따라 작업 방법이 달라집니다. 사각볼 교체나 언더싱크볼 교체를 원하신다면 현재 싱크대 사진을 함께 보내주세요.</p>
      {areaCases.length>0&&<section style={{marginTop:36}}><h2>{area.name} 실제 시공 사례</h2><p>직접 등록한 시공 사례 중 해당 지역의 작업을 소개합니다.</p><div className="case-grid">{areaCases.map(item=><article className="case-card" key={item.id}><a href={'/cases/'+item.slug+'/'}>{(item.after_url||item.before_url)&&<img className="case-blog-image" src={item.after_url||item.before_url||''} alt={item.title+' 교체 시공 사진'}/>}<div className="case-copy"><strong>{item.title}</strong><p>{item.description}</p><span style={{color:'#0758a6'}}>시공 전후 사진 보기 →</span></div></a></article>)}</div><p><a href="/cases/">전체 시공 사례 보기 →</a></p></section>}
      <h2 style={{marginTop:35}}>이런 경우 교체 상담을 받아보세요</h2>
      <ul className="list-check"><li>오래 사용해 표면이 변색되거나 부식된 싱크볼</li><li>고정 부위가 떨어지거나 싱크볼이 아래로 처진 경우</li><li>기존 투볼 싱크볼을 원볼 또는 사각싱크볼로 바꾸고 싶은 경우</li><li>싱크대 개수대와 배수구 주변을 새롭게 정리하고 싶은 경우</li></ul>
      <h2 style={{marginTop:35}}>상담 전에 준비해 주세요</h2>
      <ul className="list-check"><li>싱크볼 전체와 상판이 함께 보이는 사진</li><li>싱크볼 가로·세로 크기 (mm)</li><li>싱크대 하부장 내부와 고정 부위 사진</li><li>상세 거주 지역과 희망하는 교체 형태</li></ul>
      <div className="notice">실제 출장 가능 여부와 작업 비용은 지역, 제품 규격, 상판 소재 및 현장 상태에 따라 달라집니다. 사진 상담 후 필요한 내용을 추가로 확인해 드립니다.</div>
      <div className="btn-row"><a className="btn btn-blue" href="tel:01055043858">전화 상담 010-5504-3858</a><a className="btn btn-blue" href="/contact/">문자·사진 상담 안내</a></div>
    </div></section>
  </>;
}
