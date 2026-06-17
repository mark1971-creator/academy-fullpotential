import introVideosJson from "@/supabase/seed-data/course-intro-videos.json";

const COURSE_INTRO_VIDEOS = introVideosJson as Record<string, string>;

export function getCourseIntroVideoUrl(slug: string): string | null {
  return COURSE_INTRO_VIDEOS[slug] ?? null;
}
