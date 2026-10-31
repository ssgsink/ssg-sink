import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const vercelProductionDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || (vercelProductionDomain ? `https://${vercelProductionDomain}` : 'https://shinsegae-sink.vercel.app')).replace(/\/$/, '');
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: '신세계싱크 | 부산·경남 싱크볼 교체 전문', template: '%s | 신세계싱크' },
  description: '부산·경남 싱크볼 교체 전문 신세계싱크. 사각싱크볼, 언더싱크볼, 싱크대볼 및 개수대 교체 상담. 시공 사례와 교체 안내를 확인하고 전화·문자로 문의하세요.',
  alternates: { canonical: '/' },
  openGraph: { type: 'website', locale: 'ko_KR', siteName: '신세계싱크', title: '신세계싱크 | 부산·경남 싱크볼 교체 전문', description: '싱크볼 하나만 바꿔도 주방이 달라집니다. 부산·경남 싱크볼 교체 전문 신세계싱크.', images: [{ url: '/og-image.png', width: 1200, height: 630, alt: '신세계싱크 부산·경남 싱크볼 교체 전문' }] },
  twitter: { card: 'summary_large_image', title: '신세계싱크 | 부산·경남 싱크볼 교체 전문', images: ['/og-image.png'] },
  robots: { index: true, follow: true },
  ...(process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION ? { verification: { other: { 'naver-site-verification': process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION } } } : {}),
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = { '@context': 'https://schema.org', '@type': 'HomeAndConstructionBusiness', name: '신세계싱크', url: siteUrl, telephone: '+82-10-5504-3858', description: '부산·경남 싱크볼 교체 전문 업체', areaServed: ['부산광역시', '경상남도'], knowsAbout: ['싱크볼 교체', '씽크볼 교체', '사각싱크볼 교체', '사각씽크볼 교체', '언더싱크볼 교체', '싱크대볼 교체', '개수대 교체'] };
  return <html lang="ko"><body><script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}/><Header/><main>{children}</main><Footer/></body></html>;
}
