import Link from "next/link";

import { BrandLogoLink } from "@/components/brand-logo";

export function SiteFooter() {
  return (
    <footer className="relative z-10 mt-auto academy-chrome border-t border-brand-chrome-border">
      <div className="mx-auto max-w-7xl px-8 py-16 sm:px-10 lg:px-12 lg:py-20">
        <div className="flex flex-col gap-14 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-md">
            <BrandLogoLink variant="chrome" showAcademyBadge size="prominent" />
            <p className="mt-8 text-base leading-relaxed text-brand-chrome-muted">
              A dedicated learning environment for unlocking human potential —
              certifications, trainings, and transformational programs.
            </p>
          </div>

          <div className="flex gap-16 text-sm">
            <div>
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-brand-blue">
                Academy
              </p>
              <div className="flex flex-col gap-3 text-brand-chrome-muted">
                <Link
                  href="/courses"
                  className="transition-colors duration-300 hover:text-brand-chrome-foreground"
                >
                  Browse Courses
                </Link>
                <Link
                  href="/my-courses"
                  className="transition-colors duration-300 hover:text-brand-chrome-foreground"
                >
                  My Learning
                </Link>
              </div>
            </div>
            <div>
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-brand-blue">
                Connect
              </p>
              <div className="flex flex-col gap-3 text-brand-chrome-muted">
                <a
                  href="https://beingatfullpotential.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-300 hover:text-brand-chrome-foreground"
                >
                  Main site
                </a>
                <a
                  href="https://beingatfullpotential.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-300 hover:text-brand-chrome-foreground"
                >
                  Take assessment
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-brand-chrome-border pt-8 text-xs text-brand-chrome-muted">
          © {new Date().getFullYear()} BEING at Full Potential. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
