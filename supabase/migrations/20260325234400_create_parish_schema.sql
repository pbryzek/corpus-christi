/*
  # Create Corpus Christi Parish Database Schema

  1. New Tables
    - `events` - Mass times and parish events
    - `prayer_intentions` - Prayer requests from parishioners
    - `ministries` - Parish ministries and programs
    - `sacraments` - Sacrament scheduling and information
    - `testimonials` - Parishioner testimonials

  2. Security
    - Enable RLS on all tables
    - Prayer intentions are viewable by authenticated users only
    - All data is publicly readable where appropriate
*/

CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  event_date timestamptz NOT NULL,
  event_type text NOT NULL,
  location text,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS prayer_intentions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  intention_text text NOT NULL,
  submitter_name text NOT NULL,
  submitter_email text NOT NULL,
  is_anonymous boolean DEFAULT false,
  prayed_for boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ministries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  contact_name text,
  contact_email text,
  icon text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sacraments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sacrament_type text NOT NULL,
  description text,
  contact_name text,
  contact_email text,
  contact_phone text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  person_name text NOT NULL,
  testimonial_text text NOT NULL,
  image_url text,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_intentions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ministries ENABLE ROW LEVEL SECURITY;
ALTER TABLE sacraments ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Events are publicly readable"
  ON events FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Prayer intentions can be read by authenticated users"
  ON prayer_intentions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can submit prayer intentions"
  ON prayer_intentions FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Ministries are publicly readable"
  ON ministries FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Sacraments are publicly readable"
  ON sacraments FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Testimonials are publicly readable"
  ON testimonials FOR SELECT
  TO public
  USING (true);

INSERT INTO sacraments (sacrament_type, description, contact_name, contact_email) VALUES
('Baptism', 'Welcome a new life into God''s family', 'Fr. Leo', 'contact@corpuschristicatholic.org'),
('Reconciliation', 'Return to God''s grace and healing', 'Fr. Leo', 'contact@corpuschristicatholic.org'),
('Eucharist', 'First Holy Communion preparation', 'Faith Formation Team', 'formation@corpuschristicatholic.org'),
('Confirmation', 'Strengthen your commitment to Christ', 'Faith Formation Team', 'formation@corpuschristicatholic.org'),
('Marriage', 'Sacramental union before God', 'Fr. Leo', 'contact@corpuschristicatholic.org'),
('Anointing of the Sick', 'Healing and comfort in suffering', 'Fr. Leo', 'contact@corpuschristicatholic.org');

INSERT INTO events (title, description, event_date, event_type, location, is_featured) VALUES
('Saturday Vigil Mass', 'Weekly vigil mass', now() + interval '3 days' - (now()::time), 'Mass', 'Church', true),
('Sunday 8:00am Mass', 'Sunday morning mass', now() + (interval '1 day' - (now()::time)) + interval '8 hours', 'Mass', 'Church', true),
('Sunday 10:30am Mass', 'Sunday late morning mass', now() + (interval '1 day' - (now()::time)) + interval '10.5 hours', 'Mass', 'Church', true);
