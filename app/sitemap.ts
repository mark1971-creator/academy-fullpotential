import type { MetadataRoute } from "next";

import { getPublishedCourses } from "@/lib/actions/courses";
import { getMetadataBaseUrl } from "@/lib/site-metadata";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getMetadataBaseUrl().toString().replace(/\/$/, "");

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/courses`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  try {
    const courses = await getPublishedCourses();
    const coursePages: MetadataRoute.Sitemap = courses.map((course) => ({
      url: `${baseUrl}/courses/${course.slug}`,
      lastModified: new Date(course.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));
    return [...staticPages, ...coursePages];
  } catch {
    return staticPages;
  }
}
