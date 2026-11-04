import {smsHref} from '@/lib/contact';
export default function MobileContactBar(){
 return <aside className="mobile-contact-bar" aria-label="빠른 상담">
  <a href="tel:01055043858" className="mobile-contact-call" aria-label="신세계싱크 전화 상담">☎ 전화 상담</a>
  <a href={smsHref} className="mobile-contact-sms" aria-label="신세계싱크 문자 상담 문자 앱 열기">✉ 문자 상담</a>
 </aside>;
}
