-- Split announcement scope so home and Living Our Faith can show different rows.
--
-- Previously both surfaces queried announcements the same way, so whichever row
-- had sort_order 0 appeared in both places. We need the Living Our Faith popup
-- to show the "Welcome Our Stranger" appeal while the home page keeps showing
-- "Final Week: Help Us Sponsor An Additional 100 Children!".
--
-- Add two boolean flags (default true for backward-compatible behavior on
-- existing rows) and re-target the two seed rows.

ALTER TABLE announcements
  ADD COLUMN IF NOT EXISTS show_on_home boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_on_living_faith boolean NOT NULL DEFAULT true;

-- Home keeps the backpack/CityTeam appeal only
UPDATE announcements
SET show_on_home = true,
    show_on_living_faith = false
WHERE title = 'Final Week: Help Us Sponsor An Additional 100 Children!';

-- Living Our Faith popup shows the Welcome Our Stranger appeal only.
-- Reactivate it since it was toggled off when the newer row was added.
UPDATE announcements
SET is_active = true,
    show_on_home = false,
    show_on_living_faith = true
WHERE title = 'Welcome Our Stranger has reached 90% of its goal!';
