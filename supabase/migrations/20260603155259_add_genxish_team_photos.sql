/*
  # Add GenX-ish team member photos

  1. Updates
    - Set image_url for each of the 8 GenX-ish team members in page_contacts
    - Photos are stored in /public and referenced by their filenames

  2. Notes
    - This is an UPDATE-only migration; no schema changes
    - No security changes; existing RLS policies still apply
*/

UPDATE page_contacts SET image_url = '/Lisa.jpg'
  WHERE page_slug = 'genxish' AND name = 'Lisa Gros';

UPDATE page_contacts SET image_url = '/Aileen.jpg'
  WHERE page_slug = 'genxish' AND name = 'Aileen Throne';

UPDATE page_contacts SET image_url = '/Dave_K.jpg'
  WHERE page_slug = 'genxish' AND name = 'Dave Kevane';

UPDATE page_contacts SET image_url = '/David_R.jpg'
  WHERE page_slug = 'genxish' AND name = 'David Rolefson';

UPDATE page_contacts SET image_url = '/Francisco.jpg'
  WHERE page_slug = 'genxish' AND name = 'Francisco Dominguez';

UPDATE page_contacts SET image_url = '/Kit.jpg'
  WHERE page_slug = 'genxish' AND name = 'Kit Soo';

UPDATE page_contacts SET image_url = '/Sophia.jpg'
  WHERE page_slug = 'genxish' AND name = 'Sophia Bucheli';

UPDATE page_contacts SET image_url = '/Stannye.jpg'
  WHERE page_slug = 'genxish' AND name = 'Stannye Nelson';
