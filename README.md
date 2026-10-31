# 신세계싱크 홈페이지

Next.js 15 App Router 기반의 정적 생성(SSG) 홈페이지입니다. Vercel 무료 Hobby 프로젝트로 배포할 수 있도록 구성했습니다. 개인·비상업적 용도의 Hobby 정책에 맞는지 확인한 뒤 운영하세요.

## 포함된 페이지
- `/` 메인
- `/about/` 업체 소개
- `/services/` 싱크볼 교체 안내
- `/cases/` 시공 사례 목록(실제 사례 자료 추가 전 안내 문구 포함)
- `/contact/` 전화·문자 상담
- `/areas/[지역]/` 부산, 창원, 마산, 진해, 김해, 양산, 진주, 거제, 통영, 밀양, 사천, 경남 지역 안내
- `/sitemap.xml`, `/robots.txt`

지역 페이지는 검색어만 나열하지 않도록 작성했으며, 실제 현장 사진·아파트/주택명(공개 가능한 범위)·제품명·규격·작업 전후 상태를 추가해 고유한 정보로 계속 보완해야 합니다. 실제로 수행하지 않은 시공 사례를 등록하지 마세요.

## 로컬 실행
1. Node.js 20 이상 설치
2. 프로젝트 폴더에서 `npm install`
3. `.env.example`을 복사해 `.env.local`로 만들고 주소를 설정
4. `npm run dev`
5. `http://localhost:3000` 접속

## Vercel 배포 (무료 주소로 시작)
1. GitHub 계정을 만들고 새 저장소 `shinsegae-sink`를 생성합니다.
2. ZIP 압축을 풀고 `shinsegae-sink-site` 폴더 안의 파일을 저장소 루트에 업로드합니다.
3. Vercel에 로그인하고 **Add New → Project → Import Git Repository**를 선택합니다.
4. Framework Preset은 **Next.js**로 자동 인식되는지 확인합니다.
5. 프로젝트 이름을 `shinsegae-sink`로 지정합니다. 이 이름이 사용 중이면 `shinsegae-sink-busan` 등으로 바꾸세요.
6. Build Command는 `npm run build` (기본값), Output Directory는 비워 두고 Deploy를 누릅니다.
7. 배포가 끝나면 Vercel이 실제 발급한 `https://프로젝트명.vercel.app` 주소를 확인합니다.
8. Vercel Project → Settings → Environment Variables에서 `NEXT_PUBLIC_SITE_URL`에 실제 발급 주소를 입력합니다. 저장 후 Redeploy 합니다.

`output: 'export'` 설정으로 주요 페이지가 정적 HTML로 생성됩니다. Vercel 배포 과정에서 별도 서버를 관리할 필요가 없습니다.

## 네이버·구글 검색 등록
1. 배포된 실제 주소를 네이버 서치어드바이저와 Google Search Console에 사이트로 등록합니다.
2. 네이버 HTML 메타태그 방식의 소유확인 코드를 복사합니다.
3. Vercel Project → Settings → Environment Variables에 `NEXT_PUBLIC_NAVER_SITE_VERIFICATION` 값을 추가하고 Redeploy 합니다.
4. 네이버 서치어드바이저에서 소유확인을 마친 뒤 `https://실제주소/sitemap.xml`을 제출합니다.
5. Google Search Console에서도 동일한 sitemap 주소를 제출합니다.
6. `https://실제주소/robots.txt`가 열리는지 확인합니다.

## 공개 전에 수정·확인할 항목
- 카카오톡 채널을 개설한 뒤 `/contact/`의 카카오톡 안내 영역을 실제 채널 링크 버튼으로 교체
- 임시 주방 이미지 `public/images/hero-kitchen.svg`, 공유 이미지 `public/og-image.png`를 실제 촬영 사진과 브랜드 이미지로 교체
- 시공 사례는 실제 시공 사진과 정확한 지역·제품·작업 내용을 받아 개별 페이지로 추가
- 상호·전화번호·출장 가능 지역·상담 가능 시간 등 사업 정보 최종 확인
- 네이버와 구글에서 색인 여부 확인. 사이트 등록이 검색 상위 노출을 보장하지는 않습니다.

## 상담 정보
현재 전화 및 문자 연결은 `010-5504-3858`로 설정되어 있습니다. 카카오톡은 채널 개설 전까지 연결 대기 상태입니다.
