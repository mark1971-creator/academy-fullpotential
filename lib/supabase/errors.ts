import { unstable_rethrow } from "next/navigation";

/**
 * Detects when an error is a network/connectivity failure (e.g. the Supabase
 * host can't be reached) rather than a query/permission error. Supabase-js
 * surfaces these as "TypeError: fetch failed", or with DNS/socket error codes.
 */
export function isConnectivityError(error: unknown): boolean {
  if (error == null || typeof error !== "object") return false;

  const candidate = error as {
    message?: unknown;
    code?: unknown;
    cause?: unknown;
  };

  const haystack = [candidate.message, candidate.code]
    .filter((value): value is string => typeof value === "string")
    .join(" ")
    .toLowerCase();

  if (
    /fetch failed|failed to fetch|network|enotfound|econnrefused|econnreset|getaddrinfo|eai_again|und_err|socket|timeout|terminated/.test(
      haystack,
    )
  ) {
    return true;
  }

  if (candidate.cause && candidate.cause !== error) {
    return isConnectivityError(candidate.cause);
  }

  return false;
}

/**
 * Error handling for non-critical reads that should degrade to a safe default
 * (e.g. `[]`, `null`, `false`) instead of throwing.
 *
 * - Re-throws Next.js internal control-flow signals (dynamic rendering, redirect,
 *   notFound) untouched via `unstable_rethrow`.
 * - Treats connectivity failures as an expected dev condition: logs a single
 *   concise `console.warn` (no stack-trace spam) and returns the default.
 * - Logs genuinely unexpected errors with `console.error` and returns the default.
 */
export function resolveSafeDefault<T>(label: string, error: unknown, fallback: T): T {
  unstable_rethrow(error);

  if (isConnectivityError(error)) {
    console.warn(
      `[${label}] Supabase is unreachable — returning a safe default. ` +
        `Verify NEXT_PUBLIC_SUPABASE_URL points to an existing, running project and that the keys are correct.`,
    );
    return fallback;
  }

  console.error(`[${label}]`, error instanceof Error ? error.message : String(error));
  return fallback;
}
