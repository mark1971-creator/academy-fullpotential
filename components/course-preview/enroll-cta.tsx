import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/courses/utils";

type EnrollCtaProps = {
  courseSlug: string;
  price: number;
  isEnrolled: boolean;
};

export function EnrollCta({ courseSlug, price, isEnrolled }: EnrollCtaProps) {
  if (isEnrolled) {
    return (
      <Button
        size="lg"
        variant="gold"
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
      nativeButton={false}
      render={<Link href={`/courses/${courseSlug}/enroll`} />}
    >
      Enroll now — {formatPrice(price)}
    </Button>
  );
}
