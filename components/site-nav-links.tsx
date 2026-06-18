"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SITE_NAV_ITEMS } from "@/lib/site-nav";
import { cn } from "@/lib/utils";

type SiteNavLinksProps = {
  className?: string;
  linkClassName?: string;
  variant?: "chrome" | "dark";
};

export function SiteNavLinks({
  className,
  linkClassName,
  variant = "chrome",
}: SiteNavLinksProps) {
  const pathname = usePathname();
  const isChrome = variant === "chrome";

  return (
    <nav className={className}>
      {SITE_NAV_ITEMS.map((item) => {
        const isActive = item.match(pathname);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative inline-flex flex-col items-center font-sans text-[0.7rem] font-normal uppercase tracking-[0.22em] transition-all duration-300",
              isActive
                ? isChrome
                  ? "font-semibold text-brand-blue"
                  : "font-medium text-brand-gold"
                : isChrome
                  ? "text-brand-chrome-muted hover:text-brand-chrome-foreground"
                  : "text-brand-warm hover:text-foreground",
              isActive && isChrome && "rounded-lg bg-brand-blue/[0.08] px-4 py-2.5",
              linkClassName,
            )}
          >
            <span>{item.label}</span>
            {isActive && (
              <span
                aria-hidden
                className={cn(
                  "mt-2 h-0.5 w-full rounded-full",
                  isChrome ? "bg-brand-blue" : "academy-brand-line h-px",
                )}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
