import type { MetadataRoute } from 'next';
const domain = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'https://shinsegae-sink.vercel.app');
const base = domain.replace(/\/$/, '');
const areas=['busan','changwon','masan','jinhae','gimhae','yangsan','jinju','geoje','tongyeong','miryang','sacheon','gyeongnam'];
export default function sitemap():MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {url:base,lastModified:now,changeFrequency:'weekly',priority:1},
    {url:`${base}/about/`,lastModified:now,changeFrequency:'monthly',priority:.7},
    {url:`${base}/services/`,lastModified:now,changeFrequency:'monthly',priority:.9},
    {url:`${base}/cases/`,lastModified:now,changeFrequency:'weekly',priority:.9},
    {url:`${base}/contact/`,lastModified:now,changeFrequency:'monthly',priority:.8},
    ...areas.map(slug=>({url:`${base}/areas/${slug}/`,lastModified:now,changeFrequency:'monthly' as const,priority:.7}))
  ];
}
