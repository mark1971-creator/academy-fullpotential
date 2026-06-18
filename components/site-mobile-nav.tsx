"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { SITE_NAV_ITEMS } from "@/lib/site-nav";
import { cn } from "@/lib/utils";

export function SiteMobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-11 shrink-0 text-brand-chrome-foreground hover:bg-slate-100 lg:hidden"
        aria-expanded={open}
        aria-controls="site-mobile-nav"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </Button>

      <button
        type="button"
        aria-label="Close menu"
        tabIndex={open ? 0 : -1}
        className={cn(
          "fixed inset-0 z-40 bg-brand-navy-dark/50 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setOpen(false)}
      />

      <nav
        id="site-mobile-nav"
        aria-hidden={!open}
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-[min(100%,20rem)] flex-col border-l border-brand-chrome-border bg-brand-chrome shadow-2xl transition-transform duration-300 ease-out lg:hidden",
          open ? "translate-x-0" : "pointer-events-none translate-x-full",
        )}
        style={{
          paddingTop: "max(1.25rem, env(safe-area-inset-top))",
          paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))",
        }}
      >
        <div className="flex items-center justify-between border-b border-brand-chrome-border px-5 pb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-blue">
            Menu
          </p>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-11 text-brand-chrome-foreground"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            <X className="size-5" />
          </Button>
        </div>

        <div className="flex flex-1 flex-col gap-1 px-4 py-5">
          {SITE_NAV_ITEMS.map((item) => {
            const isActive = item.match(pathname);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-h-11 items-center rounded-lg px-4 py-3 font-sans text-sm font-medium uppercase tracking-[0.18em] transition-colors",
                  isActive
                    ? "bg-brand-blue/[0.08] text-brand-blue"
                    : "text-brand-chrome-muted hover:bg-slate-50 hover:text-brand-chrome-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
