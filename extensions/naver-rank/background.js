chrome.action.onClicked.addListener(()=>chrome.tabs.create({url:'https://ssg-sink.vercel.app/admin/search-rank/'}));let busy=false;
chrome.runtime.onMessage.addListener((m,s,reply)=>{if(m.type!=='scan'||!s.url?.startsWith('https://ssg-sink.vercel.app/admin/search-rank/'))return;if(busy){reply({error:'다른 검색을 확인 중입니다.'});return;}busy=true;(async()=>{let tab;try{const prior=await chrome.storage.session.get('searchTabId');let previous=null;try{if(prior.searchTabId)previous=await chrome.tabs.get(prior.searchTabId);}catch{}const searchUrl='https://search.naver.com/search.naver?'+new URLSearchParams({...(m.mode==='blog'?{ssc:'tab.blog.all',where:'blog'}:{where:'nexearch'}),query:m.keyword});tab=previous?await chrome.tabs.update(previous.id,{url:searchUrl,active:true}):await chrome.tabs.create({url:searchUrl,active:true});await chrome.storage.session.set({searchTabId:tab.id});const wait=ms=>new Promise(r=>setTimeout(r,ms));let done=false;for(let i=0;i<40;i++){await wait(500);if((await chrome.tabs.get(tab.id)).status==='complete'){done=true;break;}}if(!done)throw Error('검색 페이지 로딩 시간 초과');await wait(1500);
if(m.mode==='web'){
 await chrome.scripting.executeScript({target:{tabId:tab.id},func:async()=>{
  const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  const start=Date.now();
  window.scrollTo(0,0);
  let settled=0;
  while(Date.now()-start<12000 && settled<3){
   const before=document.documentElement.scrollHeight;
   window.scrollBy(0,Math.max(640,window.innerHeight*0.85));
   await pause(220);
   const height=document.documentElement.scrollHeight;
   settled=window.scrollY+window.innerHeight>=height-8 && height===before?settled+1:0;
  }
  window.scrollTo(0,0);
  await pause(350);
 }});
}
await chrome.scripting.executeScript({target:{tabId:tab.id},files:['scanner.js']});let out,signature;for(let attempt=0;attempt<5;attempt++){[out]=await chrome.scripting.executeScript({target:{tabId:tab.id},args:[m.keyword,m.mode],func:(keyword,mode)=>{if(new URL(location.href).searchParams.get('query')!==keyword)return {error:'검색어 전환 대기 중'};if(mode==='blog'&&!document.querySelector('a[data-heatmap-target=".nblg"], a.title_link, a.total_tit, a.api_txt_lines.total_tit'))return {error:'블로그 검색 결과 확인 필요'};return scanResults('https://ssg-sink.vercel.app/','ssg-sink')}});if(/보안/.test(out.result?.error||''))break;const current=JSON.stringify(out.result);if(!out.result?.error&&current===signature)break;signature=current;await wait(1500);}reply({...out.result,searchUrl:tab.url});}catch(e){reply({error:e.message||String(e)});}finally{busy=false;}})();return true;});
