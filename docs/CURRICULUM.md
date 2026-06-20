# Curriculum & Content Management

This guide covers how course content is structured, seeded into Supabase, and updated over time.

## Table of contents

1. [Content model](#content-model)
2. [Seed data organization](#seed-data-organization)
3. [Seeding workflow](#seeding-workflow)
4. [Adding a new course](#adding-a-new-course)
5. [Updating lesson content](#updating-lesson-content)
6. [Assignment file uploads](#assignment-file-uploads)
7. [Legacy enrollments](#legacy-enrollments)
8. [Course images and OG preview](#course-images-and-og-preview)

---

## Content model

Each course in the catalog has a hierarchical structure:

```
Course
 └── Module (ordered by sort_order)
      ├── Lesson (video or resource)
      ├── Assignment (optional, module-level)
      ├── Quiz (optional, module-level)
      └── Lesson
           ├── Assignment (optional, lesson-level)
           └── Quiz (optional, lesson-level)
```

### Lesson types

| Type | `lesson_type` | Fields used | Player behavior |
|------|---------------|-------------|-----------------|
| Video | `video` | `youtube_url`, `content`, `duration_label` | Reading content displayed above YouTube embed |
| Resource | `resource` | `content` | Reading content only (no video) |
| Placeholder | `resource` | `content` = "Content coming soon…" | Shows coming-soon banner |

### Assignments

Assignments can be attached at the **module** or **lesson** level:

- `module_id` — appears as a module-level item in the curriculum sidebar
- `lesson_id` — appears after a specific lesson

Files are stored in Supabase Storage and referenced via:

- `file_url` — primary download (legacy single file)
- `resource_files` — JSON array of `{ title, url }` for multiple downloads

### Quizzes

Quizzes store questions as a JSON array in the `questions` column:

```json
[
  {
    "question": "What is the Human Potential Iceberg?",
    "options": ["Option A", "Option B", "Option C"],
    "correctIndex": 0
  }
]
```

---

## Seed data organization

All course definitions live in `supabase/seed-data/`:

| File | Purpose |
|------|---------|
| `courses.mjs` | Course metadata + module title lists for all 5 programs |
| `course-curriculum.mjs` | Aggregator mapping slugs → lesson/assignment data files |
| `hpcc-lessons.mjs` | Full HPCC lesson list (11 modules) |
| `hpcc-module-assignments.mjs` | HPCC assignment definitions |
| `team-coach-curriculum.mjs` | Team Coach lessons and assignments |
| `employee-experience-curriculum.mjs` | Employee Experience lessons and assignments |
| `wholeness-curriculum.mjs` | Wholeness course lessons and assignments |
| `placeholder-lessons.mjs` | Generic placeholder content for incomplete courses |
| `hpcc-legacy-enrollees.mjs` | Email/name list for WordPress migration |
| `hpcc-testimonials.json` | HPCC student testimonials |
| `course-intro-videos.json` | Hero video URLs per course slug |

### Course slugs

| Slug | Modules | Price |
|------|---------|-------|
| `human-potential-coach-certification` | 11 | $995 |
| `idg-coach-certification` | TBD | TBD |
| `from-fragmentation-to-wholeness` | 6 | TBD |
| `breakthroughs-employee-experience` | 7 | $99 |
| `human-potential-team-coach-certification` | 6 | TBD |

Catalog display order is defined in `lib/courses/catalog-order.ts`.

---

## Seeding workflow

### Full seed (first deploy or complete refresh)

```bash
npm run seed
```

This runs four scripts in order:

1. `seed_course_meta.mjs` — upsert courses and module titles from `courses.mjs`
2. `seed_lessons.mjs --all` — insert lessons per slug from curriculum files
3. `seed_assignments.mjs --all` — insert assignment rows
4. `seed_placeholder_lessons.mjs` — add placeholder lessons for modules without content

**Prerequisites:** `.env.local` (or `.env` on server) with `SUPABASE_SERVICE_ROLE_KEY`.

### Partial seeds

```bash
# Re-seed lessons and assignments only (after editing curriculum files)
npm run seed:curriculum

# Re-seed a single course's lessons
node supabase/seed_lessons.mjs --slug human-potential-coach-certification

# Re-seed a single course's assignments
node supabase/seed_assignments.mjs --slug breakthroughs-employee-experience

# HPCC assignments only
npm run seed:hpcc-assignments

# Legacy HPCC student profiles and enrollments
npm run seed:legacy-enrollments
```

### Seed script CLI

All seed scripts support:

- `--all` — process every course in the curriculum aggregator
- `--slug <slug>` — process a single course

Shared utilities are in `supabase/seed-utils.mjs` (env loading, slug parsing).

### Idempotency

Seed scripts use upsert or existence checks where possible. Re-running seeds is generally safe, but:

- Lessons may duplicate if the script inserts rather than upserts — check script behavior before re-running on production
- Assignment file URLs are set by the upload script, not the seed script

---

## Adding a new course

1. **Define the course** in `supabase/seed-data/courses.mjs`:
   - Add a `{ course, moduleTitles }` entry with slug, title, price, marketing fields, and module titles

2. **Create curriculum data** — add a new file (e.g. `my-course-curriculum.mjs`) or extend `course-curriculum.mjs`:
   - Export lesson arrays with `moduleSortOrder`, `title`, `lessonType`, `youtubeUrl`, `content`, `durationLabel`
   - Export assignment arrays if applicable

3. **Add catalog order** in `lib/courses/catalog-order.ts`

4. **Add course image** to `public/Images/courses/<slug>.webp`

5. **Run seeds:**
   ```bash
   npm run seed
   ```

6. **Upload assignment files** (if any) — see [Assignment file uploads](#assignment-file-uploads)

7. **Set `is_published: true`** in the course definition when ready to go live

---

## Updating lesson content

### Edit seed data

1. Modify the relevant curriculum file (e.g. `employee-experience-curriculum.mjs`)
2. Re-seed the course:
   ```bash
   node supabase/seed_lessons.mjs --slug breakthroughs-employee-experience
   ```

### Lesson content structure (video lessons)

For video lessons, `content` is split in the player:

- **Part 1** — displayed above the video (main reading)
- **Part 2** — stored in the linked assignment as "Additional resources & exercises" (if applicable)

The `CoursePlayer` component renders reading content above the YouTube embed for video lessons.

### Direct database edits

For one-off fixes, you can update rows directly in the Supabase SQL editor:

```sql
UPDATE lessons
SET content = 'Updated content here...'
WHERE id = 'lesson-uuid-here';
```

Prefer seed files for changes that should persist across re-seeds.

---

## Assignment file uploads

Assignment PDFs and documents are uploaded to Supabase Storage via a CLI script.

### Upload a file

```bash
node scripts/upload-assignment-file.mjs \
  --course human-potential-coach-certification \
  --module 1 \
  --file ./worksheet.pdf \
  --title "Module 1 Worksheet" \
  --primary
```

### Options

| Flag | Description |
|------|-------------|
| `--course <slug>` | Course slug (required) |
| `--module <n>` | Module sort order number (required) |
| `--file <path>` | Local file to upload (required) |
| `--title "Label"` | Display title for the download link |
| `--primary` | Set as the primary `file_url` (vs. adding to `resource_files`) |

### Batch uploads

For courses with many modules, run the script once per file:

```bash
# HPCC modules 1–11
for i in $(seq 1 11); do
  node scripts/upload-assignment-file.mjs \
    --course human-potential-coach-certification \
    --module $i \
    --file "./assignments/module-$i.pdf" \
    --primary
done
```

**Prerequisites:** `SUPABASE_SERVICE_ROLE_KEY` in environment; assignment row must exist (run `seed_assignments` first).

---

## Legacy enrollments

### Purpose

Students who paid for HPCC on the previous WordPress site need access without re-purchasing. Legacy enrollments create placeholder profiles before users sign up.

### Seed legacy students

```bash
npm run seed:legacy-enrollments
```

This reads `supabase/seed-data/hpcc-legacy-enrollees.mjs` and creates:

- `profiles` with `id = legacy:<email>`
- `enrollments` linking those profiles to the HPCC course

### Adding new legacy students

1. Add `{ email, fullName }` entries to `hpcc-legacy-enrollees.mjs`
2. Re-run `npm run seed:legacy-enrollments`

### Verify legacy state

```bash
node scripts/check-legacy-enrollments.mjs
```

Reports how many legacy profiles exist, how many have been claimed, and lists unclaimed emails.

### User instructions for returning students

Returning students should:

1. Go to https://academy.beingatfullpotential.com/sign-up
2. Create an account using the **same email** they used when purchasing HPCC
3. Visit `/my-courses` — enrollment is claimed automatically on sign-in

They cannot use their old WordPress password; they must create a new account.

---

## Course images and OG preview

### Course thumbnails

- Location: `public/Images/courses/<slug>.webp`
- Referenced in `courses.mjs` as `image_url`
- Optimize: `npm run optimize:course-images`
- Generate placeholders: `npm run generate:course-images`

### Social share preview (Open Graph)

- Generated image: `public/Images/og/academy-hpcc-og.jpg`
- Metadata: `lib/site-metadata.ts`
- Regenerate: `npm run generate:og-image`

After changing OG image or metadata, rebuild and redeploy:

```bash
npm run build
./scripts/vps-deploy.sh
```

Verify with [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) or [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/).

---

## Related documentation

- [Architecture](./ARCHITECTURE.md) — data model and learn experience design
- [Operations](./OPERATIONS.md) — deployment and environment setup
