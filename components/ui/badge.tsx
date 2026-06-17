import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-brand-teal text-brand-charcoal",
        secondary: "border-transparent bg-brand-surface-elevated text-foreground",
        outline: "border-border text-foreground",
        gold: "border-brand-gold/40 bg-brand-gold/20 font-semibold text-brand-gold",
        muted: "border-border/60 bg-brand-surface-elevated text-brand-warm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
