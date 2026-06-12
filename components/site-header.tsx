import Link from "next/link";
import { Suspense } from "react";

import { AuthActions } from "@/components/auth-actions";
import { BrandLogo } from "@/components/brand-logo";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/dashboard", label: "Dashboard" },
] as const;

type SiteHeaderProps = {
  className?: string;
};

export function SiteHeader({ className }: SiteHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-border/70 bg-brand-cream/90 backdrop-blur-md supports-[backdrop-filter]:bg-brand-cream/80",
        className,
      )}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-8 px-6">
        <Link href="/" className="group shrink-0 transition-opacity hover:opacity-90">
          <BrandLogo />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-sans text-xs font-normal uppercase tracking-[0.22em] text-foreground/70 transition-colors duration-300 hover:text-brand-gold"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Suspense
            fallback={
              <div className="flex items-center gap-2">
                <div className="h-9 w-14 animate-pulse rounded-sm bg-muted" />
                <div className="h-9 w-20 animate-pulse rounded-sm bg-muted" />
              </div>
            }
          >
            <AuthActions />
          </Suspense>
        </div>
      </div>

      <nav className="flex gap-6 overflow-x-auto border-t border-border/60 px-6 py-3 lg:hidden">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="shrink-0 font-sans text-xs uppercase tracking-[0.22em] text-foreground/70 transition-colors hover:text-brand-gold"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
