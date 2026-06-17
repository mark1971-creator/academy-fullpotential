import Image from "next/image";
import Link from "next/link";

import { HOME_URL } from "@/lib/clerk/routes";
import { cn } from "@/lib/utils";

const LOGO_SRC = "/Images/Logo-blue.png";

type BrandLogoProps = {
  className?: string;
  variant?: "chrome" | "dark";
  showAcademyBadge?: boolean;
  size?: "default" | "prominent";
};

export function BrandLogo({
  className,
  variant = "chrome",
  showAcademyBadge = false,
  size = "default",
}: BrandLogoProps) {
  const isChrome = variant === "chrome";
  const isProminent = size === "prominent";

  return (
    <span className={cn("inline-flex items-center", className)}>
      {isChrome ? (
        <span
          className={cn(
            "brand-logo-mark shrink-0",
            isProminent
              ? "h-11 w-[8.5rem] sm:h-12 sm:w-[9.25rem]"
              : "h-9 w-[7.4rem] sm:h-10 sm:w-[8.25rem]",
          )}
          role="img"
          aria-label="BEING at Full Potential"
        />
      ) : (
        <Image
          src={LOGO_SRC}
          alt="BEING at Full Potential"
          width={275}
          height={81}
          className={cn("w-auto shrink-0", isProminent ? "h-11 sm:h-12" : "h-9 sm:h-10")}
          priority
          unoptimized
        />
      )}

      {showAcademyBadge && (
        <span
          className={cn(
            "ml-4 hidden items-center gap-3.5 border-l border-brand-chrome-border pl-4 sm:flex",
            isProminent && "ml-5 pl-5",
          )}
        >
          <span
            aria-hidden
            className="size-1.5 shrink-0 rounded-full bg-brand-gold/80"
          />
          <span className="flex flex-col justify-center gap-1">
            <span
              className={cn(
                "font-sans font-semibold uppercase leading-none tracking-[0.28em] text-brand-blue",
                isProminent ? "text-[0.62rem]" : "text-[0.55rem]",
              )}
            >
              Academy
            </span>
            <span
              className={cn(
                "font-sans font-normal leading-none tracking-[0.14em] text-brand-chrome-muted",
                isProminent ? "text-[0.58rem]" : "text-[0.52rem]",
              )}
            >
              Learn &amp; grow
            </span>
          </span>
        </span>
      )}
    </span>
  );
}

export function BrandLogoLink({
  className,
  variant = "chrome",
  showAcademyBadge = false,
  size = "default",
}: BrandLogoProps) {
  return (
    <Link
      href={HOME_URL}
      className={cn("shrink-0 transition-opacity duration-300 hover:opacity-90", className)}
    >
      <BrandLogo variant={variant} showAcademyBadge={showAcademyBadge} size={size} />
    </Link>
  );
}
