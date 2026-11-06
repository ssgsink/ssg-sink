const areaSlugs:Record<string,string>={'부산':'busan','부산 중구':'busan-jung','부산 서구':'busan-seo','부산 동구':'busan-dong','부산 영도구':'busan-yeongdo','부산 부산진구':'busan-busanjin','부산 동래구':'busan-dongnae','부산 남구':'busan-nam','부산 북구':'busan-buk','부산 해운대구':'busan-haeundae','부산 사하구':'busan-saha','부산 금정구':'busan-geumjeong','부산 강서구':'busan-gangseo','부산 연제구':'busan-yeonje','부산 수영구':'busan-suyeong','부산 사상구':'busan-sasang','부산 기장군':'busan-gijang','창원':'changwon','마산':'masan','진해':'jinhae','김해':'gimhae','양산':'yangsan','진주':'jinju','사천':'sacheon','거제':'geoje','통영':'tongyeong','고성':'goseong','밀양':'miryang','함안':'haman','창녕':'changnyeong','경남':'gyeongnam','기타 지역':'gyeongnam'};
export function splitRegions(region:string):string[]{return Array.from(new Set((region||'').split(/[,，、/|]+/).map(v=>v.trim()).filter(Boolean)))}
export default function CaseRegionLinks({region,overlay=false}:{region:string;overlay?:boolean}){
 const names=splitRegions(region);
 if(!names.length)return null;
 return <div className={overlay?"case-region-links case-region-overlay":"case-region-links"} aria-label="관련 지역 안내">{names.map(name=>{const slug=areaSlugs[name];return slug?<a key={name} href={'/areas/'+slug+'/'} title={name+' 싱크볼 교체 지역 안내'}>{name}</a>:<span key={name}>{name}</span>})}</div>;
}
