-- Ensure the PostgREST API roles can reach objects in the public schema.
-- Supabase normally applies these grants automatically via default privileges,
-- but this project was missing them (service_role/anon got "permission denied
-- for table ..."). RLS still governs row visibility for anon/authenticated;
-- service_role bypasses RLS. This migration is idempotent.

grant usage on schema public to anon, authenticated, service_role;

grant all on all tables in schema public to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;
grant all on all routines in schema public to anon, authenticated, service_role;

alter default privileges in schema public
  grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public
  grant all on sequences to anon, authenticated, service_role;
alter default privileges in schema public
  grant all on routines to anon, authenticated, service_role;
