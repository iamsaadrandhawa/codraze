/*
# Tighten codraze_leads INSERT policy

1. Purpose
   The previous `anon_insert_leads` policy used `WITH CHECK (true)`, allowing unrestricted
   inserts (any row, any values) for anon and authenticated roles. This replaces it with
   meaningful validation so only well-formed contact submissions are accepted.

2. Changes
   - Drop the existing `anon_insert_leads` policy.
   - Recreate it with a WITH CHECK clause that enforces:
     - `name` is non-empty and at most 200 characters
     - `email` is non-empty, at most 320 characters, and matches a basic email pattern
     - `message` is non-empty and at most 5000 characters
     - `service_interest` is non-empty and at most 100 characters

3. Security
   - RLS remains enabled on `codraze_leads`.
   - Only INSERT is permitted for anon + authenticated (the marketing site has no sign-in).
   - SELECT / UPDATE / DELETE remain blocked for anon/authenticated — leads are private.
   - The WITH CHECK clause now validates field shape so empty/garbage rows are rejected.
*/

DROP POLICY IF EXISTS "anon_insert_leads" ON codraze_leads;

CREATE POLICY "anon_insert_leads" ON codraze_leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(name) BETWEEN 1 AND 200
    AND char_length(email) BETWEEN 1 AND 320
    AND email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND char_length(message) BETWEEN 1 AND 5000
    AND char_length(service_interest) BETWEEN 1 AND 100
  );
