
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '싱크볼 교체 시공 사례 | 부산·경남 신세계싱크',
  description:
    '신세계싱크의 실제 싱크볼 교체 시공 사진을 확인하세요. 사각싱크볼, 언더싱크볼, 수전 교체 등 부산·경남 시공 사례를 소개합니다.',
  alternates: { canonical: '/cases/' },
};

const cases = [
  {
    image: '/images/case-01-faucet-spray.jpg',
    category: 'FAUCET & SINK',
    title: '폭포형 수전과 싱크볼',
    description: '수전에서 물이 분사되는 모습과 스테인리스 싱크볼의 디테일을 확인해 보세요.',
    alt: '싱크볼과 폭포형 수전 시공 사진',
  },
  {
    image: '/images/case-02-undermount-sink.jpg',
    category: 'UNDERMOUNT SINK',
    title: '언더싱크볼 교체',
    description: '상판과 자연스럽게 이어지는 깔끔한 언더싱크볼 시공 모습입니다.',
    alt: '언더싱크볼 교체 시공 사진',
  },
  {
    image: '/images/case-03-square-sink.jpg',
    category: 'SQUARE SINK',
    title: '사각 싱크볼 교체',
    description: '넉넉한 내부 공간과 반듯한 라인이 돋보이는 사각 싱크볼입니다.',
    alt: '사각 싱크볼 교체 시공 사진',
  },
  {
    image: '/images/case-04-stainless-sink.jpg',
    category: 'STAINLESS SINK',
    title: '스테인리스 싱크볼 시공',
    description: '주방 상판과 조화를 이루는 스테인리스 싱크볼 설치 사례입니다.',
    alt: '스테인리스 싱크볼 설치 사진',
  },
];

export default function Cases() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="breadcrumbs">홈 / 시공 사례</div>
          <div className="kicker">INSTALLATION STORIES</div>
          <h1>싱크볼 교체 시공 사례</h1>
          <p>
            사진으로 확인하는 신세계싱크의 시공 결과.
            <br />
            작은 디테일까지 꼼꼼하게 마무리합니다.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div style={{ textAlign: 'center', marginBottom: 42 }}>
            <div className="premium-eyebrow">OUR WORK</div>
            <h2 style={{ fontSize: 30, margin: '12px 0' }}>
              실제 시공 사진
            </h2>
            <p style={{ color: '#777', lineHeight: 1.8 }}>
              사각 싱크볼부터 언더싱크볼까지
              <br />
              다양한 싱크볼 교체 모습을 살펴보세요.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 24,
            }}
          >
            {cases.map((item, index) => (
              <article
                className="card"
                key={item.image}
                style={{ overflow: 'hidden', borderRadius: 8 }}
              >
                <div
                  style={{
                    width: '100%',
                    aspectRatio: '4 / 3',
                    overflow: 'hidden',
                    background: '#eee',
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.alt}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                </div>

                <div className="card-body" style={{ padding: 22 }}>
                  <div className="premium-eyebrow">
                    {String(index + 1).padStart(2, '0')} / {item.category}
                  </div>
                  <h3 style={{ margin: '10px 0' }}>{item.title}</h3>
                  <p style={{ color: '#777', lineHeight: 1.7 }}>
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div
            style={{
              marginTop: 55,
              padding: '38px 24px',
              textAlign: 'center',
              background: '#f5f2ec',
            }}
          >
            <div className="premium-eyebrow">CONSULTATION</div>
            <h2 style={{ margin: '12px 0' }}>
              우리 집 싱크볼도 바꿔볼까요?
            </h2>
            <p style={{ color: '#777', marginBottom: 22 }}>
              싱크대 사진을 보내주시면 교체 가능 여부를 상담해 드립니다.
            </p>
            <a href="tel:01055043858" className="gold-button">
              전화 상담 010-5504-3858
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
