/*
  # Ministry Leaders Hub — step 5: the publish bridge

  Approval is the one place the hub writes to the PUBLIC site, so it gets a
  single controlled entry point instead of client-side logic. Additive: no
  existing table, column or policy is modified.

  Why a function and not a couple of client calls:

  1. Atomicity. Inserting into `events` and marking the request published must
     both happen or neither. Two round trips from the browser can leave a
     published event with the request still sitting in the approval queue, or a
     request marked published with no event on the calendar.

  2. Authorization. `events` has carried an INSERT policy of
     `auth.uid() IS NOT NULL` since 20260521155743, so ANY signed-in user can
     already write to the public calendar. Ministry leaders are signed-in users.
     Tightening that policy would change existing behaviour the admin UI depends
     on, so instead this is the only path the hub offers, and it demands the
     admin role. The loose policy is pre-existing and worth revisiting
     separately.

  3. Idempotence. `published_event_id` is checked first, so a double-clicked
     Approve button cannot create two calendar entries.

  SECURITY DEFINER is required: the function must insert into `events` and
  update a request regardless of the caller's own RLS reach. `auth.uid()` still
  resolves to the caller inside it (it reads the request.jwt.claims GUC, which
  is unaffected by the role switch), so has_role('admin') is a real check on the
  person clicking, not on the function owner.
*/

CREATE OR REPLACE FUNCTION public.approve_event_request(req uuid, notes text DEFAULT NULL)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  r             event_requests;
  new_event_id  uuid;
BEGIN
  IF NOT has_role('admin') THEN
    RAISE EXCEPTION 'approving an event request requires the admin role'
      USING ERRCODE = 'insufficient_privilege';
  END IF;

  -- FOR UPDATE: two admins approving at the same moment serialise here.
  SELECT * INTO r FROM event_requests WHERE id = req FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'event request % not found', req
      USING ERRCODE = 'no_data_found';
  END IF;

  IF r.published_event_id IS NOT NULL THEN
    RAISE EXCEPTION 'request % is already on the calendar as event %',
      req, r.published_event_id
      USING ERRCODE = 'unique_violation';
  END IF;

  IF r.status NOT IN ('submitted', 'changes_requested', 'approved') THEN
    RAISE EXCEPTION 'a request with status % cannot be published', r.status
      USING ERRCODE = 'invalid_parameter_value';
  END IF;

  -- Copy onto the public calendar. event_requests mirrors the shape of events
  -- on purpose; 'Event' matches the value the admin UI uses for parish events.
  INSERT INTO events (
    title, description, event_date, end_time, event_type,
    location, recurrence, show_on_home, time_tbd, contact_email, event_url
  )
  VALUES (
    r.title, r.description, r.starts_at, r.ends_at, 'Event',
    r.location, r.recurrence, r.show_on_home, r.time_tbd,
    r.contact_email, r.registration_url
  )
  RETURNING id INTO new_event_id;

  UPDATE event_requests
  SET status             = 'published',
      published_event_id = new_event_id,
      approved_at        = COALESCE(approved_at, now()),
      approved_by        = COALESCE(approved_by, auth.uid()),
      review_notes       = COALESCE(notes, review_notes)
  WHERE id = req;

  RETURN new_event_id;
END $$;

REVOKE EXECUTE ON FUNCTION public.approve_event_request(uuid, text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.approve_event_request(uuid, text) FROM anon;
GRANT  EXECUTE ON FUNCTION public.approve_event_request(uuid, text) TO authenticated;

/*
  Withdrawing a published request removes the calendar entry again. Separate
  function so the dangerous direction is explicit at the call site rather than
  a flag on approve().
*/
CREATE OR REPLACE FUNCTION public.unpublish_event_request(req uuid, notes text DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  r event_requests;
BEGIN
  IF NOT has_role('admin') THEN
    RAISE EXCEPTION 'withdrawing an event request requires the admin role'
      USING ERRCODE = 'insufficient_privilege';
  END IF;

  SELECT * INTO r FROM event_requests WHERE id = req FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'event request % not found', req
      USING ERRCODE = 'no_data_found';
  END IF;

  -- Clear the link before deleting so the FK's ON DELETE SET NULL is never the
  -- thing doing it; the intent should be visible in this function, not inferred.
  UPDATE event_requests
  SET status             = 'changes_requested',
      published_event_id = NULL,
      review_notes       = COALESCE(notes, review_notes)
  WHERE id = req;

  IF r.published_event_id IS NOT NULL THEN
    DELETE FROM events WHERE id = r.published_event_id;
  END IF;
END $$;

REVOKE EXECUTE ON FUNCTION public.unpublish_event_request(uuid, text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.unpublish_event_request(uuid, text) FROM anon;
GRANT  EXECUTE ON FUNCTION public.unpublish_event_request(uuid, text) TO authenticated;
