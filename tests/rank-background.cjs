const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
let handler;
const state={},tabs=new Map([[1,{id:1,windowId:5,url:'https://ssg-sink.vercel.app/admin/search-rank/'}],[2,{id:2,url:'https://search.naver.com/user-tab'}]]);
const removed=[],updates=[],focused=[];
const chrome={
 action:{onClicked:{addListener(){}}},
 runtime:{onMessage:{addListener(fn){handler=fn;}}},
 storage:{session:{
  async get(){return {...state}},async set(data){Object.assign(state,data)},async remove(keys){for(const k of keys)delete state[k]}
 }},
 tabs:{
  async create(data){const t={...data,id:3,windowId:5,status:'complete'};tabs.set(3,t);return t;},
  async get(id){if(!tabs.has(id))throw Error('missing tab');return tabs.get(id);},
  async update(id,data){updates.push([id,data]);Object.assign(tabs.get(id),data);return tabs.get(id);},
  async remove(id){removed.push(id);tabs.delete(id);}
 },
 windows:{async update(id,data){focused.push([id,data]);}},
 scripting:{async executeScript(args){return args.args?[{result:{count:20,targets:[{type:'블로그',hits:[{rank:14,url:'https://blog.naver.com/ssg-sink/123',title:'제목'}]}]}}]:[];}}
};
vm.runInNewContext(fs.readFileSync('extensions/naver-rank/background.js','utf8'),{chrome,URL,URLSearchParams,setTimeout:fn=>setTimeout(fn,0)});
const sender={url:tabs.get(1).url,tab:{id:1,windowId:5}};
const send=(m,s=sender)=>new Promise(resolve=>{handler(m,s,resolve);});
(async()=>{
 assert.equal((await send({type:'ping'})).version,'1.2.3');
 const result=await send({type:'scan',keyword:'양산 싱크볼 교체',mode:'blog'});
 assert.equal(result.targets[0].hits[0].rank,14);
 assert.equal(state.ownerTabId,1);
 await send({type:'finish'},{...sender,tab:{id:9,windowId:5}});
 assert.equal(removed.length,0);
 await send({type:'finish'});
 assert.deepEqual(removed,[3]);
 assert.ok(tabs.has(2));assert.ok(updates.some(([id,data])=>id===1&&data.active));
 assert.equal(focused[0][0],5);assert.equal(state.searchTabId,undefined);
 console.log('PASS: worker handshake, blog scan, owned tab cleanup, dashboard focus, unrelated tabs preserved');
})().catch(e=>{console.error(e);process.exitCode=1});
