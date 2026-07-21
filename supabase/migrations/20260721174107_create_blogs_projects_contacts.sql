/*
# Create blogs, projects, and contact_submissions tables

1. Purpose
   Backs the Codraze admin panel and public website:
   - `blogs` — CMS-style blog posts with draft/published status.
   - `projects` — portfolio entries with draft/published status.
   - `contact_submissions` — messages submitted from the public contact form.
   Admin (authenticated via Supabase Auth) has full CRUD; the public (anon) can read
   only published content and can submit contact messages.

2. New Tables
   - `blogs`
     - `id` (uuid, primary key, auto-generated)
     - `title` (text, not null)
     - `slug` (text, unique, not null)
     - `excerpt` (text)
     - `content` (text, markdown body)
     - `cover_image_url` (text)
     - `status` (text, default 'draft', CHECK in ('draft','published'))
     - `created_at` (timestamptz, default now())
     - `updated_at` (timestamptz, default now())
   - `projects`
     - `id` (uuid, primary key, auto-generated)
     - `title` (text, not null)
     - `slug` (text, unique, not null)
     - `description` (text)
     - `cover_image_url` (text)
     - `tech_stack` (text[], default '{}')
     - `project_url` (text)
     - `status` (text, default 'draft', CHECK in ('draft','published'))
     - `created_at` (timestamptz, default now())
   - `contact_submissions`
     - `id` (uuid, primary key, auto-generated)
     - `name` (text, not null)
     - `email` (text, not null)
     - `phone` (text)
     - `message` (text, not null)
     - `created_at` (timestamptz, default now())
     - `is_read` (boolean, default false)

3. Security
   - Enable RLS on all three tables.
   - blogs: anon SELECT only where status='published'; authenticated full CRUD.
   - projects: anon SELECT only where status='published'; authenticated full CRUD.
   - contact_submissions: anon INSERT only; authenticated full CRUD.
   - All policies are split into the four CRUD verbs (no FOR ALL).

4. Notes
   - `updated_at` auto-refreshes via trigger on blogs.
   - Slug uniqueness is enforced at the DB level.
   - The admin logs in via Supabase Auth (email/password); no custom admin table.
*/

-- ===== blogs =====
CREATE TABLE IF NOT EXISTS blogs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text,
  cover_image_url text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_published_blogs" ON blogs;
CREATE POLICY "anon_select_published_blogs" ON blogs FOR SELECT
  TO anon USING (status = 'published');

DROP POLICY IF EXISTS "auth_select_blogs" ON blogs;
CREATE POLICY "auth_select_blogs" ON blogs FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_blogs" ON blogs;
CREATE POLICY "auth_insert_blogs" ON blogs FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_blogs" ON blogs;
CREATE POLICY "auth_update_blogs" ON blogs FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_blogs" ON blogs;
CREATE POLICY "auth_delete_blogs" ON blogs FOR DELETE
  TO authenticated USING (true);

-- auto-update updated_at
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS blogs_updated_at ON blogs;
CREATE TRIGGER blogs_updated_at BEFORE UPDATE ON blogs
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ===== projects =====
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  cover_image_url text,
  tech_stack text[] DEFAULT '{}',
  project_url text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_published_projects" ON projects;
CREATE POLICY "anon_select_published_projects" ON projects FOR SELECT
  TO anon USING (status = 'published');

DROP POLICY IF EXISTS "auth_select_projects" ON projects;
CREATE POLICY "auth_select_projects" ON projects FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_projects" ON projects;
CREATE POLICY "auth_insert_projects" ON projects FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_projects" ON projects;
CREATE POLICY "auth_update_projects" ON projects FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_projects" ON projects;
CREATE POLICY "auth_delete_projects" ON projects FOR DELETE
  TO authenticated USING (true);

-- ===== contact_submissions =====
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  is_read boolean NOT NULL DEFAULT false
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_contacts" ON contact_submissions;
CREATE POLICY "anon_insert_contacts" ON contact_submissions FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_select_contacts" ON contact_submissions;
CREATE POLICY "auth_select_contacts" ON contact_submissions FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_contacts" ON contact_submissions;
CREATE POLICY "auth_update_contacts" ON contact_submissions FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_contacts" ON contact_submissions;
CREATE POLICY "auth_delete_contacts" ON contact_submissions FOR DELETE
  TO authenticated USING (true);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_blogs_status ON blogs(status);
CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON blogs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_is_read ON contact_submissions(is_read);
