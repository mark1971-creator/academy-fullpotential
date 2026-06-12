-- Sample seed data for local development
-- Apply migrations first, then run this in the Supabase SQL editor.

insert into public.courses (title, description, slug, image_url, price, is_published)
values
  (
    'Human Potential Fundamentals',
    'Core principles for unlocking personal and collective potential in work and life.',
    'human-potential-fundamentals',
    null,
    0,
    true
  ),
  (
    'Certified Coach Pathway',
    'Structured certification track for coaches guiding transformation journeys.',
    'certified-coach-pathway',
    null,
    499.00,
    true
  ),
  (
    'Leadership Presence',
    'Develop embodied leadership skills for teams navigating complex change.',
    'leadership-presence',
    null,
    299.00,
    true
  )
on conflict (slug) do nothing;

do $$
declare
  course_id uuid;
  module_id uuid;
  lesson_id uuid;
begin
  select id into course_id
  from public.courses
  where slug = 'human-potential-fundamentals';

  if course_id is null then
    return;
  end if;

  -- Skip if curriculum already seeded
  if exists (select 1 from public.modules where course_id = course_id) then
    return;
  end if;

  insert into public.modules (course_id, title, sort_order)
  values (course_id, 'Foundations', 1)
  returning id into module_id;

  insert into public.lessons (module_id, title, youtube_url, content, duration_minutes, sort_order)
  values
    (
      module_id,
      'What is Human Potential?',
      'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
      'Introduction to the framework and why it matters.',
      12,
      1
    ),
    (
      module_id,
      'The Three Pillars',
      'https://www.youtube.com/watch?v=EngW7tLk6R8',
      'Explore awareness, alignment, and action as core pillars.',
      18,
      2
    ),
    (
      module_id,
      'Putting It Into Practice',
      'https://www.youtube.com/watch?v=ScMzIvxBSi4',
      'Apply the model to a real challenge in your life or work.',
      25,
      3
    );

  select id into lesson_id
  from public.lessons
  where module_id = module_id
    and title = 'What is Human Potential?';

  insert into public.assignments (title, description, file_url, file_type, module_id)
  values (
    'Foundations Workbook',
    'Module-level reflection exercises to complete alongside the video lessons.',
    'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    'pdf',
    module_id
  );

  if lesson_id is not null then
    insert into public.assignments (title, description, file_url, file_type, lesson_id)
    values (
      'Lesson 1 Reflection Sheet',
      'Guided prompts for your first lesson on human potential.',
      'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      'pdf',
      lesson_id
    );
  end if;
end $$;
