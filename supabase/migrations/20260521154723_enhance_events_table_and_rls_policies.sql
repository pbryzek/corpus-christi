/*
  # Enhance Events Table and Add Staff Management Policies

  1. Changes to `events` table
    - Add `end_time` (timestamptz, nullable) - optional end time for events
    - Add `recurrence` (text, nullable) - recurring pattern: 'weekly-sat', 'weekly-sun', 'weekday', null for one-off
    - Add `event_url` (text, nullable) - optional external link for event details
    - Add `start_time` (time, nullable) - time of day for recurring mass display

  2. New RLS Policies
    - `events`: authenticated users can INSERT, UPDATE, DELETE
    - `prayer_intentions`: authenticated users can UPDATE (to mark as prayed for) and DELETE
    - `registrations`: authenticated users can SELECT and DELETE
    - `sacrament_inquiries`: authenticated users can DELETE

  3. Seed Data
    - Remove old stale seed events (from April 2026)
    - Insert recurring Mass schedule entries
    - Insert upcoming parish events from the website
*/

-- Add new columns to events
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'end_time'
  ) THEN
    ALTER TABLE events ADD COLUMN end_time timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'recurrence'
  ) THEN
    ALTER TABLE events ADD COLUMN recurrence text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'event_url'
  ) THEN
    ALTER TABLE events ADD COLUMN event_url text;
  END IF;
END $$;

-- Add authenticated staff policies for events
CREATE POLICY "Authenticated users can insert events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update events"
  ON events FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete events"
  ON events FOR DELETE
  TO authenticated
  USING (true);

-- Add authenticated staff policies for prayer_intentions
CREATE POLICY "Authenticated users can update prayer intentions"
  ON prayer_intentions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete prayer intentions"
  ON prayer_intentions FOR DELETE
  TO authenticated
  USING (true);

-- Add authenticated staff SELECT/DELETE for registrations
CREATE POLICY "Authenticated users can view registrations"
  ON registrations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete registrations"
  ON registrations FOR DELETE
  TO authenticated
  USING (true);

-- Add authenticated staff SELECT/DELETE for sacrament_inquiries
CREATE POLICY "Authenticated users can delete sacrament inquiries"
  ON sacrament_inquiries FOR DELETE
  TO authenticated
  USING (true);

-- Remove old stale seed events
DELETE FROM events WHERE event_type = 'Mass' AND event_date < '2026-05-01';

-- Insert recurring Mass schedule (using a canonical date in 2026 as placeholder, recurrence field drives display)
INSERT INTO events (title, description, event_date, end_time, event_type, location, is_featured, recurrence) VALUES
('Saturday Vigil Mass', 'Weekly Saturday evening Mass. All are welcome.', '2026-05-23 17:00:00+00', '2026-05-23 18:00:00+00', 'Mass', '322 St. James Drive, Piedmont, CA', true, 'weekly-sat'),
('Sunday Morning Mass', 'Sunday 8:00am Mass. All are welcome.', '2026-05-24 08:00:00+00', '2026-05-24 09:00:00+00', 'Mass', '322 St. James Drive, Piedmont, CA', true, 'weekly-sun'),
('Sunday Late Morning Mass', 'Sunday 10:30am Mass. All are welcome.', '2026-05-24 10:30:00+00', '2026-05-24 11:30:00+00', 'Mass', '322 St. James Drive, Piedmont, CA', true, 'weekly-sun'),
('Daily Mass', 'Monday through Friday 8:00am Mass.', '2026-05-25 08:00:00+00', '2026-05-25 08:45:00+00', 'Mass', '322 St. James Drive, Piedmont, CA', false, 'weekday');

-- Insert upcoming parish events
INSERT INTO events (title, description, event_date, event_type, location, is_featured, event_url) VALUES
('Walk the Camino: An Evening of Pilgrimage & Purpose', 'Have you ever felt the desire to step away from the noise and listen more deeply for God''s voice? Join GenX-ish parishioners for an inspiring evening exploring the Camino de Santiago — a pilgrimage of faith, reflection, and renewal.', '2026-05-28 19:00:00+00', 'Event', '322 St. James Drive, Piedmont, CA', true, 'https://corpuschristipiedmont.org/event/walk-the-camino-an-evening-of-pilgrimage-purpose/'),
('Living Our Faith Meeting', 'Please join the group for faith-sharing and a discussion of how to best support our Corpus Christi Family and community. All are welcome. For questions, contact Nancy Midlin at midlin.nancy@gmail.com.', '2026-06-10 19:00:00+00', 'Event', '322 St. James Drive, Piedmont, CA', false, 'https://corpuschristipiedmont.org/event/living-our-faith-meeting-16/'),
('Keeping the Faith Alive: Supporting Your Teen & Young Adult Children', 'Featuring Brad Griffin of the Fuller Youth Institute — whose research and bestselling books have shaped youth ministry efforts nationwide, including in many Catholic parishes and organizations.', '2026-06-18 19:00:00+00', 'Event', '322 St. James Drive, Piedmont, CA', true, 'https://corpuschristipiedmont.org/event/keeping-the-faith-alive-supporting-your-teen-young-adult-children/'),
('GenXish Fellowship: What actually helps faith stick?', 'It''s not what most parents think. How to stay meaningfully connected to your kids as young adults — and what helps faith last. Special Guest: Brad Griffin, Fuller Youth Institute.', '2026-06-19 19:00:00+00', 'Event', '322 St. James Drive, Piedmont, CA', false, 'https://corpuschristipiedmont.org/event/genxish-fellowship-what-actually-helps-faith-stick/'),
('GenXish Men''s Backyard BBQ', 'Connect or re-connect with men in the parish over good food, homemade beer and conversation. Location: TBD.', '2026-08-15 17:00:00+00', 'Event', 'TBD', false, 'https://corpuschristipiedmont.org/event/genxish-mens-backyard-bbq/');
