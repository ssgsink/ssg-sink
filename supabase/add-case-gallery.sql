-- Run once in Supabase SQL Editor before testing the enhanced case editor.
-- Existing cases and their photos remain unchanged.
alter table public.case_posts
  add column if not exists gallery jsonb not null default '[]'::jsonb,
  add column if not exists details text not null default '';

-- No new table or storage bucket is required.
-- Existing case_posts RLS and grants also cover the new columns.
