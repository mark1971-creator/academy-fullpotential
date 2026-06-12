-- Course metadata + lesson types for Human Potential Coach Certification Training
-- Run after 20250613000000_quizzes_and_item_progress.sql

-- ---------------------------------------------------------------------------
-- Course metadata (hero, stats, learning outcomes, tags)
-- ---------------------------------------------------------------------------
alter table public.courses
  add column if not exists hero_video_url text,
  add column if not exists duration_label text,
  add column if not exists level text,
  add column if not exists rating numeric(2, 1) check (rating is null or (rating >= 0 and rating <= 5)),
  add column if not exists rating_count integer not null default 0 check (rating_count >= 0),
  add column if not exists enrolled_count integer not null default 0 check (enrolled_count >= 0),
  add column if not exists what_you_will_learn jsonb not null default '[]'::jsonb,
  add column if not exists tags jsonb not null default '[]'::jsonb;

-- ---------------------------------------------------------------------------
-- Lesson types (video vs downloadable resource)
-- ---------------------------------------------------------------------------
alter table public.lessons
  add column if not exists lesson_type text not null default 'video'
    check (lesson_type in ('video', 'resource')),
  add column if not exists duration_label text;
