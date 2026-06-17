import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Cormorant_Garamond, Lato } from "next/font/google";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { CLERK_PROVIDER_PROPS } from "@/lib/clerk/routes";

import "./globals.css";

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Human Potential Academy | BEING at Full Potential",
    template: "%s | BEING at Full Potential",
  },
  description:
    "A place to learn and grow into your full potential — certifications, trainings, and transformational programs from Being at Full Potential.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`academy-theme ${lato.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="relative flex min-h-full flex-col">
        <div aria-hidden className="pointer-events-none fixed inset-0 grain-overlay" />
        <ClerkProvider {...CLERK_PROVIDER_PROPS}>
          <SiteHeader />
          <main className="relative z-10 flex flex-1 flex-col">{children}</main>
          <SiteFooter />
        </ClerkProvider>
      </body>
    </html>
  );
}
