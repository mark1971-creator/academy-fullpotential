-- Sample seed data for local development
-- Apply migration first, then run this in the Supabase SQL editor.

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
begin
  select id into course_id
  from public.courses
  where slug = 'human-potential-fundamentals';

  if course_id is null then
    return;
  end if;

  insert into public.modules (course_id, title, sort_order)
  values (course_id, 'Foundations', 1)
  returning id into module_id;

  insert into public.lessons (module_id, title, content, duration_minutes, sort_order)
  values
    (module_id, 'What is Human Potential?', 'Introduction to the framework and why it matters.', 12, 1),
    (module_id, 'The Three Pillars', 'Explore awareness, alignment, and action as core pillars.', 18, 2),
    (module_id, 'Putting It Into Practice', 'Apply the model to a real challenge in your life or work.', 25, 3);
end $$;
