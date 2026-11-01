-- Run ONCE in Supabase SQL Editor after setup.sql. Preserves the five existing photo pairs.
-- Existing static images remain served from /public/images/cases.
insert into public.case_posts(slug,title,description,region,before_url,after_url) values
('existing-case-01','마산 창원 진해- 오래된 주방 싱크볼 교체','경남 창원에서 기존 싱크볼을 철거하고 새 스테인리스 씽크볼로 교체한 사례입니다. 마산, 창원, 진해지역에서 싱크대볼 교체를 계획하신다면 가까이 신세계싱크가 있습니다.','경남 창원','/images/cases/case-01-before.jpg','/images/cases/case-01-after.jpg'),
('existing-case-02','김해 낡은 개수대를 사각 싱크볼로 교체','경남 김해 현장에서 사용감이 있는 기존 개수대를 철거하고 반듯한 라인의 사각 싱크볼로 교체했습니다.','경남 김해','/images/cases/case-02-before.jpg','/images/cases/case-02-after.jpg'),
('existing-case-03','양산 주방 분위기를 바꾸는 사각볼 / 싱크볼 교체','경남 양산 현장에서 기존 싱크볼을 철거한 뒤 깊이감 있는 사각 싱크볼을 설치했습니다.','경남 양산','/images/cases/case-03-before.jpg','/images/cases/case-03-after.jpg'),
('existing-case-04','진주 오래된 씽크볼과 수전 주변 정리','경남 진주 지역에서 오래 사용한 씽크볼을 새 제품으로 교체한 사례입니다.','경남 진주','/images/cases/case-04-before.jpg','/images/cases/case-04-after.jpg'),
('existing-case-05','경남 밀양- 싱크대 개수대 교체 시공','경남 밀양시에서 기존 개수대를 철거하고 새 싱크볼로 교체했습니다.','경남 밀양','/images/cases/case-05-before.jpg','/images/cases/case-05-after.jpg')
on conflict(slug) do nothing;
