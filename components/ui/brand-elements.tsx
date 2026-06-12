import { cn } from "@/lib/utils";

type PageShellProps = {
  children: React.ReactNode;
  className?: string;
};

export function PageShell({ children, className }: PageShellProps) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-6 py-12 sm:py-16 lg:py-20", className)}>
      {children}
    </div>
  );
}

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <p className="font-sans text-xs font-medium uppercase tracking-[0.28em] text-brand-gold">
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "font-heading text-3xl font-light tracking-tight text-foreground sm:text-4xl lg:text-5xl",
          eyebrow && "mt-3",
        )}
      >
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}

type BrandCardProps = {
  children: React.ReactNode;
  className?: string;
};

export function BrandCard({ children, className }: BrandCardProps) {
  return (
    <article
      className={cn(
        "rounded-sm border border-border/80 bg-card p-8 shadow-[0_18px_50px_-30px_rgba(14,26,58,0.25)] transition-shadow duration-300 hover:shadow-[0_24px_60px_-28px_rgba(14,26,58,0.3)]",
        className,
      )}
    >
      {children}
    </article>
  );
}
