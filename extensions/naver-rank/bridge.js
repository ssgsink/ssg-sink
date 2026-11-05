window.addEventListener('message',async e=>{
 if(e.source!==window||e.origin!==location.origin||e.data?.source!=='ssg-rank-page')return;
 const {id,type,keyword,mode}=e.data;
 if(!['ping','scan','finish'].includes(type))return;
 if(type==='scan'&&(typeof keyword!=='string'||keyword.length>150))return;
 try{
  const result=await chrome.runtime.sendMessage({type,keyword,mode});
  window.postMessage({source:'ssg-rank-extension',id,result:result||{error:'연결 응답 없음. 확장 프로그램을 다시 로드하고 페이지를 새로고침하세요.'}},location.origin);
 }catch(err){
  window.postMessage({source:'ssg-rank-extension',id,result:{error:'확장 프로그램 연결 오류. 확장 프로그램을 다시 로드한 뒤 관리자 페이지를 새로고침하세요. '+String(err)}},location.origin);
 }
});
