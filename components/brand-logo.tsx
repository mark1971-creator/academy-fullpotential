import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  variant?: "default" | "light";
};

export function BrandLogo({ className, variant = "default" }: BrandLogoProps) {
  const isLight = variant === "light";

  return (
    <span className={cn("inline-flex flex-col leading-none", className)}>
      <span
        className={cn(
          "font-heading text-[1.35rem] font-light tracking-[0.02em] sm:text-[1.5rem]",
          isLight ? "text-white" : "text-brand-navy",
        )}
      >
        BEING
      </span>
      <span
        className={cn(
          "font-sans text-[0.6rem] font-normal uppercase tracking-[0.28em] sm:text-[0.65rem]",
          isLight ? "text-white/75" : "text-brand-gold",
        )}
      >
        at Full Potential
      </span>
    </span>
  );
}
