-- Run once in Supabase SQL Editor before testing automatic image deletion.
-- Replace the email below with the exact administrator email already used in your existing policies.
-- This permits deletion only for the authenticated admin and only inside their own folder.
create policy "Admin image delete" on storage.objects
for delete to authenticated
using (
 bucket_id = 'case-images'
 and (auth.jwt()->>'email') = 'ssg-sink@naver.com'
 and (storage.foldername(name))[1] = auth.uid()::text
);
