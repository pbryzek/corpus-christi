/*
# Add worship aides to the bulletins table

Lets staff upload weekly worship aides from the admin area alongside bulletins.

1. Modified Tables
- `bulletins`
  - New column `kind` (text, not null, default 'bulletin') - either 'bulletin' or 'worship_aide'.
    Existing rows stay as 'bulletin'.

2. Data
- Seeds the current worship aide (17th Sunday in Ordinary Time, July 26, 2026) that was previously
  hard-coded on the Bulletins page, so it continues to display.

3. Security
- No policy changes. Existing RLS already allows public read and admin-only insert/update/delete.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'bulletins' AND column_name = 'kind'
  ) THEN
    ALTER TABLE bulletins
      ADD COLUMN kind text NOT NULL DEFAULT 'bulletin'
      CHECK (kind IN ('bulletin', 'worship_aide'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS bulletins_kind_date_idx ON bulletins (kind, published_date DESC);

INSERT INTO bulletins (title, published_date, file_url, kind)
SELECT '17th Sunday in Ordinary Time', '2026-07-26', '/17th_Sunday_OT_Year_A_2026_youtube.pdf', 'worship_aide'
WHERE NOT EXISTS (
  SELECT 1 FROM bulletins WHERE kind = 'worship_aide' AND file_url = '/17th_Sunday_OT_Year_A_2026_youtube.pdf'
);