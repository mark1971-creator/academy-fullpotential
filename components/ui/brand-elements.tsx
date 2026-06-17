import { cn } from "@/lib/utils";

type PageShellProps = {
  children: React.ReactNode;
  className?: string;
};

export function PageShell({ children, className }: PageShellProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-7xl px-6 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24",
        className,
      )}
    >
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
        <p className="mt-4 text-base leading-relaxed text-brand-warm sm:text-lg">
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
        "academy-card p-8 transition-all duration-300 hover:border-brand-teal/25",
        className,
      )}
    >
      {children}
    </article>
  );
}
