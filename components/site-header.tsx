import { Suspense } from "react";

import { AuthActions } from "@/components/auth-actions";
import { BrandLogoLink } from "@/components/brand-logo";
import { SiteMobileNav } from "@/components/site-mobile-nav";
import { SiteNavLinks } from "@/components/site-nav-links";
import { cn } from "@/lib/utils";

type SiteHeaderProps = {
  className?: string;
};

export function SiteHeader({ className }: SiteHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 academy-chrome border-b border-brand-chrome-border pt-[env(safe-area-inset-top)]",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-brand-chrome-border"
      />

      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:h-16 sm:gap-4 sm:px-6 lg:h-[5.75rem] lg:gap-10 lg:px-10">
        <BrandLogoLink
          variant="chrome"
          showAcademyBadge
          size="prominent"
          className="min-w-0"
        />

        <SiteNavLinks variant="chrome" className="hidden items-center gap-12 lg:flex" />

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <Suspense
            fallback={
              <div className="flex items-center gap-2">
                <div className="h-10 w-14 animate-pulse rounded-md bg-slate-100" />
                <div className="h-10 w-20 animate-pulse rounded-md bg-slate-100" />
              </div>
            }
          >
            <AuthActions variant="chrome" />
          </Suspense>
          <SiteMobileNav />
        </div>
      </div>
    </header>
  );
}
