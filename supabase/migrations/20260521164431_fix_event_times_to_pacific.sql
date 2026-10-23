/*
  # Fix event timestamps to correct Pacific Time

  All event_date and end_time values were stored as UTC but the times were
  entered as Pacific Time wall-clock values without an offset applied.
  This migration reinterprets each timestamp as a Pacific Time local time
  and stores the correct UTC equivalent.

  Strategy: use AT TIME ZONE 'UTC' to strip the tz info, then re-attach
  'America/Los_Angeles' so Postgres converts correctly to UTC.
*/

UPDATE events
SET
  event_date = (event_date AT TIME ZONE 'UTC') AT TIME ZONE 'America/Los_Angeles',
  end_time   = CASE WHEN end_time IS NOT NULL
                 THEN (end_time AT TIME ZONE 'UTC') AT TIME ZONE 'America/Los_Angeles'
                 ELSE NULL
               END;
