import type {Metadata} from 'next';
import {getBlogPosts} from '@/lib/blog';
import {getManualCases} from '@/lib/supabase';
import CasesGallery from '@/components/CasesGallery';
export const revalidate=60;
export const metadata:Metadata={title:'싱크볼 교체 시공 사례 | 신세계싱크',description:'부산·경남 신세계싱크의 실제 싱크볼 교체 시공 후 사진과 네이버 블로그 후기를 확인하세요.',alternates:{canonical:'/cases/'}};
export default async function Cases(){const [blog,manual]=await Promise.all([getBlogPosts(),getManualCases()]);return <CasesGallery cases={manual} blogs={blog}/>;}
