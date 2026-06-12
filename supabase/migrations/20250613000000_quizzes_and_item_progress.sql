-- Quizzes + per-item progress (assignments, quizzes)
-- Run after 20250612000000_assignments_and_youtube.sql

-- ---------------------------------------------------------------------------
-- Quizzes (simple JSON questions for now)
-- Attached to either a lesson or a module (not both).
-- ---------------------------------------------------------------------------
create table public.quizzes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  lesson_id uuid references public.lessons (id) on delete cascade,
  module_id uuid references public.modules (id) on delete cascade,
  sort_order integer not null default 0,
  questions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint quizzes_parent_check check (
    (lesson_id is not null and module_id is null)
    or (lesson_id is null and module_id is not null)
  )
);

create index quizzes_lesson_id_idx on public.quizzes (lesson_id);
create index quizzes_module_id_idx on public.quizzes (module_id);

create trigger quizzes_set_updated_at
  before update on public.quizzes
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Assignment progress (per-user completion)
-- ---------------------------------------------------------------------------
create table public.assignment_progress (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public.profiles (id) on delete cascade,
  assignment_id uuid not null references public.assignments (id) on delete cascade,
  completed_at timestamptz not null default now(),
  unique (user_id, assignment_id)
);

create index assignment_progress_user_id_idx on public.assignment_progress (user_id);
create index assignment_progress_assignment_id_idx on public.assignment_progress (assignment_id);

-- ---------------------------------------------------------------------------
-- Quiz progress (per-user completion)
-- ---------------------------------------------------------------------------
create table public.quiz_progress (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public.profiles (id) on delete cascade,
  quiz_id uuid not null references public.quizzes (id) on delete cascade,
  completed_at timestamptz not null default now(),
  unique (user_id, quiz_id)
);

create index quiz_progress_user_id_idx on public.quiz_progress (user_id);
create index quiz_progress_quiz_id_idx on public.quiz_progress (quiz_id);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.quizzes enable row level security;
alter table public.assignment_progress enable row level security;
alter table public.quiz_progress enable row level security;

create policy "Anyone can view quizzes of published courses"
  on public.quizzes for select
  using (
    (
      lesson_id is not null
      and exists (
        select 1
        from public.lessons
        join public.modules on modules.id = lessons.module_id
        join public.courses on courses.id = modules.course_id
        where lessons.id = quizzes.lesson_id
          and courses.is_published = true
      )
    )
    or (
      module_id is not null
      and exists (
        select 1
        from public.modules
        join public.courses on courses.id = modules.course_id
        where modules.id = quizzes.module_id
          and courses.is_published = true
      )
    )
  );
