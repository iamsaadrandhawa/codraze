/*
# Create codraze_leads table (single-tenant, no auth)

1. Purpose
   Stores contact form submissions from the Codraze marketing site. Each row is a lead
   containing the visitor's name, email, message, and the service they're interested in.

2. New Tables
   - `codraze_leads`
     - `id` (uuid, primary key, auto-generated)
     - `name` (text, not null) — submitter's name
     - `email` (text, not null) — submitter's email
     - `message` (text, not null) — the message body
     - `service_interest` (text, not null) — selected service category
     - `created_at` (timestamptz, defaults to now) — submission timestamp

3. Security
   - Enable RLS on `codraze_leads`.
   - Allow anon + authenticated INSERT only (public can submit leads).
   - No SELECT/UPDATE/DELETE for anon — leads are private to the admin.
   - This is a single-tenant marketing site with no sign-in, so anon writes are intentional.

4. Notes
   - The frontend uses the anon key, so INSERT must be permitted for the anon role.
   - Leads are read by the project owner via the Supabase dashboard (service role), not the app.
*/

CREATE TABLE IF NOT EXISTS codraze_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  service_interest text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE codraze_leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_leads" ON codraze_leads;
CREATE POLICY "anon_insert_leads" ON codraze_leads FOR INSERT
  TO anon, authenticated WITH CHECK (true);
