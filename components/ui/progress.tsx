import { cn } from "@/lib/utils";

type ProgressProps = React.ComponentProps<"div"> & {
  value: number;
  max?: number;
  indicatorClassName?: string;
};

function Progress({
  className,
  value,
  max = 100,
  indicatorClassName,
  ...props
}: ProgressProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      data-slot="progress"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-muted", className)}
      {...props}
    >
      <div
        className={cn(
          "h-full rounded-full bg-gradient-to-r from-brand-teal to-brand-gold transition-all duration-500 ease-out",
          indicatorClassName,
        )}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

export { Progress };
