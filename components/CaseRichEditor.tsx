'use client';
import {useRef,type ClipboardEvent} from 'react';
import {sanitizeCaseDetails} from '@/lib/case-rich-text';
export default function CaseRichEditor({value,onChange}:{value:string;onChange:(value:string)=>void}){
 const ref=useRef<HTMLDivElement|null>(null);
 const initialized=useRef(false);
 const setEditor=(node:HTMLDivElement|null)=>{
  ref.current=node;
  if(node&&!initialized.current){node.innerHTML=sanitizeCaseDetails(value);initialized.current=true}
 };
 const emit=()=>{if(ref.current)onChange('<!-- rich-case -->'+ref.current.innerHTML)};
 const paste=(event:ClipboardEvent<HTMLDivElement>)=>{
  event.preventDefault();
  const html=event.clipboardData.getData('text/html');
  const plain=event.clipboardData.getData('text/plain');
  const selection=window.getSelection();
  if(!selection?.rangeCount||!ref.current)return;
  const range=selection.getRangeAt(0);
  if(!ref.current.contains(range.commonAncestorContainer))return;
  const fragment=document.createDocumentFragment();
  if(html){
   // Keep common rich-text formatting but strip scripts, event handlers and unsafe attributes.
   const source=new DOMParser().parseFromString(html,'text/html');
   const allowed=new Set(['P','DIV','BR','STRONG','B','EM','I','U','UL','OL','LI','SPAN','FONT','H2','H3','H1']);
   const walk=(node:Node,parent:Node)=>{
    if(node.nodeType===Node.TEXT_NODE){parent.appendChild(document.createTextNode(node.textContent||''));return}
    if(node.nodeType!==Node.ELEMENT_NODE)return;
    const el=node as HTMLElement;
    if(['SCRIPT','STYLE','IFRAME','OBJECT','SVG','IMG','VIDEO','AUDIO'].includes(el.tagName))return;
    const name=allowed.has(el.tagName)?el.tagName.toLowerCase():null;
    const dest=name?document.createElement(name==='h1'?'h2':name):parent;
    if(name){
     const styles=['color','background-color','font-size','text-align'];
     for(const prop of styles){const value=el.style.getPropertyValue(prop);if(value)(dest as HTMLElement).style.setProperty(prop,value)}
     if(name==='font'){const font=dest as HTMLElement;const color=el.getAttribute('color');if(color)font.style.color=color;const size=el.getAttribute('size');if(size)font.setAttribute('size',size)}
     parent.appendChild(dest);
    }
    for(const child of Array.from(node.childNodes))walk(child,dest);
   };
   for(const node of Array.from(source.body.childNodes))walk(node,fragment);
   // Re-parse through the same server-side allowlist used for public display.
   const staging=document.createElement('div');staging.appendChild(fragment);
   const safe=document.createElement('div');safe.innerHTML=sanitizeCaseDetails('<!-- rich-case -->'+staging.innerHTML);
   while(safe.firstChild)fragment.appendChild(safe.firstChild);
  }else if(plain){
   const lines=plain.replace(/\r\n?/g,'\n').split('\n');
   lines.forEach((line,index)=>{
    if(index)fragment.appendChild(document.createElement('br'));
    const heading=line.match(/^#{1,3}\s+(.+)$/);
    if(heading){const el=document.createElement('strong');el.textContent=heading[1];el.style.fontSize='22px';fragment.appendChild(el)}
    else{
     const pieces=line.split(/(\*\*[^*]+\*\*)/g);
     for(const piece of pieces){
      if(piece.startsWith('**')&&piece.endsWith('**')){const strong=document.createElement('strong');strong.textContent=piece.slice(2,-2);fragment.appendChild(strong)}
      else fragment.appendChild(document.createTextNode(piece));
     }
    }
   });
  }
  if(!fragment.hasChildNodes())return;
  range.deleteContents();
  const tail=fragment.lastChild;
  range.insertNode(fragment);
  if(tail){range.setStartAfter(tail);range.collapse(true);selection.removeAllRanges();selection.addRange(range)}
  rememberSelection();emit();
 };
 const selection=useRef<Range|null>(null);
 const rememberSelection=()=>{const sel=window.getSelection();if(sel&&sel.rangeCount&&ref.current?.contains(sel.anchorNode))selection.current=sel.getRangeAt(0).cloneRange()};
 const apply=(command:string,argument?:string)=>{
  ref.current?.focus();
  if(selection.current){const sel=window.getSelection();sel?.removeAllRanges();sel?.addRange(selection.current)}
  document.execCommand(command,false,argument);
  rememberSelection();
  emit();
 };
 return <div className="case-rich-editor">
  <div className="case-rich-toolbar" role="toolbar" aria-label="시공 설명 글자 꾸미기" onMouseDown={e=>{if((e.target as HTMLElement).closest('button'))e.preventDefault()}}>
   <button type="button" title="굵게" onClick={()=>apply('bold')}><strong>굵게</strong></button>
   <button type="button" title="기울임" onClick={()=>apply('italic')}><em>기울임</em></button>
   <button type="button" title="밑줄" onClick={()=>apply('underline')}><u>밑줄</u></button>
   <select aria-label="글자 크기" defaultValue="" onChange={e=>{if(e.target.value)apply('fontSize',e.target.value);e.target.value=''}}>
    <option value="">글자 크기</option><option value="2">작게</option><option value="3">보통</option><option value="4">조금 크게</option><option value="5">크게</option><option value="6">아주 크게</option>
   </select>
   <select aria-label="글자 색상" defaultValue="" onChange={e=>{if(e.target.value)apply('foreColor',e.target.value);e.target.value=''}}>
    <option value="">글자 색</option><option value="#252722">기본 검정</option><option value="#a17a36">골드</option><option value="#b42318">빨강</option><option value="#146b46">초록</option><option value="#2257a5">파랑</option>
   </select>
   <button type="button" onClick={()=>apply('hiliteColor','#fff3b0')}>형광펜</button>
   <button type="button" onClick={()=>apply('justifyLeft')}>왼쪽</button>
   <button type="button" onClick={()=>apply('justifyCenter')}>가운데</button>
   <button type="button" onClick={()=>apply('insertUnorderedList')}>목록</button>
  </div>
  <div ref={setEditor} className="case-rich-input" contentEditable suppressContentEditableWarning role="textbox" aria-multiline="true" aria-label="상세 시공 설명 작성" data-placeholder="시공 전 상태, 교체 작업 과정, 설치 후 달라진 점 등을 작성해 주세요." onPaste={paste} onMouseUp={rememberSelection} onKeyUp={rememberSelection} onInput={emit}/>
  <p className="case-rich-help">꾸밀 글자를 드래그한 뒤 위 도구를 누르세요. 작성한 모양이 고객용 상세 페이지에도 표시됩니다.</p>
 </div>
}
