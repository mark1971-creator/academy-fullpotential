type PaymentSuccessBannerProps = {
  show: boolean;
};

export function PaymentSuccessBanner({ show }: PaymentSuccessBannerProps) {
  if (!show) return null;

  return (
    <div className="mb-10 rounded-xl border border-brand-teal/35 bg-brand-teal/10 px-6 py-5 text-sm text-foreground">
      <p className="font-medium">Payment successful — welcome to your program.</p>
      <p className="mt-1 text-brand-warm">
        Your progress will be saved as you complete each lesson.
      </p>
    </div>
  );
}
