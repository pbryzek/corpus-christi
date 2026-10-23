/*
# Add image_url column to announcements

1. Modified Tables
   - `announcements`
     - Added `image_url` (text, nullable) - URL for a background image on the announcement card

2. Important Notes
   - Existing announcements will have NULL image_url (no background image)
   - Column is optional; cards without an image_url display as before
*/

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'announcements' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE announcements ADD COLUMN image_url text;
  END IF;
END $$;
