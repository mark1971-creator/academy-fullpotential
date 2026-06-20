import type { Metadata } from "next";

export const SITE_NAME = "BEING at Full Potential Academy";

export const DEFAULT_SITE_TITLE = "Human Potential Academy | BEING at Full Potential";

export const DEFAULT_SITE_DESCRIPTION =
  "A place to learn and grow into your full potential — certifications, trainings, and transformational programs from Being at Full Potential.";

/** 1200×630 social share image derived from the HPCC course banner. */
export const OG_IMAGE_PATH = "/Images/og/academy-hpcc-og.jpg";

export const OG_IMAGE_ALT =
  "Certification – Human Potential Development Coach Training — Human Potential Academy";

export function getMetadataBaseUrl(): URL {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  return new URL(configured ?? "https://academy.beingatfullpotential.com");
}

export const defaultOpenGraph: NonNullable<Metadata["openGraph"]> = {
  type: "website",
  locale: "en_US",
  siteName: SITE_NAME,
  title: DEFAULT_SITE_TITLE,
  description: DEFAULT_SITE_DESCRIPTION,
  images: [
    {
      url: OG_IMAGE_PATH,
      width: 1200,
      height: 630,
      alt: OG_IMAGE_ALT,
      type: "image/jpeg",
    },
  ],
};

export const defaultTwitter: NonNullable<Metadata["twitter"]> = {
  card: "summary_large_image",
  title: DEFAULT_SITE_TITLE,
  description: DEFAULT_SITE_DESCRIPTION,
  images: [OG_IMAGE_PATH],
};

export const rootSiteMetadata: Metadata = {
  metadataBase: getMetadataBaseUrl(),
  title: {
    default: DEFAULT_SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_SITE_DESCRIPTION,
  openGraph: defaultOpenGraph,
  twitter: defaultTwitter,
};
