const VERSION='1.2.3';
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
let busy=false;
chrome.action.onClicked.addListener(()=>chrome.tabs.create({url:'https://ssg-sink.vercel.app/admin/search-rank/'}));
function authorized(sender){
 try{const u=new URL(sender.url);return u.origin==='https://ssg-sink.vercel.app'&&u.pathname.replace(/\/$/,'')==='/admin/search-rank';}catch{return false;}
}
chrome.runtime.onMessage.addListener((m,s,reply)=>{
 if(!authorized(s))return;
 if(m.type==='ping'){reply({version:VERSION});return;}
 if(m.type==='finish'){
  (async()=>{
   try{
    const state=await chrome.storage.session.get(['searchTabId','ownerTabId']);
    if(state.ownerTabId!==s.tab?.id){reply({});return;}
    if(state.searchTabId&&state.searchTabId!==s.tab.id){
     try{const tab=await chrome.tabs.get(state.searchTabId);if(tab.url?.startsWith('https://search.naver.com/'))await chrome.tabs.remove(state.searchTabId);}catch{}
    }
    await chrome.storage.session.remove(['searchTabId','ownerTabId']);
    await chrome.tabs.update(s.tab.id,{active:true});
    await chrome.windows.update(s.tab.windowId,{focused:true});
    reply({finished:true});
   }catch(e){reply({error:e.message});}
  })();return true;
 }
 if(m.type!=='scan'||typeof m.keyword!=='string'||m.keyword.length>150||!['web','blog'].includes(m.mode))return;
 if(busy){reply({error:'다른 검색을 확인 중입니다. 잠시 후 다시 시작하세요.'});return;}
 busy=true;
 (async()=>{
  try{
   const state=await chrome.storage.session.get(['searchTabId','ownerTabId']);
   let previous=null;
   if(state.ownerTabId===s.tab?.id&&state.searchTabId)try{const t=await chrome.tabs.get(state.searchTabId);if(t.url?.startsWith('https://search.naver.com/'))previous=t;}catch{}
   const searchUrl='https://search.naver.com/search.naver?'+new URLSearchParams({...(m.mode==='blog'?{ssc:'tab.blog.all',where:'blog'}:{where:'nexearch'}),query:m.keyword});
   const tab=previous?await chrome.tabs.update(previous.id,{url:searchUrl,active:true}):await chrome.tabs.create({url:searchUrl,active:true});
   await chrome.storage.session.set({searchTabId:tab.id,ownerTabId:s.tab.id});
   let loaded=false;
   for(let i=0;i<40;i++){await wait(500);const current=await chrome.tabs.get(tab.id);if(current.status==='complete'){loaded=true;break;}}
   if(!loaded)throw Error('검색 페이지 로딩 시간 초과');
   await wait(800);
   if(m.mode==='web')await chrome.scripting.executeScript({target:{tabId:tab.id},func:async()=>{
    const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms)),start=Date.now();
    window.scrollTo(0,0);let settled=0;
    while(Date.now()-start<12000&&settled<3){
     const before=document.documentElement.scrollHeight;
     window.scrollBy(0,Math.max(640,window.innerHeight*0.85));await pause(220);
     const height=document.documentElement.scrollHeight;
     settled=window.scrollY+window.innerHeight>=height-8&&height===before?settled+1:0;
    }
    window.scrollTo(0,0);await pause(350);
   }});
   let result={error:'검색 결과를 읽지 못했습니다.'},signature;
   for(let attempt=0;attempt<5;attempt++){
    // Reinject after navigation settles; a late navigation can clear earlier scripts.
    await chrome.scripting.executeScript({target:{tabId:tab.id},files:['scanner.js']});
    const [out]=await chrome.scripting.executeScript({target:{tabId:tab.id},args:[m.keyword],func:keyword=>{
     if(new URL(location.href).searchParams.get('query')?.trim()!==keyword.trim())return {error:'검색어 전환 대기 중'};
     if(typeof scanResults!=='function')return {error:'검색 분석기 연결 실패'};
     return scanResults('https://ssg-sink.vercel.app/','ssg-sink');
    }});
    result=out?.result||{error:'검색 결과 응답이 없습니다.'};
    if(/보안/.test(result.error||''))break;
    const current=JSON.stringify(result);
    if(!result.error&&current===signature)break;
    signature=current;if(attempt<4)await wait(1000);
   }
   reply({...result,searchUrl});
  }catch(e){reply({error:e.message||String(e)});}finally{busy=false;}
 })();return true;
});
