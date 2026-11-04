function scanResults(site, blog) {
 const visible=e=>!!(e.getClientRects().length)&&getComputedStyle(e).visibility!=='hidden';
 if(document.querySelector('iframe[src*="captcha"], input[name*="captcha"]')||/자동입력 방지|비정상적인 접근|보안 확인/.test(document.title))return {error:'보안 확인 화면: 직접 확인 후 다시 시작하세요.'};
 const root=document.querySelector('#main_pack')||document.querySelector('main');
 if(!root)return {error:'검색 결과 구조를 인식하지 못했습니다. 결과 페이지를 직접 확인하세요.'};
 const selectors='a.title_link, a.link_tit, a.api_txt_lines.total_tit, a.total_tit, a[class*="title_link"], a[class*="link_tit"], a[class*="title_link"], a[data-heatmap-target="title"], a[data-heatmap-target=".link"]:has(.sds-comps-text-ellipsis-1), a[data-heatmap-target=".nblg"]:has(.sds-comps-text-type-headline1)';
 const nodes=[...root.querySelectorAll(selectors)].filter(visible);
 const seen=new Set(),links=[];
 for(const a of nodes){let u;try{u=new URL(a.href);for(const key of ['url','u']){const v=u.searchParams.get(key);if(v&&/^https?:/.test(v)){u=new URL(v);break;}}}catch{continue;}
 if(!/^https?:$/.test(u.protocol)||u.hostname==='search.naver.com')continue;
 u.hash='';let key=u.href;if(u.hostname==='m.blog.naver.com')u.hostname='blog.naver.com';
 if(u.hostname==='blog.naver.com'){const b=u.searchParams.get('blogId'),n=u.searchParams.get('logNo');if(b&&n)u=new URL('https://blog.naver.com/'+b+'/'+n);key=u.href;}
 if(seen.has(key))continue;seen.add(key);links.push({url:u.href,title:a.innerText.replace(/새 창 열림/g,'').trim()});}
 if(!links.length)return {error:'결과 제목 링크를 인식하지 못했습니다. 미발견으로 판정하지 않았습니다.'};
 const host=new URL(site).hostname.toLowerCase();
 const match=(r,type)=>{const u=new URL(r.url);return type==='홈페이지'?u.hostname.toLowerCase()===host:(['blog.naver.com','m.blog.naver.com'].includes(u.hostname)&&((u.pathname.split('/')[1]||'').toLowerCase()===blog.toLowerCase()||u.searchParams.get('blogId')?.toLowerCase()===blog.toLowerCase()));};
 return {count:links.length,targets:['홈페이지','블로그'].map(type=>({type,hits:links.map((r,i)=>({...r,rank:i+1})).filter(r=>match(r,type))}))};
}