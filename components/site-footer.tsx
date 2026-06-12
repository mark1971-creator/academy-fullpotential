import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/80 bg-brand-navy text-brand-cream">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <BrandLogo variant="light" />
            <p className="mt-5 text-sm leading-relaxed text-brand-cream/70">
              Dedicated to a world where the human potential of every individual,
              team, and organization can be fully expressed.
            </p>
          </div>

          <div className="flex gap-12 text-sm">
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.22em] text-brand-gold-light">
                Academy
              </p>
              <div className="flex flex-col gap-2 text-brand-cream/75">
                <Link href="/courses" className="transition-colors hover:text-brand-gold-light">
                  Courses
                </Link>
                <Link href="/dashboard" className="transition-colors hover:text-brand-gold-light">
                  Dashboard
                </Link>
              </div>
            </div>
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.22em] text-brand-gold-light">
                Connect
              </p>
              <div className="flex flex-col gap-2 text-brand-cream/75">
                <a
                  href="https://beingatfullpotential.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-brand-gold-light"
                >
                  Main site
                </a>
                <a
                  href="https://beingatfullpotential.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-brand-gold-light"
                >
                  Take assessment
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-brand-cream/10 pt-8 text-xs text-brand-cream/50">
          © {new Date().getFullYear()} BEING at Full Potential. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
