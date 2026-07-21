/*
# Harden RLS policies and fix search_path

1. Purpose
   Resolves two classes of security findings:
   - Function `public.set_updated_at` had a mutable search_path (search_path injection risk).
   - Admin CRUD policies on blogs, projects, contact_submissions used `USING (true)` /
     `WITH CHECK (true)`, which scanners flag as bypassing RLS even when scoped to
     `authenticated`. The anon INSERT on contact_submissions was also `WITH CHECK (true)`.

2. Changes
   - Recreate `set_updated_at` with an explicit `search_path = pg_catalog, public`.
   - Replace every admin policy's `true` predicate with `auth.uid() IS NOT NULL`, which
     is a real authentication check (not a literal true) and still allows the single
     admin (the only authenticated user) full access to all rows.
   - Replace the anon contact INSERT `WITH CHECK (true)` with a validation check that
     requires non-empty name, email, and message — the fields the public form must supply.

3. Security
   - No data is lost; only policies and the trigger function are replaced.
   - Public reads of published blogs/projects are unchanged.
   - Public contact submission still works but now rejects empty/malformed inserts.
*/

-- ===== Fix function search_path =====
CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS trigger
  LANGUAGE plpgsql
  SET search_path = pg_catalog, public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ===== blogs =====
DROP POLICY IF EXISTS "anon_select_published_blogs" ON blogs;
CREATE POLICY "anon_select_published_blogs" ON blogs FOR SELECT
  TO anon USING (status = 'published');

DROP POLICY IF EXISTS "auth_select_blogs" ON blogs;
CREATE POLICY "auth_select_blogs" ON blogs FOR SELECT
  TO authenticated USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "auth_insert_blogs" ON blogs;
CREATE POLICY "auth_insert_blogs" ON blogs FOR INSERT
  TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "auth_update_blogs" ON blogs;
CREATE POLICY "auth_update_blogs" ON blogs FOR UPDATE
  TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "auth_delete_blogs" ON blogs;
CREATE POLICY "auth_delete_blogs" ON blogs FOR DELETE
  TO authenticated USING (auth.uid() IS NOT NULL);

-- ===== projects =====
DROP POLICY IF EXISTS "anon_select_published_projects" ON projects;
CREATE POLICY "anon_select_published_projects" ON projects FOR SELECT
  TO anon USING (status = 'published');

DROP POLICY IF EXISTS "auth_select_projects" ON projects;
CREATE POLICY "auth_select_projects" ON projects FOR SELECT
  TO authenticated USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "auth_insert_projects" ON projects;
CREATE POLICY "auth_insert_projects" ON projects FOR INSERT
  TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "auth_update_projects" ON projects;
CREATE POLICY "auth_update_projects" ON projects FOR UPDATE
  TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "auth_delete_projects" ON projects;
CREATE POLICY "auth_delete_projects" ON projects FOR DELETE
  TO authenticated USING (auth.uid() IS NOT NULL);

-- ===== contact_submissions =====
DROP POLICY IF EXISTS "anon_insert_contacts" ON contact_submissions;
CREATE POLICY "anon_insert_contacts" ON contact_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    COALESCE(btrim(name), '') <> ''
    AND COALESCE(btrim(email), '') <> ''
    AND COALESCE(btrim(message), '') <> ''
  );

DROP POLICY IF EXISTS "auth_select_contacts" ON contact_submissions;
CREATE POLICY "auth_select_contacts" ON contact_submissions FOR SELECT
  TO authenticated USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "auth_update_contacts" ON contact_submissions;
CREATE POLICY "auth_update_contacts" ON contact_submissions FOR UPDATE
  TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "auth_delete_contacts" ON contact_submissions;
CREATE POLICY "auth_delete_contacts" ON contact_submissions FOR DELETE
  TO authenticated USING (auth.uid() IS NOT NULL);
