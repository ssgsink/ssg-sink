'use client';
import {useMemo,useState} from 'react';
import type {CasePost} from '@/lib/supabase';
import type {BlogPost} from '@/lib/blog';
import CaseActions from '@/components/CaseActions';
const PAGE_SIZE=8;
export default function CasesGallery({cases,blogs}:{cases:CasePost[];blogs:BlogPost[]}){
 const [tab,setTab]=useState<'cases'|'blog'>('cases');
 const [region,setRegion]=useState('전체 지역');
 const [kind,setKind]=useState('전체 시공 유형');
 const [query,setQuery]=useState('');
 const [search,setSearch]=useState('');
 const [page,setPage]=useState(1);
 const regions=useMemo(()=>['전체 지역',...Array.from(new Set(cases.map(x=>x.region.trim()).filter(Boolean)))], [cases]);
 const filtered=useMemo(()=>cases.filter(x=>{
  const combined=(x.title+' '+x.description+' '+x.region).toLowerCase();
  const matchRegion=region==='전체 지역'||x.region===region;
  const matchKind=kind==='전체 시공 유형'||combined.includes(kind==='사각 싱크볼'?'사각':kind==='언더 싱크볼'?'언더':kind==='누수·수리'?'누수':'교체');
  return matchRegion&&matchKind&&combined.includes(search.trim().toLowerCase());
 }),[cases,region,kind,search]);
 const list=tab==='cases'?filtered:blogs.filter(x=>(x.title+' '+x.description).toLowerCase().includes(search.trim().toLowerCase()));
 const pageCount=Math.max(1,Math.ceil(list.length/PAGE_SIZE));
 const shown=list.slice((page-1)*PAGE_SIZE,page*PAGE_SIZE);
 const reset=()=>{setPage(1);setSearch('');setQuery('')};
 const smsHref='sms:01055043858?body='+encodeURIComponent('[싱크볼 교체 상담]\\n지역:\\n상담 내용:');
 return <div className="cases-ref">
  <section className="cases-ref-hero"><div className="cases-ref-hero-shade"><div className="wrap cases-ref-hero-inner"><span>PROJECT CASE</span><h1>시공<em>사례</em></h1><p>신세계싱크가 부산·경남 곳곳에서<br/>진행한 실제 싱크볼 교체 시공 사례입니다.</p></div></div></section>
  <section className="cases-ref-benefits"><div className="wrap">{[['▣','실제 시공 사진'],['⚒','다양한 시공 사례'],['⌖','부산·경남 전지역 시공'],['✓','꼼꼼한 시공 품질']].map(([icon,title])=><div key={title}><span>{icon}</span><strong>{title}</strong></div>)}</div></section>
  <section className="cases-ref-content"><div className="wrap">
   <div className="cases-ref-tabs" role="tablist" aria-label="시공 사례 및 블로그 후기">
    <button type="button" role="tab" aria-selected={tab==='cases'} className={tab==='cases'?'active':''} onClick={()=>{setTab('cases');reset()}}>⚒ &nbsp; 시공 사례</button>
    <button type="button" role="tab" aria-selected={tab==='blog'} className={tab==='blog'?'active':''} onClick={()=>{setTab('blog');reset()}}><span className="cases-ref-naver" aria-label="네이버">N</span> &nbsp; 블로그 후기</button>
   </div>
   <form className="cases-ref-search" onSubmit={e=>{e.preventDefault();setSearch(query);setPage(1)}}>
    <strong>⌕ &nbsp; {tab==='cases'?'시공 사례 검색':'블로그 후기 검색'}</strong>
    {tab==='cases'&&<><select aria-label="지역 선택" value={region} onChange={e=>{setRegion(e.target.value);setPage(1)}}>{regions.map(r=><option key={r}>{r}</option>)}</select>
    <select aria-label="시공 유형 선택" value={kind} onChange={e=>{setKind(e.target.value);setPage(1)}}>{['전체 시공 유형','사각 싱크볼','언더 싱크볼','누수·수리'].map(k=><option key={k}>{k}</option>)}</select></>}
    <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="아파트명, 지역명, 제품명 등을 입력하세요." aria-label="검색어"/>
    <button type="submit">⌕ 검색</button>
   </form>
   <CaseActions/>
   <div className="cases-ref-grid">{tab==='cases'? (shown as CasePost[]).map(item=><article className="cases-ref-card" key={item.id}>
     <a href={'/cases/'+item.slug+'/'} className="cases-ref-photo">{item.after_url?<img src={item.after_url} alt={item.title+' 시공 후 사진'} loading="lazy"/>:<div className="cases-ref-photo-empty">시공 사진 준비 중</div>}<span>{item.region}</span></a>
     <div className="cases-ref-card-body"><h3>{item.title}</h3><p>{item.description}</p><a className="cases-ref-detail" href={'/cases/'+item.slug+'/'}>자세히 보기 ›</a><CaseActions caseId={item.id}/></div>
    </article>):(shown as BlogPost[]).map(item=><article className="cases-ref-card" key={item.id}>
     <a href={item.link} target="_blank" rel="noopener noreferrer" className="cases-ref-photo">{item.image?<img src={item.image} alt={item.title} loading="lazy"/>:<div className="cases-ref-photo-empty">신세계싱크 블로그 후기</div>}<span>블로그 후기</span></a>
     <div className="cases-ref-card-body"><h3>{item.title}</h3><p>{item.description}</p><a className="cases-ref-detail" href={item.link} target="_blank" rel="noopener noreferrer">자세히 보기 ↗</a></div>
    </article>)}</div>
   {list.length===0&&<div className="cases-ref-empty">{tab==='cases'?'검색 조건에 맞는 시공 사례가 없습니다.':'블로그 후기를 불러오지 못했거나 검색 결과가 없습니다.'}{tab==='blog'&&<p><a href="https://blog.naver.com/ssg-sink" target="_blank" rel="noopener noreferrer">신세계싱크 네이버 블로그 바로가기 ↗</a></p>}</div>}
   {pageCount>1&&<nav className="cases-ref-pagination" aria-label="페이지 이동"><button disabled={page===1} onClick={()=>setPage(Math.max(1,page-1))}>‹</button>{Array.from({length:pageCount},(_,i)=><button key={i} className={page===i+1?'active':''} aria-current={page===i+1?'page':undefined} onClick={()=>setPage(i+1)}>{i+1}</button>)}<button disabled={page===pageCount} onClick={()=>setPage(Math.min(pageCount,page+1))}>›</button></nav>}
  </div></section>
  <section className="cases-ref-contact"><div className="wrap cases-ref-contact-inner"><div><h2>싱크볼 교체가 필요하신가요?</h2><p>지금 바로 신세계싱크에 상담해 주세요!<br/>친절하고 정확하게 안내해 드리겠습니다.</p></div><div><a href="tel:01055043858">☎ 전화 상담하기</a><a href={smsHref}>✉ 문자 상담하기</a></div></div></section>
 </div>;
}
