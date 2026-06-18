import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/courses/utils";
import { cn } from "@/lib/utils";

type EnrollCtaProps = {
  courseSlug: string;
  price: number;
  isEnrolled: boolean;
  className?: string;
};

export function EnrollCta({ courseSlug, price, isEnrolled, className }: EnrollCtaProps) {
  if (isEnrolled) {
    return (
      <Button
        size="lg"
        variant="gold"
        className={cn("w-full whitespace-normal sm:w-auto sm:whitespace-nowrap", className)}
        nativeButton={false}
        render={<Link href={`/my-courses/${courseSlug}`} />}
      >
        Continue learning
        <ArrowRight className="size-4" />
      </Button>
    );
  }

  return (
    <Button
      size="lg"
      variant="gold"
      className={cn("w-full whitespace-normal sm:w-auto sm:whitespace-nowrap", className)}
      nativeButton={false}
      render={<Link href={`/courses/${courseSlug}/enroll`} />}
    >
      <span className="text-center leading-snug">
        Enroll now
        <span className="hidden sm:inline"> — </span>
        <span className="block sm:inline">{formatPrice(price)}</span>
      </span>
    </Button>
  );
}
