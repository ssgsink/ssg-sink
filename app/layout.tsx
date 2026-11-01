import type { Metadata } from 'next';
import Script from 'next/script';
import AnalyticsEvents from '@/components/AnalyticsEvents';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileContactBar from '@/components/MobileContactBar';

const vercelProductionDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || (vercelProductionDomain ? `https://${vercelProductionDomain}` : 'https://ssg-sink.vercel.app')).replace(/\/$/, '');
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: '신세계싱크 | 부산·경남 싱크볼 교체 전문', template: '%s | 신세계싱크' },
  description: '신세계싱크｜부산·경남 전 지역 싱크볼 교체 전문 업체. 사각 싱크볼부터 언더 씽크볼까지, 다양한 싱크대볼 교체 및 설치 가능합니다.',
  openGraph: { type: 'website', locale: 'ko_KR', siteName: '신세계싱크', title: '신세계싱크 | 부산·경남 싱크볼 교체 전문', description: '싱크볼 하나만 바꿔도 주방이 달라집니다. 부산·경남 싱크볼 교체 전문 신세계싱크.', images: [{ url: '/og-image.png', width: 1200, height: 630, alt: '신세계싱크 부산·경남 싱크볼 교체 전문' }] },
  twitter: { card: 'summary_large_image', title: '신세계싱크 | 부산·경남 싱크볼 교체 전문', images: ['/og-image.png'] },
  robots: { index: true, follow: true },
  ...(process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION ? { verification: { other: { 'naver-site-verification': process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION } } } : {}),
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = { '@context': 'https://schema.org', '@type': 'HomeAndConstructionBusiness', name: '신세계싱크', url: siteUrl, telephone: '+82-10-5504-3858', description: '부산·경남 싱크볼 교체 전문 업체', areaServed: ['부산광역시', '경상남도'], knowsAbout: ['싱크볼 교체', '씽크볼 교체', '사각싱크볼 교체', '사각씽크볼 교체', '언더싱크볼 교체', '싱크대볼 교체', '개수대 교체'] };
  return <html lang="ko"><body><script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}/><Script src="https://www.googletagmanager.com/gtag/js?id=G-ETWF2EDXHX" strategy="afterInteractive"/><Script id="ga4-init" strategy="afterInteractive" dangerouslySetInnerHTML={{__html: "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag(\u0027js\u0027,new Date());gtag(\u0027config\u0027,\u0027G-ETWF2EDXHX\u0027);"}}/><AnalyticsEvents/><Header/><main>{children}</main><Footer/><MobileContactBar/></body></html>;
}
