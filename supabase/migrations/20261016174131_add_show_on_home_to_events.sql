/*
# Add homepage visibility flag to events

1. Modified Tables
- `events`
  - `show_on_home` (boolean, not null, default true): when false, the event stays on the parish calendar but is left out of the "Upcoming Event" boxes on the homepage.

2. Security
- No policy changes; existing events policies already cover the new column.

3. Notes
1. All existing events default to true, so nothing disappears unexpectedly.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'events' AND column_name = 'show_on_home'
  ) THEN
    ALTER TABLE events ADD COLUMN show_on_home boolean NOT NULL DEFAULT true;
  END IF;
END $$;