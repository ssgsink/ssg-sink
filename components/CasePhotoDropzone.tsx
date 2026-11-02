'use client';
import {useRef,useState,type DragEvent,type ChangeEvent} from 'react';
export default function CasePhotoDropzone({id,multiple,onFiles,resetKey}:{id:string;multiple?:boolean;onFiles:(files:File[])=>void;resetKey:number}){
 const [dragging,setDragging]=useState(false);
 const input=useRef<HTMLInputElement>(null);
 const receive=(files:File[])=>{if(files.length)onFiles(multiple?files:[files[0]])};
 const onDrop=(e:DragEvent<HTMLDivElement>)=>{
  e.preventDefault();e.stopPropagation();setDragging(false);
  receive(Array.from(e.dataTransfer.files));
 };
 const onChange=(e:ChangeEvent<HTMLInputElement>)=>{receive(Array.from(e.target.files||[]));e.target.value=''};
 return <div className={'case-photo-dropzone'+(dragging?' is-dragging':'')}
  onDragEnter={e=>{e.preventDefault();e.stopPropagation();setDragging(true)}}
  onDragOver={e=>{e.preventDefault();e.stopPropagation();e.dataTransfer.dropEffect='copy';setDragging(true)}}
  onDragLeave={e=>{e.preventDefault();e.stopPropagation();if(!e.currentTarget.contains(e.relatedTarget as Node))setDragging(false)}}
  onDrop={onDrop}>
  <input ref={input} id={id} key={resetKey} type="file" multiple={multiple} onChange={onChange} className="case-photo-file-input"/>
  <span className="case-photo-dropzone-icon" aria-hidden="true">＋</span>
  <strong>{multiple?'사진 여러 장을 여기에 끌어다 놓으세요':'대표 사진을 여기에 끌어다 놓으세요'}</strong>
  <span>또는 <button type="button" onClick={()=>input.current?.click()}>파일 선택</button>으로 추가</span>
  <small>JPG · PNG · WEBP · HEIC 지원 (사진 한 장당 10MB 이하)</small>
 </div>;
}
