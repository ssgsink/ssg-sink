export type SinkCase = {
  id: string;
  title: string;
  description: string;
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
  tags: string[];
};

export const sinkCases: SinkCase[] = [
  {
    id: 'case-01',
    title: '마산 창원 진해- 오래된 주방 싱크볼 교체',
    description: '경남 창원에서 기존 싱크볼을 철거하고 새 스테인리스 씽크볼로 교체한 사례입니다. 마산, 창원, 진해지역에서 싱크대볼 교체를 계획하신다면 가까이 신세계싱크가 있습니다.',
    before: '/images/cases/case-01-before.jpg',
    after: '/images/cases/case-01-after.jpg',
    beforeAlt: '교체 전 기존 주방 싱크볼',
    afterAlt: '교체 후 새 스테인리스 싱크볼',
    tags: ['마산 싱크볼 교체', '창원 씽크볼 교체', '진해 싱크대볼 교체'],
  },
  {
    id: 'case-02',
    title: '김해 낡은 개수대를 사각 싱크볼로 교체',
    description: '경남 김해 현장에서 사용감이 있는 기존 개수대를 철거하고 반듯한 라인의 사각 싱크볼로 교체했습니다. 사각볼 교체로 세척 공간을 깔끔하게 정리한 사례입니다. 김해 진영, 장유, 율하에서 싱크볼 / 씽크볼 교체가 필요하시면 신세계싱크와 상의하세요.',
    before: '/images/cases/case-02-before.jpg',
    after: '/images/cases/case-02-after.jpg',
    beforeAlt: '교체 전 오래된 주방 개수대',
    afterAlt: '교체 후 사각 스테인리스 싱크볼',
    tags: ['개수대 교체', '김해 사각 싱크볼 교체', '사각볼 교체'],
  },
  {
    id: 'case-03',
    title: '양산 주방 분위기를 바꾸는 사각볼 / 싱크볼 교체',
    description: '경남 양산 현장에서 기존 싱크볼을 철거한 뒤 깊이감 있는 사각 싱크볼을 설치했습니다. 기존 주방 상판과 주변 설비를 확인해 알맞게 교체하는 것이 중요합니다.',
    before: '/images/cases/case-03-before.jpg',
    after: '/images/cases/case-03-after.jpg',
    beforeAlt: '사각 싱크볼 교체 전 기존 싱크대볼',
    afterAlt: '사각 싱크볼 교체 후 모습',
    tags: ['양산 사각볼 교체', '양산 싱크대볼 교체', '양산 싱크볼 교체'],
  },
  {
    id: 'case-04',
    title: '진주 오래된 씽크볼과 수전 주변 정리',
    description: '경남 진주 지역에서 오래 사용한 씽크볼을 새 제품으로 교체한 사례입니다. 싱크볼뿐 아니라 배수구와 수전 주변의 연결 상태까지 꼼꼼하게 확인합니다.',
    before: '/images/cases/case-04-before.jpg',
    after: '/images/cases/case-04-after.jpg',
    beforeAlt: '교체 전 사용감이 있는 씽크볼',
    afterAlt: '교체 후 깔끔한 스테인리스 싱크볼',
    tags: ['씽크볼 교체', '개수대 교체', '싱크볼 교체'],
  },
  {
    id: 'case-05',
    title: '경남 밀양- 싱크대 개수대 교체 시공',
    description: '경남 밀양시에서 기존 개수대를 철거하고 새 싱크볼로 교체했습니다. 싱크대볼 교체는 제품 크기와 상판 상태, 배수 연결 구조를 먼저 확인한 뒤 진행합니다.',
    before: '/images/cases/case-05-before.jpg',
    after: '/images/cases/case-05-after.jpg',
    beforeAlt: '교체 전 기존 싱크대 개수대',
    afterAlt: '교체 후 새 싱크볼과 수전',
    tags: ['싱크대 개수대 교체', '싱크대볼 교체', '싱크볼 교체'],
  },
];
