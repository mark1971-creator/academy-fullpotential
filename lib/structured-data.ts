import type { Course } from "@/types/lms";
import { getMetadataBaseUrl, SITE_NAME } from "@/lib/site-metadata";

export function getOrganizationJsonLd() {
  const baseUrl = getMetadataBaseUrl().toString().replace(/\/$/, "");

  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: SITE_NAME,
    url: baseUrl,
    logo: `${baseUrl}/Images/Logo.png`,
    description:
      "A place to learn and grow into your full potential. Explore certifications, trainings, and programs that elevate your state of BEING.",
    sameAs: ["https://beingatfullpotential.com"],
  };
}

export function getCourseJsonLd(course: Course) {
  const baseUrl = getMetadataBaseUrl().toString().replace(/\/$/, "");

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.tagline ?? course.description ?? "",
    url: `${baseUrl}/courses/${course.slug}`,
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: baseUrl,
    },
    ...(course.thumbnailUrl && {
      image: course.thumbnailUrl.startsWith("http")
        ? course.thumbnailUrl
        : `${baseUrl}${course.thumbnailUrl}`,
    }),
    ...(course.price != null && {
      offers: {
        "@type": "Offer",
        price: course.price,
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        url: `${baseUrl}/courses/${course.slug}`,
      },
    }),
    ...(course.rating != null &&
      course.ratingCount > 0 && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: course.rating,
          ratingCount: course.ratingCount,
        },
      }),
  };

  return jsonLd;
}
