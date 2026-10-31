import type { MetadataRoute } from 'next';
const domain = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'https://shinsegae-sink.vercel.app');
const base = domain.replace(/\/$/, '');
export default function robots():MetadataRoute.Robots {
  return {rules:{userAgent:'*',allow:'/'},sitemap:`${base}/sitemap.xml`};
}
