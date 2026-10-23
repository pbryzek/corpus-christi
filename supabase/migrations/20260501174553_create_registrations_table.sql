/*
  # Create registrations table

  ## Summary
  Stores welcome/contact form submissions from the /registration page.
  New visitors fill out this form to introduce themselves to the parish.

  ## New Tables
  - `registrations`
    - `id` (uuid, primary key)
    - `first_name` (text, required)
    - `last_name` (text, required)
    - `email` (text, required)
    - `phone` (text, optional)
    - `interests` (text, optional) — comma-separated checkbox values
    - `message` (text, optional) — freeform note from visitor
    - `created_at` (timestamptz, auto)

  ## Security
  - RLS enabled; public (anonymous) users may INSERT only
  - No SELECT policy for anon — staff access data via Supabase dashboard or service role
*/

CREATE TABLE IF NOT EXISTS registrations (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL DEFAULT '',
  last_name  text NOT NULL DEFAULT '',
  email      text NOT NULL DEFAULT '',
  phone      text,
  interests  text,
  message    text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a registration"
  ON registrations
  FOR INSERT
  TO anon
  WITH CHECK (true);
