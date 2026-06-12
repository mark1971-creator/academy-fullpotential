-- Assignments + YouTube lesson URLs
-- Run after 20250611000000_initial_schema.sql

-- Rename video_url → youtube_url for clarity
alter table public.lessons rename column video_url to youtube_url;

-- ---------------------------------------------------------------------------
-- Assignments (PDF / Word docs stored in Supabase Storage)
-- Attached to either a lesson or a module (not both).
-- ---------------------------------------------------------------------------
create table public.assignments (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  file_url text not null,
  file_type text not null check (file_type in ('pdf', 'doc', 'docx')),
  lesson_id uuid references public.lessons (id) on delete cascade,
  module_id uuid references public.modules (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint assignments_parent_check check (
    (lesson_id is not null and module_id is null)
    or (lesson_id is null and module_id is not null)
  )
);

create index assignments_lesson_id_idx on public.assignments (lesson_id);
create index assignments_module_id_idx on public.assignments (module_id);

create trigger assignments_set_updated_at
  before update on public.assignments
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.assignments enable row level security;

create policy "Anyone can view assignments of published courses"
  on public.assignments for select
  using (
    (
      lesson_id is not null
      and exists (
        select 1
        from public.lessons
        join public.modules on modules.id = lessons.module_id
        join public.courses on courses.id = modules.course_id
        where lessons.id = assignments.lesson_id
          and courses.is_published = true
      )
    )
    or (
      module_id is not null
      and exists (
        select 1
        from public.modules
        join public.courses on courses.id = modules.course_id
        where modules.id = assignments.module_id
          and courses.is_published = true
      )
    )
  );

-- ---------------------------------------------------------------------------
-- Storage bucket for assignment files (run via Supabase dashboard or CLI)
-- Bucket name: assignments — public read for enrolled users handled in app layer.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('assignments', 'assignments', true)
on conflict (id) do nothing;

create policy "Public read assignment files"
  on storage.objects for select
  using (bucket_id = 'assignments');
