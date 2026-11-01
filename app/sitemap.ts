import type { MetadataRoute } from 'next';
import {getManualCases} from '@/lib/supabase';
const domain = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'https://ssg-sink.vercel.app');
const base = domain.replace(/\/$/, '');

const areas = [
  'busan',
  'busan-jung', 'busan-seo', 'busan-dong', 'busan-yeongdo',
  'busan-busanjin', 'busan-dongnae', 'busan-nam', 'busan-buk',
  'busan-haeundae', 'busan-saha', 'busan-geumjeong', 'busan-gangseo',
  'busan-yeonje', 'busan-suyeong', 'busan-sasang', 'busan-gijang',
  'changwon',
  'masan',
  'jinhae',
  'gimhae', 'yangsan', 'jinju', 'sacheon',
  'geoje', 'tongyeong', 'goseong', 'miryang',
  'haman', 'changnyeong', 'gyeongnam'
];
export default async function sitemap():Promise<MetadataRoute.Sitemap> {
  const manual = await getManualCases();
  // Static pages do not have a trustworthy last-modified timestamp at request time.
  return [
    {url:base,changeFrequency:'weekly',priority:1},
    {url:`${base}/about/`,changeFrequency:'monthly',priority:.7},
    {url:`${base}/services/`,changeFrequency:'monthly',priority:.9},
    {url:`${base}/cases/`,changeFrequency:'weekly',priority:.9},
    {url:`${base}/contact/`,changeFrequency:'monthly',priority:.8},
    ...manual.map(item=>({url:`${base}/cases/${item.slug}/`,lastModified:new Date(item.created_at),changeFrequency:'monthly' as const,priority:.6})),
    ...areas.map(slug=>({url:`${base}/areas/${slug}/`,changeFrequency:'monthly' as const,priority:.7}))
  ];
}
