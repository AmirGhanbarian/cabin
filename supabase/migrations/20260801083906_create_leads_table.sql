/*
# Create leads table for RUF kitchen cabinet consultation requests

1. New Tables
- `leads`
  - `id` (uuid, primary key)
  - `name` (text, not null) - the visitor's full name
  - `phone` (text, not null) - the visitor's phone number (the key data we want to capture)
  - `email` (text, nullable) - optional email address
  - `message` (text, nullable) - optional message from the visitor
  - `status` (text, not null, default 'new') - lead status: new, contacted, won
  - `created_at` (timestamptz, default now()) - when the lead was submitted

2. Security
- Enable RLS on `leads`.
- INSERT policy for anon + authenticated: any visitor can submit a new lead (no login required to leave a phone number).
- SELECT policy for authenticated only: only the logged-in admin can view captured leads.
- UPDATE policy for authenticated only: only the logged-in admin can update lead status.
- No DELETE policy: leads are never deleted (data safety).

3. Notes
- Visitors do NOT log in. They submit the form as the anon role.
- The admin logs in with Supabase email/password auth to view and manage leads.
- Phone numbers are never exposed to other visitors - only the admin sees them.
*/

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  message text,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'won')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Visitors can submit a new lead (no login required)
DROP POLICY IF EXISTS "anon_insert_leads" ON leads;
CREATE POLICY "anon_insert_leads" ON leads FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Only the admin (authenticated) can view leads
DROP POLICY IF EXISTS "admin_select_leads" ON leads;
CREATE POLICY "admin_select_leads" ON leads FOR SELECT
  TO authenticated USING (true);

-- Only the admin (authenticated) can update lead status
DROP POLICY IF EXISTS "admin_update_leads" ON leads;
CREATE POLICY "admin_update_leads" ON leads FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- Add index for admin sorting by created_at
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at DESC);