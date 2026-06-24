import type { MetadataRoute } from "next";

import { getMetadataBaseUrl } from "@/lib/site-metadata";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getMetadataBaseUrl().toString().replace(/\/$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/my-courses/", "/dashboard/", "/sign-in/", "/sign-up/", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
