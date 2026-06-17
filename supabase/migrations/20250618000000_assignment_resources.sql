-- Optional primary file + additional downloadable resources per assignment.
-- Run after 20250612000000_assignments_and_youtube.sql

alter table public.assignments
  alter column file_url drop not null,
  alter column file_type drop not null;

alter table public.assignments
  add column if not exists resource_files jsonb not null default '[]'::jsonb;

alter table public.assignments
  drop constraint if exists assignments_file_type_check;

alter table public.assignments
  add constraint assignments_file_type_check
  check (file_type is null or file_type in ('pdf', 'doc', 'docx'));

alter table public.assignments
  drop constraint if exists assignments_file_pair_check;

alter table public.assignments
  add constraint assignments_file_pair_check
  check (
    (file_url is null and file_type is null)
    or (file_url is not null and file_type is not null)
  );

comment on column public.assignments.description is
  'Learner-facing instructions for the assignment.';

comment on column public.assignments.resource_files is
  'Additional downloads: [{ "title", "file_url", "file_type" }]';
