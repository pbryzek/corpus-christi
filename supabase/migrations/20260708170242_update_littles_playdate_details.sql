UPDATE events
SET event_date = '2026-07-11 15:00:00-07',
    time_tbd = false,
    location = 'Dracena Quarry Park',
    event_url = 'https://www.google.com/maps/place/Dracena+Quarry+Park/data=!4m2!3m1!1s0x808f8761df379347:0x437029ce85c1e975?sa=X&ved=1t:155783&ictx=111'
WHERE title ILIKE '%Littles Playdate%'
  AND event_date::date = '2026-07-11';