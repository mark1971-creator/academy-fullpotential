import { Sparkles } from "lucide-react";

export function ContentComingSoonBanner() {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-brand-gold/30 bg-brand-gold/10 px-6 py-5">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-gold/20 text-brand-gold">
        <Sparkles className="size-5" />
      </span>
      <div>
        <p className="font-medium text-foreground">Lesson content coming soon</p>
        <p className="mt-1 text-sm leading-relaxed text-brand-warm">
          The curriculum structure is in place. Full lesson materials will appear here as they
          are published.
        </p>
      </div>
    </div>
  );
}
