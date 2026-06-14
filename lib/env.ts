function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function hasSupabaseConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function hasSupabaseAdminConfig() {
  return hasSupabaseConfig() && Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function getSupabaseUrl() {
  return required("NEXT_PUBLIC_SUPABASE_URL");
}

export function getSupabaseAnonKey() {
  return required("NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

export function getSupabaseServiceRoleKey() {
  return required("SUPABASE_SERVICE_ROLE_KEY");
}

/**
 * Whether to fall back to local fixture data when Supabase is unreachable.
 *
 * Enabled in development by default so the UI keeps working without a live DB.
 * Never enabled in production unless `NEXT_PUBLIC_USE_LOCAL_DATA=true` is set
 * explicitly. Set `NEXT_PUBLIC_USE_LOCAL_DATA=false` to opt out in development.
 */
export function shouldUseLocalDataFallback() {
  const flag = process.env.NEXT_PUBLIC_USE_LOCAL_DATA;
  if (flag === "true") return true;
  if (flag === "false") return false;
  return process.env.NODE_ENV !== "production";
}
