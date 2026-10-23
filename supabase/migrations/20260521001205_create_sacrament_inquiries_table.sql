/*
  # Create sacrament_inquiries table

  1. New Tables
    - `sacrament_inquiries`
      - `id` (uuid, primary key)
      - `first_name` (text, not null)
      - `last_name` (text, not null)
      - `email` (text, not null)
      - `phone` (text, nullable)
      - `sacrament_interest` (text, not null) - one of the six selectable sacraments
      - `message` (text, nullable)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `sacrament_inquiries`
    - Add INSERT policy for anonymous users so unauthenticated visitors can submit inquiries
    - Add SELECT policy for authenticated users only (staff can view submissions)
*/

CREATE TABLE IF NOT EXISTS sacrament_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL DEFAULT '',
  last_name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text,
  sacrament_interest text NOT NULL DEFAULT '',
  message text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sacrament_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a sacrament inquiry"
  ON sacrament_inquiries
  FOR INSERT
  TO anon
  WITH CHECK (
    first_name <> '' AND
    last_name <> '' AND
    email <> '' AND
    sacrament_interest <> ''
  );

CREATE POLICY "Authenticated users can view sacrament inquiries"
  ON sacrament_inquiries
  FOR SELECT
  TO authenticated
  USING (true);
