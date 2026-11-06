'use client';
import {smsHref} from '@/lib/contact';
import {useState} from 'react';
import type {CasePost} from '@/lib/supabase';
import type {BlogPost} from '@/lib/blog';
import CaseActions from '@/components/CaseActions';
import CaseRegionLinks from '@/components/CaseRegionLinks';
const PAGE_SIZE=8;
function Pagination({count,page,onChange,label}:{count:number;page:number;onChange:(page:number)=>void;label:string}){
 const total=Math.ceil(count/PAGE_SIZE);
 if(total<=1)return null;
 return <nav className="cases-ref-pagination" aria-label={label+' 페이지 이동'}>
  <button type="button" disabled={page===1} onClick={()=>onChange(page-1)}>‹</button>
  {Array.from({length:total},(_,i)=><button type="button" key={i} className={page===i+1?'active':''} aria-current={page===i+1?'page':undefined} onClick={()=>onChange(i+1)}>{i+1}</button>)}
  <button type="button" disabled={page===total} onClick={()=>onChange(page+1)}>›</button>
 </nav>;
}
export default function CasesGallery({cases,blogs}:{cases:CasePost[];blogs:BlogPost[]}){
 const [casePage,setCasePage]=useState(1);
 const [blogPage,setBlogPage]=useState(1);
 const shownCases=cases.slice((casePage-1)*PAGE_SIZE,casePage*PAGE_SIZE);
 const shownBlogs=blogs.slice((blogPage-1)*PAGE_SIZE,blogPage*PAGE_SIZE);
 return <div className="cases-ref">
  <section className="cases-ref-hero"><div className="cases-ref-hero-shade"><div className="wrap cases-ref-hero-inner"><span>PROJECT CASE</span><h1>시공<em>사례</em></h1><p>신세계싱크가 부산·경남 곳곳에서<br/>진행한 실제 싱크볼 교체 시공 사례입니다.</p></div></div></section>
  <section className="cases-ref-benefits"><div className="wrap">{[['▣','실제 시공 사진'],['⚒','다양한 시공 사례'],['⌖','부산·경남 전지역 시공'],['✓','꼼꼼한 시공 품질']].map(([icon,title])=><div key={title}><span>{icon}</span><strong>{title}</strong></div>)}</div></section>
  <section className="cases-ref-content"><div className="wrap">
   <section className="cases-ref-section" aria-labelledby="case-list-heading">
    <header className="cases-ref-section-heading"><div><span className="cases-ref-section-eyebrow">INSTALLATION CASES</span><h2 id="case-list-heading">⚒ 시공 사례</h2><p>신세계싱크가 직접 시공한 싱크볼 교체 사례를 확인하세요.</p></div><CaseActions/></header>
    <div className="cases-ref-grid">{shownCases.map(item=><article className="cases-ref-card" key={item.id}>
     <div className="cases-ref-photo"><a href={'/cases/'+item.slug+'/'} className="cases-ref-photo-link" aria-label={item.title+' 시공 사례 보기'}>{item.after_url?<img src={item.after_url} alt={item.title+' 시공 후 사진'} loading="lazy"/>:<div className="cases-ref-photo-empty">시공 사진 준비 중</div>}</a><CaseRegionLinks region={item.region} overlay/></div>
     <div className="cases-ref-card-body"><h3>{item.title}</h3><p>{item.description}</p><a className="cases-ref-detail" href={'/cases/'+item.slug+'/'}>자세히 보기 ›</a><CaseActions caseId={item.id}/></div>
    </article>)}</div>
    {cases.length===0&&<div className="cases-ref-empty">등록된 시공 사례가 아직 없습니다.</div>}
    <Pagination count={cases.length} page={casePage} onChange={setCasePage} label="시공 사례"/>
   </section>
   <section className="cases-ref-section cases-ref-blog-section" aria-labelledby="blog-list-heading">
    <header className="cases-ref-section-heading"><div><span className="cases-ref-section-eyebrow">NAVER BLOG REVIEWS</span><h2 id="blog-list-heading"><span className="cases-ref-naver" aria-label="네이버">N</span> 블로그 후기</h2><p>네이버 블로그에 등록된 실제 시공 후기를 만나보세요.</p></div></header>
    <div className="cases-ref-grid">{shownBlogs.map(item=><article className="cases-ref-card" key={item.id}>
     <a href={item.link} target="_blank" rel="noopener noreferrer" className="cases-ref-photo cases-ref-blog-photo">{item.image?<img src={"/api/blog-image?url="+encodeURIComponent(item.image)} alt={item.title} loading="lazy" referrerPolicy="no-referrer" onError={e=>{e.currentTarget.style.display="none";e.currentTarget.parentElement?.classList.add("cases-ref-photo-fallback")}}/>:<div className="cases-ref-photo-empty">신세계싱크 블로그 후기</div>}</a>
     <div className="cases-ref-card-body"><h3>{item.title}</h3><p>{item.description}</p><a className="cases-ref-detail" href={item.link} target="_blank" rel="noopener noreferrer">자세히 보기 ↗</a></div>
    </article>)}</div>
    {blogs.length===0&&<div className="cases-ref-empty">블로그 후기를 불러오지 못했습니다.<p><a href="https://blog.naver.com/ssg-sink" target="_blank" rel="noopener noreferrer">신세계싱크 네이버 블로그 바로가기 ↗</a></p></div>}
    <Pagination count={blogs.length} page={blogPage} onChange={setBlogPage} label="블로그 후기"/>
   </section>
  </div></section>
  <section className="cases-ref-contact"><div className="wrap cases-ref-contact-inner"><div><h2>싱크볼 교체가 필요하신가요?</h2><p>지금 바로 신세계싱크에 상담해 주세요!<br/>친절하고 정확하게 안내해 드리겠습니다.</p></div><div><a href="tel:01055043858">☎ 전화 상담하기</a><a href={smsHref}>✉ 문자 상담하기</a></div></div></section>
 </div>;
}
