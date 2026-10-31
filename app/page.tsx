
const areas = [
  ['부산 전체', 'busan'],
  ['부산 중구', 'busan-jung'],
  ['부산 서구', 'busan-seo'],
  ['부산 동구', 'busan-dong'],
  ['부산 영도구', 'busan-yeongdo'],
  ['부산 부산진구', 'busan-busanjin'],
  ['부산 동래구', 'busan-dongnae'],
  ['부산 남구', 'busan-nam'],
  ['부산 북구', 'busan-buk'],
  ['부산 해운대구', 'busan-haeundae'],
  ['부산 사하구', 'busan-saha'],
  ['부산 금정구', 'busan-geumjeong'],
  ['부산 강서구', 'busan-gangseo'],
  ['부산 연제구', 'busan-yeonje'],
  ['부산 수영구', 'busan-suyeong'],
  ['부산 사상구', 'busan-sasang'],
  ['부산 기장군', 'busan-gijang'],
  ['창원 전체', 'changwon'],
  ['창원 의창구', 'changwon-uichang'],
  ['창원 성산구', 'changwon-seongsan'],
  ['창원 마산합포구', 'changwon-masanhappo'],
  ['창원 마산회원구', 'changwon-masanhoewon'],
  ['창원 진해구', 'changwon-jinhae'],
  ['마산', 'masan'],
  ['진해', 'jinhae'],
  ['김해', 'gimhae'],
  ['양산', 'yangsan'],
  ['진주', 'jinju'],
  ['사천', 'sacheon'],
  ['거제', 'geoje'],
  ['통영', 'tongyeong'],
  ['고성', 'goseong'],
  ['밀양', 'miryang'],
  ['함안', 'haman'],
  ['창녕', 'changnyeong'],
  ['경남 기타 지역', 'gyeongnam'],
];
export default function Home(){return <>
<section className="hero"><div className="wrap"><div className="hero-copy"><div className="eyebrow">BUSAN · GYEONGNAM SINK BOWL SPECIALIST</div><h1>싱크볼 하나만 바꿔도<br/>주방이 달라집니다.</h1><p className="lead">오래 사용한 싱크볼, 떨어짐·부식·오염으로 불편한 개수대.<br/>신세계싱크에서 새 싱크볼 교체를 상담해 보세요.</p><div className="btn-row"><a className="btn btn-primary" href="tel:01055043858">전화 상담 010-5504-3858</a><a className="btn btn-light" href="/contact/">사진으로 교체 상담하기</a></div></div></div></section>
<section className="section"><div className="wrap"><div className="section-head"><div><div className="kicker">WHY SHINSEGAE SINK</div><h2>싱크볼 교체, 필요한 부분을 꼼꼼하게</h2><p>주방 환경과 기존 상판·하부장 상태를 확인한 뒤 교체 방법을 안내합니다.</p></div><a className="text-link" href="/about/">업체 소개 보기 →</a></div><div className="grid3"><article className="card"><div className="card-body"><div className="icon-box">▣</div><h3>싱크볼 교체 전문</h3><p>사각싱크볼, 언더싱크볼 등 주방 환경에 맞는 교체 상담을 진행합니다.</p></div></article><article className="card"><div className="card-body"><div className="icon-box">⌖</div><h3>부산·경남 출장 상담</h3><p>부산과 경남 지역의 교체 가능 여부와 방문 일정을 상담해 드립니다.</p></div></article><article className="card"><div className="card-body"><div className="icon-box">▧</div><h3>사진으로 먼저 상담</h3><p>싱크볼 전체 사진과 하부장 사진을 보내주시면 교체 가능 여부를 확인하는 데 도움이 됩니다.</p></div></article></div></div></section>
<section className="section section-soft"><div className="wrap"><div className="section-head"><div><div className="kicker">SINK BOWL TYPES</div><h2>우리 집 주방에 어울리는 싱크볼</h2><p>기존 싱크대 구조와 상판 타공 크기를 확인하고 제품을 선택하세요.</p></div></div><div className="grid3"><article className="card"><div className="photo-placeholder"/><div className="card-body"><h3>사각싱크볼</h3><p>넉넉한 내부 공간과 깔끔한 디자인을 원하는 주방에 추천합니다.</p></div></article><article className="card"><div className="photo-placeholder"/><div className="card-body"><h3>언더싱크볼</h3><p>상판 아래쪽에 설치하는 방식으로 상판과 싱크볼 경계를 깔끔하게 정리합니다.</p></div></article><article className="card"><div className="photo-placeholder"/><div className="card-body"><h3>일반 싱크볼</h3><p>기존 주방 구조와 사용 환경에 맞춰 교체 방법을 상담합니다.</p></div></article></div></div></section>
<section className="section"><div className="wrap"><div className="section-head"><div><div className="kicker">SERVICE AREA</div><h2>부산·경남 싱크볼 교체 상담 지역</h2><p>지역명을 선택하면 해당 지역의 싱크볼 교체 안내를 확인할 수 있습니다.</p></div></div><div className="area-links">{areas.map(([n,s])=><a key={s} href={`/areas/${s}/`}>{n} 싱크볼 교체</a>)}</div></div></section>
<section className="band"><div className="wrap band-inner"><div><h2>싱크볼 교체가 필요하신가요?</h2><p>싱크대 사진을 준비해 주시면 보다 정확한 상담에 도움이 됩니다.</p></div><a className="btn btn-primary" href="/contact/">상담 신청하기 →</a></div></section>
</>}
