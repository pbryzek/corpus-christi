ALTER TABLE events ADD COLUMN IF NOT EXISTS flyer_url text;

UPDATE events
SET flyer_url = '/GenXish_Lasting_Faith_Flyer_(3).pdf'
WHERE title ILIKE '%Helping Teens%' OR title ILIKE '%Lasting Faith%' OR title ILIKE '%Keeping the Faith Alive%';
