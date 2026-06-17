import { Users } from "lucide-react";

import { BrandCard } from "@/components/ui/brand-elements";

type WhoThisIsForProps = {
  items: string[];
};

export function WhoThisIsFor({ items }: WhoThisIsForProps) {
  if (items.length === 0) return null;

  return (
    <section>
      <div className="flex items-center gap-4">
        <span className="flex size-11 items-center justify-center rounded-xl bg-brand-teal/15 text-brand-teal">
          <Users className="size-5" />
        </span>
        <h2 className="font-heading text-2xl font-light text-foreground sm:text-3xl">
          Who this is for
        </h2>
      </div>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item}>
            <BrandCard className="h-full border-brand-teal/20 p-7">
              <p className="text-base leading-relaxed text-brand-warm">{item}</p>
            </BrandCard>
          </li>
        ))}
      </ul>
    </section>
  );
}
