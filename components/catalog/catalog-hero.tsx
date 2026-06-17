type CatalogHeroProps = {
  eyebrow?: string;
  title: string;
  description: string;
};

export function CatalogHero({
  eyebrow = "Academy",
  title,
  description,
}: CatalogHeroProps) {
  return (
    <header className="relative max-w-4xl pb-2">
      <div aria-hidden className="mb-6 h-px w-16 academy-gold-line opacity-80" />

      <p className="text-xs font-semibold uppercase tracking-[0.36em] text-brand-gold">
        {eyebrow}
      </p>

      <h1 className="mt-6 font-heading text-[2.75rem] font-light leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-[4rem]">
        {title}
      </h1>

      <p className="mt-8 max-w-2xl text-base leading-relaxed text-brand-warm-soft sm:text-lg">
        {description}
      </p>
    </header>
  );
}
