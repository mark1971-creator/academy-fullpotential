const keys = [
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  "CLERK_SECRET_KEY",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "STRIPE_SECRET_KEY",
];

for (const key of keys) {
  const val = process.env[key] ?? "";
  console.log(`${key}: ${val.length > 0 ? `set (${val.length})` : "missing"}`);
}
