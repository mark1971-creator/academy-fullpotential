import { CheckCircle2 } from "lucide-react";

type OutcomesSectionProps = {
  outcomes: string[];
};

export function OutcomesSection({ outcomes }: OutcomesSectionProps) {
  if (outcomes.length === 0) return null;

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-brand-surface/80 px-7 py-9 sm:px-9 lg:px-11 lg:py-11">
      <h2 className="font-heading text-2xl font-light text-foreground sm:text-3xl">
        What you will learn
      </h2>
      <ul className="mt-8 grid gap-5 sm:grid-cols-2">
        {outcomes.map((item) => (
          <li key={item} className="flex items-start gap-3 text-sm leading-relaxed sm:text-base">
            <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-teal/15 text-brand-teal">
              <CheckCircle2 className="size-3.5" />
            </span>
            <span className="text-brand-warm">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
