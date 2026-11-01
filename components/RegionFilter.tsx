'use client';
import {useState} from 'react';
import type {CasePost} from '@/lib/supabase';
import CaseActions from '@/components/CaseActions';
export default function RegionFilter({items}:{items:CasePost[]}){
 const [region,setRegion]=useState('전체');
 const regions=['전체',...Array.from(new Set(items.map(x=>x.region.replace(/^경남\s*/,'').replace(/^부산시?\s*/,'부산 ').trim().split(/\s|·/)[0]).filter(Boolean)))];
 const visible=region==='전체'?items:items.filter(x=>x.region.includes(region));
 return <div><div style={{display:'flex',gap:8,flexWrap:'wrap',margin:'16px 0 24px'}}>{regions.map(x=><button type='button' key={x} onClick={()=>setRegion(x)} aria-pressed={region===x} style={{padding:'8px 14px',borderRadius:20,border:'1px solid #b69b68',background:region===x?'#b69b68':'transparent',color:region===x?'#111':'inherit',cursor:'pointer'}}>{x}</button>)}</div><div className='case-grid'>{visible.map(item=><article className='case-card' key={item.id}><a href={'/cases/'+item.slug+'/'}><div className='case-pair'>{item.before_url&&<img src={item.before_url} alt={item.title+' 교체 전'}/>} {item.after_url&&<img src={item.after_url} alt={item.title+' 교체 후'}/>}</div><div className='case-copy'><strong>{item.title}</strong><p>{item.region} · {item.description}</p></div></a><CaseActions caseId={item.id}/></article>)}</div>{visible.length===0&&<p>해당 지역에 등록된 사례가 없습니다.</p>}</div>;
}
