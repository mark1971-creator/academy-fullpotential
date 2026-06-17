type EnrollStatusBannerProps = {
  payment?: string;
  enrollError?: string;
};

const ERROR_MESSAGES: Record<string, string> = {
  payment_unavailable:
    "Online payment is not configured yet. Please try again later or contact us to enroll.",
  checkout_failed: "We could not start checkout. Please try again.",
  enroll_failed: "Enrollment could not be completed. Please try again.",
};

export function EnrollStatusBanner({ payment, enrollError }: EnrollStatusBannerProps) {
  if (payment === "cancelled") {
    return (
      <div className="mb-10 rounded-xl border border-border bg-brand-surface px-5 py-4 text-sm text-brand-warm">
        Payment was cancelled. You can enroll again whenever you are ready.
      </div>
    );
  }

  if (!enrollError) {
    return null;
  }

  const message =
    ERROR_MESSAGES[enrollError] ??
    (enrollError.length < 120 ? enrollError : ERROR_MESSAGES.enroll_failed);

  return (
    <div className="mb-8 rounded-xl border border-destructive/30 bg-destructive/5 px-5 py-4 text-sm text-destructive">
      {message}
    </div>
  );
}
