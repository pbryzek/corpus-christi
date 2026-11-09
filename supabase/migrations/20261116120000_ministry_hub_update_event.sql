/*
  # Ministry Leaders Hub — "Update a Scheduled Event"

  Both workflow docs name this as its own step, distinct from "Plan a New
  Event": a leader edits an existing request's details (including
  registration/payment links, which existed as columns since
  20261023190000 but never had a write path) and, if it's already on the
  public calendar, that calendar row updates too. Additive.

  A leader has no direct UPDATE right on event_requests once it's past
  draft/submitted/changes_requested (event_requests_update's RLS), so this
  needs a SECURITY DEFINER function — same reasoning as approve_event_request
  and submit_event_wrapup. It does NOT go through the `events` table's own
  (pre-existing, overly loose) "any authenticated user" UPDATE policy either;
  this is the controlled path, consistent with the publish bridge.

  Editing does not re-trigger approval or change status — the doc's "Submit"
  step for an update just propagates the edit and notifies people (dashboard/
  calendar/communications/finance), it doesn't describe a second review.
*/

CREATE OR REPLACE FUNCTION public.update_event_request_details(
  req uuid,
  new_title text,
  new_description text,
  new_starts_at timestamptz,
  new_ends_at timestamptz,
  new_time_tbd boolean,
  new_location text,
  new_registration_url text,
  new_payment_url text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  current_status event_request_status;
  linked_event_id uuid;
BEGIN
  SELECT status, published_event_id INTO current_status, linked_event_id
  FROM event_requests WHERE id = req FOR UPDATE;

  IF current_status IS NULL THEN
    RAISE EXCEPTION 'event request not found' USING ERRCODE = 'no_data_found';
  END IF;

  IF NOT (owns_event_request(req) OR has_role('admin')) THEN
    RAISE EXCEPTION 'not authorized to edit this event' USING ERRCODE = 'insufficient_privilege';
  END IF;

  IF current_status IN ('cancelled', 'closed') THEN
    RAISE EXCEPTION 'a % event cannot be edited', current_status USING ERRCODE = '22023';
  END IF;

  IF trim(coalesce(new_title, '')) = '' THEN
    RAISE EXCEPTION 'title is required' USING ERRCODE = '22023';
  END IF;

  IF new_ends_at IS NOT NULL AND new_ends_at < new_starts_at THEN
    RAISE EXCEPTION 'end time is before start time' USING ERRCODE = '22023';
  END IF;

  UPDATE event_requests SET
    title = new_title,
    description = new_description,
    starts_at = new_starts_at,
    ends_at = new_ends_at,
    time_tbd = new_time_tbd,
    location = new_location,
    registration_url = new_registration_url,
    payment_url = new_payment_url
  WHERE id = req;

  -- "Calendar updated": if this request is already live on the public site,
  -- the edit has to reach that row too, or the two would silently drift.
  IF linked_event_id IS NOT NULL THEN
    UPDATE events SET
      title = new_title,
      description = new_description,
      event_date = new_starts_at,
      end_time = new_ends_at,
      time_tbd = new_time_tbd,
      location = new_location
    WHERE id = linked_event_id;
  END IF;
END $$;

REVOKE EXECUTE ON FUNCTION public.update_event_request_details(
  uuid, text, text, timestamptz, timestamptz, boolean, text, text, text
) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_event_request_details(
  uuid, text, text, timestamptz, timestamptz, boolean, text, text, text
) FROM anon;
GRANT EXECUTE ON FUNCTION public.update_event_request_details(
  uuid, text, text, timestamptz, timestamptz, boolean, text, text, text
) TO authenticated;
