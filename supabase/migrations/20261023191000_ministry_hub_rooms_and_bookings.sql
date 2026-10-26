/*
  # Ministry Leaders Hub — Phase 1, step 2: rooms and room bookings

  "Reserve Calendar/Room" in the workflow. Additive; nothing existing changes.

  1. rooms
     The bookable spaces. Seeded empty — the parish must enter its own rooms;
     fabricating them would put wrong names in front of ministry leaders.

  2. room_bookings
     A booking belongs to an event_request. Double-booking is prevented by an
     EXCLUSION constraint rather than application logic, so two leaders
     submitting at the same moment cannot both win. Released bookings are
     excluded from the check so a cancelled slot frees up immediately.

  3. Shared helper
     `owns_event_request()` answers "is this request mine, or my ministry's?".
     It is SECURITY INVOKER: the ownership predicate inside it is what confines
     the result, and RLS on event_requests can only narrow that further, never
     widen it. Reused by steps 3 and 4.
*/

-- Needed for an EXCLUSION constraint mixing uuid equality with range overlap.
CREATE EXTENSION IF NOT EXISTS btree_gist WITH SCHEMA extensions;

-- ── Shared ownership helper ──────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.owns_event_request(req uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM event_requests r
    WHERE r.id = req
      AND (r.created_by = auth.uid() OR leads_ministry(r.ministry_id))
  );
$$;

REVOKE EXECUTE ON FUNCTION public.owns_event_request(uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.owns_event_request(uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.owns_event_request(uuid) TO authenticated;

-- ── rooms ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  capacity integer CHECK (capacity IS NULL OR capacity > 0),
  notes text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

-- Any signed-in user needs the room list to request one; only admins maintain it.
DROP POLICY IF EXISTS rooms_select_authenticated ON rooms;
CREATE POLICY rooms_select_authenticated ON rooms
  FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS rooms_write_admin ON rooms;
CREATE POLICY rooms_write_admin ON rooms
  FOR ALL TO authenticated
  USING (has_role('admin'))
  WITH CHECK (has_role('admin'));

-- ── room_bookings ────────────────────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'room_booking_status') THEN
    CREATE TYPE room_booking_status AS ENUM ('requested', 'confirmed', 'released');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS room_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES rooms (id) ON DELETE RESTRICT,
  event_request_id uuid NOT NULL REFERENCES event_requests (id) ON DELETE CASCADE,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  status room_booking_status NOT NULL DEFAULT 'requested',
  setup_notes text,
  created_by uuid NOT NULL REFERENCES auth.users (id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT room_bookings_ends_after_starts CHECK (ends_at > starts_at)
);

CREATE INDEX IF NOT EXISTS room_bookings_room_idx    ON room_bookings (room_id, starts_at);
CREATE INDEX IF NOT EXISTS room_bookings_request_idx ON room_bookings (event_request_id);

-- No two live bookings may overlap in the same room.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'room_bookings_no_overlap'
  ) THEN
    ALTER TABLE room_bookings ADD CONSTRAINT room_bookings_no_overlap
      EXCLUDE USING gist (
        room_id WITH =,
        tstzrange(starts_at, ends_at) WITH &&
      ) WHERE (status <> 'released');
  END IF;
END $$;

DROP TRIGGER IF EXISTS room_bookings_set_updated_at ON room_bookings;
CREATE TRIGGER room_bookings_set_updated_at
  BEFORE UPDATE ON room_bookings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Only admins may confirm a booking; leaders request and may release their own.
CREATE OR REPLACE FUNCTION public.room_bookings_guard_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status
     AND NEW.status = 'confirmed'
     AND NOT has_role('admin') THEN
    RAISE EXCEPTION 'confirming a room booking requires the admin role'
      USING ERRCODE = 'insufficient_privilege';
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS room_bookings_guard_status ON room_bookings;
CREATE TRIGGER room_bookings_guard_status
  BEFORE UPDATE ON room_bookings
  FOR EACH ROW EXECUTE FUNCTION public.room_bookings_guard_status();

ALTER TABLE room_bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS room_bookings_select ON room_bookings;
CREATE POLICY room_bookings_select ON room_bookings
  FOR SELECT TO authenticated
  USING (
    has_role('admin')
    OR has_role('communications')
    OR owns_event_request(event_request_id)
  );

DROP POLICY IF EXISTS room_bookings_insert ON room_bookings;
CREATE POLICY room_bookings_insert ON room_bookings
  FOR INSERT TO authenticated
  WITH CHECK (
    created_by = auth.uid()
    AND (has_role('admin') OR owns_event_request(event_request_id))
  );

DROP POLICY IF EXISTS room_bookings_update ON room_bookings;
CREATE POLICY room_bookings_update ON room_bookings
  FOR UPDATE TO authenticated
  USING (has_role('admin') OR owns_event_request(event_request_id))
  WITH CHECK (has_role('admin') OR owns_event_request(event_request_id));

DROP POLICY IF EXISTS room_bookings_delete ON room_bookings;
CREATE POLICY room_bookings_delete ON room_bookings
  FOR DELETE TO authenticated
  USING (has_role('admin') OR owns_event_request(event_request_id));
