const smsBody = "[싱크볼 교체 상담]\n*싱크볼 전체 사진과 하부장 내부 사진과 아래 정보를 보내주시면 감사하겠습니다.\n\n거주 지역(시 · 동):\n싱크볼 가로 · 세로 크기(mm):\n상담 내용:";
export default function MobileContactBar(){
 return <aside className="mobile-contact-bar" aria-label="빠른 상담">
  <a href="tel:01055043858" className="mobile-contact-call" aria-label="신세계싱크 전화 상담">☎ 전화 상담</a>
  <a href={`sms:01055043858?body=${encodeURIComponent(smsBody)}`} className="mobile-contact-sms" aria-label="신세계싱크 문자 상담 문자 앱 열기">✉ 문자 상담</a>
 </aside>;
}
