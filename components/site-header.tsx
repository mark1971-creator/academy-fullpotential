import { Suspense } from "react";

import { AuthActions } from "@/components/auth-actions";
import { BrandLogoLink } from "@/components/brand-logo";
import { SiteNavLinks } from "@/components/site-nav-links";
import { cn } from "@/lib/utils";

type SiteHeaderProps = {
  className?: string;
};

export function SiteHeader({ className }: SiteHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 academy-chrome border-b border-brand-chrome-border",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-brand-chrome-border"
      />

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-10 px-8 lg:h-[5.75rem] lg:px-10">
        <BrandLogoLink variant="chrome" showAcademyBadge size="prominent" />

        <SiteNavLinks variant="chrome" className="hidden items-center gap-12 lg:flex" />

        <div className="flex items-center gap-3">
          <Suspense
            fallback={
              <div className="flex items-center gap-2">
                <div className="h-9 w-14 animate-pulse rounded-md bg-slate-100" />
                <div className="h-9 w-20 animate-pulse rounded-md bg-slate-100" />
              </div>
            }
          >
            <AuthActions variant="chrome" />
          </Suspense>
        </div>
      </div>

      <div className="border-t border-brand-chrome-border px-8 py-4 lg:hidden">
        <SiteNavLinks
          variant="chrome"
          className="flex gap-8 overflow-x-auto"
          linkClassName="shrink-0"
        />
      </div>
    </header>
  );
}
