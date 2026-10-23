/*
# Create announcements table

Adds a lightweight announcements table used to render a temporary
announcement card in the homepage "Upcoming Events" grid. Admins manage
rows from the existing admin dashboard.

1. New Tables
- `announcements`
  - `id` (uuid, primary key)
  - `title` (text) — bold headline on the card
  - `body` (text) — supporting paragraph
  - `link_url` (text, nullable) — optional CTA URL (internal path like `/living-our-faith` or external https URL)
  - `link_label` (text, nullable) — optional CTA label; defaults to "Learn more" in the UI when a URL is present
  - `is_active` (boolean, default true) — soft on/off toggle
  - `start_at` (timestamptz, nullable) — earliest time the card should appear (null = always)
  - `end_at` (timestamptz, nullable) — latest time the card should appear (null = never expires)
  - `sort_order` (int, default 0) — lower numbers appear first when multiple are active
  - `created_at` / `updated_at` timestamps
2. Security
- Enable RLS on `announcements`.
- Public SELECT limited to rows that are active AND currently within their (optional) start/end window — so inactive or expired announcements are hidden from anonymous visitors.
- INSERT/UPDATE/DELETE restricted to authenticated admin users (only admins can log in to this site).
3. Seed
- Insert the "Welcome Our Stranger has reached 90% of its goal!" Community Care Fund announcement, linked to `/living-our-faith`.
*/

CREATE TABLE IF NOT EXISTS announcements (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  body        text NOT NULL,
  link_url    text,
  link_label  text,
  is_active   boolean NOT NULL DEFAULT true,
  start_at    timestamptz,
  end_at      timestamptz,
  sort_order  int NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "announcements_select_public" ON announcements;
CREATE POLICY "announcements_select_public"
  ON announcements FOR SELECT
  TO anon, authenticated
  USING (
    is_active = true
    AND (start_at IS NULL OR start_at <= now())
    AND (end_at   IS NULL OR end_at   >= now())
  );

DROP POLICY IF EXISTS "announcements_insert_admin" ON announcements;
CREATE POLICY "announcements_insert_admin"
  ON announcements FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "announcements_update_admin" ON announcements;
CREATE POLICY "announcements_update_admin"
  ON announcements FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "announcements_delete_admin" ON announcements;
CREATE POLICY "announcements_delete_admin"
  ON announcements FOR DELETE
  TO authenticated
  USING (true);

-- Seed the first announcement so it appears immediately on the homepage
INSERT INTO announcements (title, body, link_url, link_label, is_active, sort_order)
SELECT
  'Welcome Our Stranger has reached 90% of its goal!',
  'The Living Our Faith committee thanks the Corpus Christi community for your generosity in responding to our appeal for the 2026 Community Care Fund. We have reached almost 90% of our goal and are well positioned to assist the family we''re accompanying on their journey to stability, dignity and hope!',
  '/living-our-faith',
  'Learn more',
  true,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM announcements WHERE title = 'Welcome Our Stranger has reached 90% of its goal!'
);
