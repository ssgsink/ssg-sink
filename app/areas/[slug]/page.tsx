import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

type AreaInfo = { name: string; fullName: string; focus: string; localNote: string };
const areas: Record<string, AreaInfo> = {
  busan: { name: '부산', fullName: '부산광역시', focus: '부산 싱크볼 교체와 사각싱크볼 교체', localNote: '부산 각 구·군의 아파트와 주택에서 싱크볼 교체가 필요한 경우 사진으로 먼저 상담할 수 있습니다.' },
  changwon: { name: '창원', fullName: '창원시', focus: '창원 싱크볼 교체와 사각싱크볼 교체', localNote: '창원 지역에서 오래된 싱크볼, 부식된 개수대, 처지거나 떨어진 싱크볼 교체를 상담합니다.' },
  masan: { name: '마산', fullName: '마산 지역', focus: '마산 싱크볼 교체와 사각볼 교체', localNote: '마산 지역의 아파트와 주택 주방 구조에 맞춰 기존 싱크볼 규격과 상판 상태를 확인합니다.' },
  jinhae: { name: '진해', fullName: '창원시 진해구', focus: '진해 싱크볼 교체와 씽크볼 교체', localNote: '진해 지역에서 싱크대볼이나 개수대 교체가 필요할 때 기존 제품 사진과 치수를 바탕으로 상담합니다.' },
  gimhae: { name: '김해', fullName: '김해시', focus: '김해 싱크볼 교체와 사각싱크볼 교체', localNote: '김해 지역의 주방 환경과 상판 타공 크기를 확인해 교체 가능한 싱크볼 형태를 안내합니다.' },
  yangsan: { name: '양산', fullName: '양산시', focus: '양산 싱크볼 교체와 사각볼 교체', localNote: '양산 지역에서 싱크볼이 녹슬거나 떨어지는 등 교체가 필요한 상황을 사진으로 먼저 확인합니다.' },
  jinju: { name: '진주', fullName: '진주시', focus: '진주 싱크볼 교체와 개수대 교체', localNote: '진주 지역의 싱크대 구조와 기존 싱크볼 크기를 확인한 뒤 교체 상담을 진행합니다.' },
  geoje: { name: '거제', fullName: '거제시', focus: '거제 싱크볼 교체와 사각씽크볼 교체', localNote: '거제 지역에서 기존 개수대를 새 싱크볼로 바꾸려는 경우 사진과 거주 지역을 알려주세요.' },
  tongyeong: { name: '통영', fullName: '통영시', focus: '통영 싱크볼 교체와 싱크대볼 교체', localNote: '통영 지역의 주택 및 아파트 주방에 맞는 싱크볼 교체 가능 여부를 상담합니다.' },
  miryang: { name: '밀양', fullName: '밀양시', focus: '밀양 싱크볼 교체와 언더싱크볼 교체', localNote: '밀양 지역에서 언더싱크볼이나 일반 싱크볼을 교체하려는 경우 설치 구조부터 확인합니다.' },
  sacheon: { name: '사천', fullName: '사천시', focus: '사천 싱크볼 교체와 개수대 교체', localNote: '사천 지역의 싱크볼 교체는 기존 볼의 크기와 상판·하부장 상태를 확인한 뒤 안내합니다.' },
  gyeongnam: { name: '경남', fullName: '경상남도', focus: '경남 싱크볼 교체와 사각싱크볼 교체', localNote: '경남 지역은 시·군과 현장 위치에 따라 출장 가능 일정이 달라질 수 있으므로 먼저 문의해 주세요.' },
};
export function generateStaticParams() { return Object.keys(areas).map((slug) => ({ slug })); }
export const dynamicParams = false;
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const area = areas[slug]; if (!area) return {};
  return {
    title: `${area.name} 싱크볼 교체 | 씽크볼·싱크대볼·개수대 교체`,
    description: `${area.name} 싱크볼 교체 전문 신세계싱크. ${area.name} 씽크볼 교체, 싱크대볼 교체, 개수대 교체, 사각싱크볼·사각씽크볼 교체 상담.`,
    alternates: { canonical: `/areas/${slug}/` },
    openGraph: { title: `${area.name} 싱크볼 교체 | 신세계싱크`, description: `${area.name} 지역 싱크볼·개수대 교체 상담 안내`, images: ['/og-image.png'] },
  };
}
export default async function AreaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const area = areas[slug]; if (!area) notFound();
  return <>
    <section className="page-hero"><div className="wrap"><div className="breadcrumbs"><a href="/">홈</a> / 지역별 안내 / {area.name}</div><div className="kicker">LOCAL SINK BOWL SERVICE</div><h1>{area.name} 싱크볼 교체</h1><p>{area.localNote}</p></div></section>
    <section className="section"><div className="wrap content">
      <h2>{area.focus}</h2>
      <p>{area.fullName}에서 싱크볼이 낡거나 녹이 생긴 경우, 배수구 주변 오염이 심한 경우, 싱크볼이 처지거나 떨어진 경우에는 새 싱크볼로 교체하는 방법을 고려할 수 있습니다. 기존 개수대를 사각싱크볼로 바꾸고 싶은 경우에도 먼저 규격과 설치 구조를 확인해야 합니다.</p>
      <p>싱크볼 교체는 제품의 가로·세로 크기뿐 아니라 상판 타공 형태, 상판 소재, 수전과 배수구 위치, 하부장 안쪽의 고정 상태에 따라 작업 방법이 달라집니다. 사각볼 교체나 언더싱크볼 교체를 원하신다면 현재 싱크대 사진을 함께 보내주세요.</p>
      <h2 style={{marginTop:35}}>이런 경우 교체 상담을 받아보세요</h2>
      <ul className="list-check"><li>오래 사용해 표면이 변색되거나 부식된 싱크볼</li><li>고정 부위가 떨어지거나 싱크볼이 아래로 처진 경우</li><li>기존 투볼 싱크볼을 원볼 또는 사각싱크볼로 바꾸고 싶은 경우</li><li>싱크대 개수대와 배수구 주변을 새롭게 정리하고 싶은 경우</li></ul>
      <h2 style={{marginTop:35}}>상담 전에 준비해 주세요</h2>
      <ul className="list-check"><li>싱크볼 전체와 상판이 함께 보이는 사진</li><li>싱크볼 가로·세로 크기 (mm)</li><li>싱크대 하부장 내부와 고정 부위 사진</li><li>상세 거주 지역과 희망하는 교체 형태</li></ul>
      <div className="notice">실제 출장 가능 여부와 작업 비용은 지역, 제품 규격, 상판 소재 및 현장 상태에 따라 달라집니다. 사진 상담 후 필요한 내용을 추가로 확인해 드립니다.</div>
      <div className="btn-row"><a className="btn btn-blue" href="tel:01055043858">전화 상담 010-5504-3858</a><a className="btn btn-blue" href="/contact/">문자·사진 상담 안내</a></div>
    </div></section>
  </>;
}
