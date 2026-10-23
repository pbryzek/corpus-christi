
-- Fix recurring mass times so they display correctly in Pacific Time.
-- The times were stored as UTC wall-clock values (missing the PDT offset).
-- Correct UTC equivalents (PDT = UTC-7):
--   Saturday Vigil  5:00pm PT = 00:00 UTC (next day) — keep date as-is, just fix hour
--   Sunday Morning  8:00am PT = 15:00 UTC
--   Sunday Mid      10:30am PT = 17:30 UTC

UPDATE events
SET event_date = (event_date::date || ' 15:00:00+00')::timestamptz
WHERE title = 'Sunday Morning Mass' AND recurrence = 'weekly-sun';

UPDATE events
SET event_date = (event_date::date || ' 17:30:00+00')::timestamptz
WHERE title = 'Sunday Mid Morning Mass' AND recurrence = 'weekly-sun';

-- Saturday Vigil: currently 2026-05-24 00:00 UTC = May 23 5pm PT (one day early).
-- Advance the date by 1 day so it lands on a Saturday at 5pm PT.
UPDATE events
SET event_date = (event_date + interval '1 day')
WHERE title = 'Saturday Vigil Mass' AND recurrence = 'weekly-sat';
