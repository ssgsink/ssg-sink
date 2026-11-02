'use client';
import {useRef} from 'react';
import {sanitizeCaseDetails} from '@/lib/case-rich-text';
export default function CaseRichEditor({value,onChange}:{value:string;onChange:(value:string)=>void}){
 const ref=useRef<HTMLDivElement|null>(null);
 const initial=useRef(sanitizeCaseDetails(value));
 const selection=useRef<Range|null>(null);
 const rememberSelection=()=>{const sel=window.getSelection();if(sel&&sel.rangeCount&&ref.current?.contains(sel.anchorNode))selection.current=sel.getRangeAt(0).cloneRange()};
 const apply=(command:string,argument?:string)=>{
  ref.current?.focus();
  if(selection.current){const sel=window.getSelection();sel?.removeAllRanges();sel?.addRange(selection.current)}
  document.execCommand(command,false,argument);
  rememberSelection();
  if(ref.current)onChange('<!-- rich-case -->'+ref.current.innerHTML);
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
  <div ref={ref} className="case-rich-input" contentEditable suppressContentEditableWarning role="textbox" aria-multiline="true" aria-label="상세 시공 설명 작성" data-placeholder="시공 전 상태, 교체 작업 과정, 설치 후 달라진 점 등을 작성해 주세요." dangerouslySetInnerHTML={{__html:initial.current}} onMouseUp={rememberSelection} onKeyUp={rememberSelection} onInput={e=>onChange('<!-- rich-case -->'+e.currentTarget.innerHTML)}/>
  <p className="case-rich-help">꾸밀 글자를 드래그한 뒤 위 도구를 누르세요. 작성한 모양이 고객용 상세 페이지에도 표시됩니다.</p>
 </div>
}
