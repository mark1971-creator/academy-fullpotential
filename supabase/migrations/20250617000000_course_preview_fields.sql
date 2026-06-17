-- Preview / marketing fields for public course pages
-- Outcomes use existing what_you_will_learn; hero uses hero_video_url + image_url

alter table public.courses
  add column if not exists tagline text,
  add column if not exists who_this_is_for jsonb not null default '[]'::jsonb,
  add column if not exists testimonials jsonb not null default '[]'::jsonb;

comment on column public.courses.tagline is 'Short marketing headline shown on the public preview page';
comment on column public.courses.who_this_is_for is 'Array of audience strings for the preview page';
comment on column public.courses.testimonials is 'Array of { name, role?, quote, rating? } objects';
