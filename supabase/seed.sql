-- =============================================================================
-- Full Potential Academy — Seed Data
-- Human Potential Coach Certification Training (HPCC)
-- =============================================================================

-- 1. COURSE
insert into public.courses (
  title, description, slug, image_url, price, is_published, 
  hero_video_url, duration_label, level, rating, rating_count, 
  enrolled_count, what_you_will_learn, tags
)
values (
  'Certification – Human Potential Development Coach Training',
  'Welcome and thank you for enrolling for this certification training. If you work with leaders, teams & organizations you will probably agree that much of our Human Potential remains dormant or unexpressed in the work environment. This program equips you to debrief assessments, build business cases for human potential development, and guide transformational client work.',
  'human-potential-coach-certification',
  null,
  995.00,
  true,
  null,
  '24 hours',
  'Expert',
  5.0,
  10,
  86,
  '[
    "Debrief the Human Potential assessment with your clients",
    "Clearly demonstrate how a greater focus on HUMAN POTENTIAL REALIZATION drives key business metrics such as: employee engagement, trustworthiness & innovation",
    "Offer very concrete tools and methodologies that bring more objectivity to the subjective nature of human beings",
    "Make a robust business case for HUMAN POTENTIAL DEVELOPMENT and expand your effectiveness in OD work",
    "Inspire your clients to bring more focus and attention on the HUMAN DIMENSION in their organizations",
    "Gain insights that will allow you to access even more of your human potential and grow into your next stage of personal development in life"
  ]'::jsonb,
  '["Coaching", "Conscious Culture", "Human Potential", "Leadership development", "Organizational development", "Personal development"]'::jsonb
)
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  price = excluded.price,
  is_published = excluded.is_published,
  hero_video_url = excluded.hero_video_url,
  duration_label = excluded.duration_label,
  level = excluded.level,
  rating = excluded.rating,
  rating_count = excluded.rating_count,
  enrolled_count = excluded.enrolled_count,
  what_you_will_learn = excluded.what_you_will_learn,
  tags = excluded.tags,
  updated_at = now();

-- Clear existing curriculum
delete from public.modules
where course_id = (select id from public.courses where slug = 'human-potential-coach-certification');

-- =============================================================================
-- 2. MODULES
-- =============================================================================
insert into public.modules (course_id, title, sort_order)
select c.id, v.title, v.sort_order
from public.courses c
cross join (
  values
    (1,  'Module 1: Authentic introductions'),
    (2,  'Module 2: Context for Human Potential interventions'),
    (3,  'Module 3: The Human Potential Iceberg'),
    (4,  'Module 4: Using the 6 OPM''s to build bridges into the client''s reality'),
    (5,  'Module 5: Understanding the Human Potential House'),
    (6,  'Module 6: Using the 4 States and 23 Dimensions to uncover deeper insight into the client''s reality'),
    (7,  'Module 7: The 8 Being Attitudes'),
    (8,  'Module 8: Consciousness Maturity Index'),
    (9,  'Module 9: Additional findings'),
    (10, 'Module 10: Debriefing clients on their full report'),
    (11, 'Module 11: Closing, next steps & certification')
) as v(sort_order, title)
where c.slug = 'human-potential-coach-certification';

-- =============================================================================
-- 3. LESSONS
-- =============================================================================

-- Module 1
insert into public.lessons (module_id, title, youtube_url, lesson_type, duration_label, duration_minutes, sort_order)
select m.id, v.title, v.youtube_url, v.lesson_type, v.duration_label, v.duration_minutes::integer, v.sort_order
from public.modules m
join public.courses c on c.id = m.course_id
cross join (
  values
    ('Getting to know each other & creating a BEING space', 'https://youtu.be/2XXFEndXKhE', 'video', '18:55', 19, 1)
) as v(title, youtube_url, lesson_type, duration_label, duration_minutes, sort_order)
where c.slug = 'human-potential-coach-certification' and m.sort_order = 1;

-- Module 2
insert into public.lessons (module_id, title, youtube_url, lesson_type, duration_label, duration_minutes, sort_order)
select m.id, v.title, v.youtube_url, v.lesson_type, v.duration_label, v.duration_minutes::integer, v.sort_order
from public.modules m
join public.courses c on c.id = m.course_id
cross join (
  values
    ('Understanding why deeper human-centric interventions are needed', 'https://youtu.be/POa-Ksk-FqU', 'video', '17:12', 18, 1),
    ('Connecting with the emerging need',                              'https://youtu.be/XtXs-qjxhrk', 'video', '15:55', 16, 2),
    ('Filling the void',                                               'https://youtu.be/XZakH2-ne_U', 'video', '14:53', 15, 3)
) as v(title, youtube_url, lesson_type, duration_label, duration_minutes, sort_order)
where c.slug = 'human-potential-coach-certification' and m.sort_order = 2;

-- Module 3
insert into public.lessons (module_id, title, youtube_url, lesson_type, duration_label, duration_minutes, sort_order)
select m.id, v.title, v.youtube_url, v.lesson_type, v.duration_label, v.duration_minutes::integer, v.sort_order
from public.modules m
join public.courses c on c.id = m.course_id
cross join (
  values
    ('Introduction to the Human Potential Iceberg', 'https://youtu.be/GGPuqlP83LA', 'video', '24:01', 25, 1),
    ('Deep dive into the 6 Organizational Performance Metrics (OPM''s)', 'https://youtu.be/0ihlThTOa0U', 'video', '22:45', 23, 2)
) as v(title, youtube_url, lesson_type, duration_label, duration_minutes, sort_order)
where c.slug = 'human-potential-coach-certification' and m.sort_order = 3;

-- Module 4
insert into public.lessons (module_id, title, youtube_url, lesson_type, duration_label, duration_minutes, sort_order)
select m.id, v.title, v.youtube_url, v.lesson_type, v.duration_label, v.duration_minutes::integer, v.sort_order
from public.modules m
join public.courses c on c.id = m.course_id
cross join (
  values
    ('OPM role play',                  'https://youtu.be/2ST4TJPnOZA', 'video', '26:59', 27, 1),
    ('OPM role play - Best practices', 'https://youtu.be/e9Cn2F7g-5w', 'video', '24:51', 25, 2)
) as v(title, youtube_url, lesson_type, duration_label, duration_minutes, sort_order)
where c.slug = 'human-potential-coach-certification' and m.sort_order = 4;

-- Module 5
insert into public.lessons (module_id, title, youtube_url, lesson_type, duration_label, duration_minutes, sort_order)
select m.id, v.title, v.youtube_url, v.lesson_type, v.duration_label, v.duration_minutes::integer, v.sort_order
from public.modules m
join public.courses c on c.id = m.course_id
cross join (
  values
    ('The origins of the Human Potential House', 'https://youtu.be/e1WQoNM6dmU', 'video', '21:50', 22, 1),
    ('Working with the Human Potential House',   'https://youtu.be/rEqJdrsEPew', 'video', '22:28', 23, 2)
) as v(title, youtube_url, lesson_type, duration_label, duration_minutes, sort_order)
where c.slug = 'human-potential-coach-certification' and m.sort_order = 5;

-- Module 6
insert into public.lessons (module_id, title, youtube_url, lesson_type, duration_label, duration_minutes, sort_order)
select m.id, v.title, v.youtube_url, v.lesson_type, v.duration_label, v.duration_minutes::integer, v.sort_order
from public.modules m
join public.courses c on c.id = m.course_id
cross join (
  values
    ('Debriefing the Human Potential House Role Play', 'https://youtu.be/cX3M-PDKhtw', 'video', null, null, 1),
    ('Deep dive into the 4 States & 23 Dimensions',    'https://youtu.be/aowvAT8brYg', 'video', null, null, 2)
) as v(title, youtube_url, lesson_type, duration_label, duration_minutes, sort_order)
where c.slug = 'human-potential-coach-certification' and m.sort_order = 6;

-- Module 7
insert into public.lessons (module_id, title, youtube_url, lesson_type, duration_label, duration_minutes, sort_order)
select m.id, v.title, v.youtube_url, v.lesson_type, v.duration_label, v.duration_minutes::integer, v.sort_order
from public.modules m
join public.courses c on c.id = m.course_id
cross join (
  values
    ('Deep dive into the 8 Being Attitudes', 'https://youtu.be/teu9XlnkOYQ', 'video', null, null, 1)
) as v(title, youtube_url, lesson_type, duration_label, duration_minutes, sort_order)
where c.slug = 'human-potential-coach-certification' and m.sort_order = 7;

-- Module 8
insert into public.lessons (module_id, title, youtube_url, lesson_type, duration_label, duration_minutes, sort_order)
select m.id, v.title, v.youtube_url, v.lesson_type, v.duration_label, v.duration_minutes::integer, v.sort_order
from public.modules m
join public.courses c on c.id = m.course_id
cross join (
  values
    ('Understanding the 5 levels of maturity and consciousness',            'https://youtu.be/yWjAr7TAdDk', 'video', '24:44', 25, 1),
    ('Applying of maturity consciousness model',                            'https://youtu.be/gnttLZKH2D0', 'video', '25:03', 26, 2),
    ('Using the Maturity framework to connect with our clients - role play','https://youtu.be/PiTnDjl89K4', 'video', '22:57', 23, 3)
) as v(title, youtube_url, lesson_type, duration_label, duration_minutes, sort_order)
where c.slug = 'human-potential-coach-certification' and m.sort_order = 8;

-- Module 9
insert into public.lessons (module_id, title, youtube_url, lesson_type, duration_label, duration_minutes, sort_order)
select m.id, v.title, v.youtube_url, v.lesson_type, v.duration_label, v.duration_minutes::integer, v.sort_order
from public.modules m
join public.courses c on c.id = m.course_id
cross join (
  values
    ('Clarifying all remaining parts of the Human Potential report', 'https://youtu.be/TGZiz5faZO0', 'video', '21:28', 22, 1)
) as v(title, youtube_url, lesson_type, duration_label, duration_minutes, sort_order)
where c.slug = 'human-potential-coach-certification' and m.sort_order = 9;

-- Module 10
insert into public.lessons (module_id, title, youtube_url, lesson_type, duration_label, duration_minutes, sort_order)
select m.id, v.title, v.youtube_url, v.lesson_type, v.duration_label, v.duration_minutes::integer, v.sort_order
from public.modules m
join public.courses c on c.id = m.course_id
cross join (
  values
    ('Part 1: Bringing it all to life with full assessment debrief',       'https://youtu.be/2h7QYESAzPE', 'video', '35:37', 36, 1),
    ('Part 2: Lessons and best practices from full HP assessment debrief', 'https://youtu.be/mJ9Ao4mBPEM', 'video', '15:05', 16, 2)
) as v(title, youtube_url, lesson_type, duration_label, duration_minutes, sort_order)
where c.slug = 'human-potential-coach-certification' and m.sort_order = 10;

-- Module 11
insert into public.lessons (module_id, title, youtube_url, lesson_type, duration_label, duration_minutes, content, sort_order)
select m.id, v.title, v.youtube_url, v.lesson_type, v.duration_label, v.duration_minutes::integer, v.content, v.sort_order
from public.modules m
join public.courses c on c.id = m.course_id
cross join (
  values
    ('Part 1: Synchronizing individual and collective purpose',       'https://youtu.be/PsADDe5JE9s', 'video',    '19:20', 20, null, 1),
    ('Part 2: Being at Full Potential vision, mission and standards', 'https://youtu.be/NsS3h8nR0E4', 'video',    '19:59', 20, null, 2),
    ('Part 3: Next steps',                                            'https://youtu.be/yfMvAQQjRpM', 'video',    '19:15', 20, null, 3),
    ('Resources & feedback form',                                     null,                           'resource', null,    null, 'Access program resources and submit your training feedback.', 4),
    ('Certification check list',                                      null,                           'resource', null,    null, 'Review the certification checklist to confirm you have met all program requirements.', 5)
) as v(title, youtube_url, lesson_type, duration_label, duration_minutes, content, sort_order)
where c.slug = 'human-potential-coach-certification' and m.sort_order = 11;