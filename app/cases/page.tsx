import type { Metadata } from 'next';
import { sinkCases } from './cases-data';

export const metadata: Metadata = {
  title: '싱크볼·씽크볼 교체 시공 사례 | 사각 싱크볼·개수대 교체 | 신세계싱크',
  description:
    '신세계싱크의 실제 싱크볼 교체 전후 사진을 확인하세요. 사각 싱크볼 교체, 사각볼 교체, 씽크볼 교체, 싱크대볼 및 개수대 교체 사례를 소개합니다.',
  alternates: { canonical: '/cases/' },
};

export default function Cases() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="breadcrumbs">홈 / 시공 사례</div>
          <div className="kicker">INSTALLATION STORIES</div>
          <h1>싱크볼 교체 시공 사례</h1>
          <p>
            교체 전과 후를 사진으로 비교해 보세요.
            <br />
            신세계싱크의 싱크볼·씽크볼 교체 작업을 소개합니다.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div style={{ textAlign: 'center', marginBottom: 38 }}>
            <div className="premium-eyebrow">BEFORE &amp; AFTER</div>
            <h2 style={{ fontSize: 30, margin: '12px 0' }}>실제 시공 전후 사진</h2>
            <p style={{ color: '#777', lineHeight: 1.8 }}>
              오래된 개수대 교체부터 사각 싱크볼 설치까지
              <br />
              작업 전후의 차이를 한눈에 확인하실 수 있습니다.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 24 }}>
            {sinkCases.map((item) => (
              <article className="card" key={item.id} style={{ overflow: 'hidden', borderRadius: 8 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, background: '#e8e4dc' }}>
                  <div style={{ position: 'relative' }}>
                    <img src={item.before} alt={item.beforeAlt} style={{ width: '100%', aspectRatio: '4 / 3', objectFit: 'cover', display: 'block' }} />
                    <span style={{ position: 'absolute', left: 9, top: 9, padding: '5px 9px', color: '#fff', background: 'rgba(37,39,36,.82)', fontSize: 11, letterSpacing: 1 }}>BEFORE</span>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <img src={item.after} alt={item.afterAlt} style={{ width: '100%', aspectRatio: '4 / 3', objectFit: 'cover', display: 'block' }} />
                    <span style={{ position: 'absolute', left: 9, top: 9, padding: '5px 9px', color: '#252724', background: '#d4bd91', fontSize: 11, letterSpacing: 1 }}>AFTER</span>
                  </div>
                </div>
                <div className="card-body" style={{ padding: 22 }}>
                  <div className="premium-eyebrow">{item.date} · SINK REPLACEMENT</div>
                  <h3 style={{ margin: '10px 0' }}>{item.title}</h3>
                  <p style={{ color: '#777', lineHeight: 1.75 }}>{item.description}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 15 }}>
                    {item.tags.map((tag) => (
                      <span key={tag} style={{ padding: '5px 9px', border: '1px solid #e8e4dc', color: '#77766f', fontSize: 12 }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div style={{ marginTop: 52, padding: '38px 24px', textAlign: 'center', background: '#f5f2ec' }}>
            <div className="premium-eyebrow">CONSULTATION</div>
            <h2 style={{ margin: '12px 0' }}>우리 집 싱크볼 교체도 상담해 보세요</h2>
            <p style={{ color: '#777', lineHeight: 1.8, marginBottom: 22 }}>
              싱크대 전체 사진과 상판, 하부장 사진을 보내주시면
              <br />
              교체 가능 여부와 작업 방법을 안내해 드립니다.
            </p>
            <a href="tel:01055043858" className="gold-button">전화 상담 010-5504-3858</a>
          </div>
        </div>
      </section>
    </>
  );
}
