import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

import { CoursePreviewLayout } from "@/components/course-preview/course-preview";
import { EnrollStatusBanner } from "@/components/course-preview/enroll-status-banner";
import { FallbackDataBanner } from "@/components/dev/fallback-data-banner";
import { PageShell } from "@/components/ui/brand-elements";
import { getCoursePreviewBySlug } from "@/lib/actions/courses";
import { isUserEnrolledInCourse } from "@/lib/actions/enrollments";
import { isFixtureData } from "@/lib/courses/fixtures";
import { HPCC_TESTIMONIALS } from "@/lib/courses/hpcc-testimonials";
import { getHeroVideoUrl, getPreviewLessonCount } from "@/lib/courses/utils";
import { getCourseJsonLd } from "@/lib/structured-data";
import { getMetadataBaseUrl, SITE_NAME } from "@/lib/site-metadata";

type CoursePreviewPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ payment?: string; enroll_error?: string }>;
};

export async function generateMetadata({ params }: CoursePreviewPageProps) {
  const { slug } = await params;
  const course = await getCoursePreviewBySlug(slug);

  if (!course) {
    return { title: "Program not found" };
  }

  const baseUrl = getMetadataBaseUrl().toString().replace(/\/$/, "");
  const description =
    course.tagline ??
    course.description ??
    `Explore ${course.title} at Full Potential Academy.`;

  const ogImage = course.thumbnailUrl
    ? {
        url: course.thumbnailUrl.startsWith("http")
          ? course.thumbnailUrl
          : `${baseUrl}${course.thumbnailUrl}`,
        width: 1200,
        height: 630,
        alt: course.title,
      }
    : undefined;

  return {
    title: course.title,
    description,
    alternates: {
      canonical: `${baseUrl}/courses/${slug}`,
    },
    openGraph: {
      title: course.title,
      description,
      url: `${baseUrl}/courses/${slug}`,
      siteName: SITE_NAME,
      type: "website",
      ...(ogImage && { images: [ogImage] }),
    },
    twitter: {
      card: "summary_large_image",
      title: course.title,
      description,
      ...(ogImage && { images: [ogImage.url] }),
    },
  };
}

export default async function CoursePreviewPage({
  params,
  searchParams,
}: CoursePreviewPageProps) {
  const { slug } = await params;
  const { payment, enroll_error: enrollError } = await searchParams;

  const course = await getCoursePreviewBySlug(slug);

  if (!course) {
    notFound();
  }

  const { userId } = await auth().catch(() => ({ userId: null as string | null }));

  const isEnrolled = userId
    ? await isUserEnrolledInCourse(course.id).catch(() => false)
    : false;

  const lessonCount = getPreviewLessonCount(course);
  const heroVideoUrl = getHeroVideoUrl(course);
  const usingFallbackData = isFixtureData(course);
  const testimonials =
    course.slug === "human-potential-coach-certification" &&
    course.testimonials.length === 0
      ? HPCC_TESTIMONIALS
      : course.testimonials;

  const courseJsonLd = getCourseJsonLd(course);

  return (
    <PageShell className="max-w-[1400px]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />
      {process.env.NODE_ENV === "development" && usingFallbackData && (
        <FallbackDataBanner />
      )}

      <EnrollStatusBanner payment={payment} enrollError={enrollError} />

      <CoursePreviewLayout
        course={{ ...course, testimonials }}
        lessonCount={lessonCount}
        heroVideoUrl={heroVideoUrl}
        isEnrolled={isEnrolled}
      />
    </PageShell>
  );
}
