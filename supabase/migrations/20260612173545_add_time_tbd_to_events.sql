ALTER TABLE events ADD COLUMN IF NOT EXISTS time_tbd boolean NOT NULL DEFAULT false;

UPDATE events SET time_tbd = true WHERE id = 'ebeabeaa-ac80-4a1f-a313-4546a8997724';