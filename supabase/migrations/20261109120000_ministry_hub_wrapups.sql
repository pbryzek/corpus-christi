/*
  # Ministry Leaders Hub — Phase 1, step 5: post-event wrap-ups

  "Post-Event Uploads" in the workflow doc: once an event has happened, the
  leader logs attendance, estimated demographics, photos/videos and lessons
  learned, which closes the event request out. Additive — no existing table,
  column or policy changes.

  1. event_wrapups — one row per event_request (submitted_at stamps when the
     leader actually submitted, not when the row was first touched).
  2. event_wrapup_media — one row per uploaded photo/video.
  3. event-wrapup-media bucket (PRIVATE) — same reasoning as finance-docs:
     these may contain photos of parishioners, including minors, so this is
     never public. Visible to the owner, admin, communications, and to other
     hub members only when the leader explicitly ticks "share with other
     ministries."

  Demographics are deliberately free-form jsonb, not fixed columns: age uses
  keys under_18/18_34/35_54/55_74/75_plus, gender uses male/female/other, all
  optional — leaders are never required to fill these in, and the UI frames
  them as rough estimates, not a census.

  Status transition: submit_event_wrapup() closes the parent event_request.
  A leader has no direct UPDATE right on a published/held row (see
  event_requests_update in 20261023190000), so this has to go through a
  SECURITY DEFINER function — same reasoning as approve_event_request. The
  guard trigger is loosened (CREATE OR REPLACE, not edited in place) to let
  an owner close their own event, since that's a self-service action, unlike
  publish/approve which stay admin-only.
*/

-- ── event_wrapups ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS event_wrapups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_request_id uuid NOT NULL UNIQUE REFERENCES event_requests (id) ON DELETE CASCADE,
  submitted_by uuid NOT NULL REFERENCES auth.users (id) ON DELETE RESTRICT,

  attendance_count integer CHECK (attendance_count IS NULL OR attendance_count >= 0),
  -- {"under_18": n, "18_34": n, "35_54": n, "55_74": n, "75_plus": n}
  demographics_age jsonb,
  -- {"male": n, "female": n, "other": n}
  demographics_gender jsonb,

  what_worked text,
  what_would_change text,
  share_with_other_ministries boolean NOT NULL DEFAULT false,

  submitted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT event_wrapups_age_is_object
    CHECK (demographics_age IS NULL OR jsonb_typeof(demographics_age) = 'object'),
  CONSTRAINT event_wrapups_gender_is_object
    CHECK (demographics_gender IS NULL OR jsonb_typeof(demographics_gender) = 'object')
);

CREATE INDEX IF NOT EXISTS event_wrapups_request_idx ON event_wrapups (event_request_id);

DROP TRIGGER IF EXISTS event_wrapups_set_updated_at ON event_wrapups;
CREATE TRIGGER event_wrapups_set_updated_at
  BEFORE UPDATE ON event_wrapups
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS event_wrapup_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wrapup_id uuid NOT NULL REFERENCES event_wrapups (id) ON DELETE CASCADE,
  storage_path text NOT NULL,
  media_type text NOT NULL CHECK (media_type IN ('photo', 'video')),
  uploaded_by uuid NOT NULL REFERENCES auth.users (id) ON DELETE RESTRICT,
  uploaded_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS event_wrapup_media_parent_idx ON event_wrapup_media (wrapup_id);

-- ── has_any_hub_role() ───────────────────────────────────────────────────────
-- "Any role at all" — used for the "shared with other ministries" visibility
-- rule, which isn't about a specific role, just "someone else in the hub."
CREATE OR REPLACE FUNCTION public.has_any_hub_role()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid());
$$;

REVOKE EXECUTE ON FUNCTION public.has_any_hub_role() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_any_hub_role() FROM anon;
GRANT EXECUTE ON FUNCTION public.has_any_hub_role() TO authenticated;

-- ── Loosen the status guard: an owner may close their own event ─────────────
CREATE OR REPLACE FUNCTION public.event_requests_guard_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
DECLARE
  privileged boolean := has_role('admin') OR has_role('finance');
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    IF NOT privileged
       AND NEW.status NOT IN ('draft', 'submitted', 'cancelled')
       AND NOT (NEW.status = 'closed' AND owns_event_request(NEW.id)) THEN
      RAISE EXCEPTION
        'status % requires the admin or finance role', NEW.status
        USING ERRCODE = 'insufficient_privilege';
    END IF;

    IF NEW.status = 'submitted' AND NEW.submitted_at IS NULL THEN
      NEW.submitted_at = now();
    END IF;
    IF NEW.status = 'approved' AND NEW.approved_at IS NULL THEN
      NEW.approved_at = now();
      NEW.approved_by = auth.uid();
    END IF;
    IF NEW.status = 'closed' AND NEW.closed_at IS NULL THEN
      NEW.closed_at = now();
    END IF;
  END IF;

  RETURN NEW;
END $$;

-- ── submit_event_wrapup() ────────────────────────────────────────────────────
-- The sole write path for event_wrapups (see the RLS comment below for why).
-- Upserts the wrap-up and closes the event in one transaction. Callable while
-- published/held/closed — re-submitting after closing (e.g. to add more
-- photos' worth of text, or correct a number) is allowed; only draft/
-- submitted/approved/changes_requested/cancelled events are refused, since
-- the event hasn't actually happened yet.
CREATE OR REPLACE FUNCTION public.submit_event_wrapup(
  req uuid,
  attendance integer DEFAULT NULL,
  age_demo jsonb DEFAULT NULL,
  gender_demo jsonb DEFAULT NULL,
  worked text DEFAULT NULL,
  would_change text DEFAULT NULL,
  share boolean DEFAULT false
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  current_status event_request_status;
  result_id uuid;
BEGIN
  SELECT status INTO current_status FROM event_requests WHERE id = req FOR UPDATE;
  IF current_status IS NULL THEN
    RAISE EXCEPTION 'event request not found' USING ERRCODE = 'no_data_found';
  END IF;

  IF NOT (owns_event_request(req) OR has_role('admin')) THEN
    RAISE EXCEPTION 'not authorized to submit a wrap-up for this event'
      USING ERRCODE = 'insufficient_privilege';
  END IF;

  IF current_status NOT IN ('published', 'held', 'closed') THEN
    RAISE EXCEPTION 'only a published, held, or closed event can be wrapped up (current status: %)', current_status
      USING ERRCODE = '22023';
  END IF;

  INSERT INTO event_wrapups (
    event_request_id, submitted_by, attendance_count,
    demographics_age, demographics_gender,
    what_worked, what_would_change, share_with_other_ministries,
    submitted_at
  ) VALUES (
    req, auth.uid(), attendance, age_demo, gender_demo, worked, would_change,
    coalesce(share, false), now()
  )
  ON CONFLICT (event_request_id) DO UPDATE SET
    attendance_count = EXCLUDED.attendance_count,
    demographics_age = EXCLUDED.demographics_age,
    demographics_gender = EXCLUDED.demographics_gender,
    what_worked = EXCLUDED.what_worked,
    what_would_change = EXCLUDED.what_would_change,
    share_with_other_ministries = EXCLUDED.share_with_other_ministries,
    submitted_at = now()
  RETURNING id INTO result_id;

  UPDATE event_requests SET status = 'closed' WHERE id = req AND status <> 'closed';

  RETURN result_id;
END $$;

REVOKE EXECUTE ON FUNCTION public.submit_event_wrapup(uuid, integer, jsonb, jsonb, text, text, boolean) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.submit_event_wrapup(uuid, integer, jsonb, jsonb, text, text, boolean) FROM anon;
GRANT EXECUTE ON FUNCTION public.submit_event_wrapup(uuid, integer, jsonb, jsonb, text, text, boolean) TO authenticated;

-- ── RLS ──────────────────────────────────────────────────────────────────────
ALTER TABLE event_wrapups       ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_wrapup_media  ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS event_wrapups_select ON event_wrapups;
CREATE POLICY event_wrapups_select ON event_wrapups
  FOR SELECT TO authenticated
  USING (
    owns_event_request(event_request_id)
    OR has_role('admin') OR has_role('communications')
    OR (share_with_other_ministries AND has_any_hub_role())
  );

-- No INSERT/UPDATE policy on purpose: every write goes through
-- submit_event_wrapup(), which is the only thing that may also flip the
-- parent event_request to 'closed'. A direct client insert would create a
-- wrap-up without ever closing the event it belongs to.
DROP POLICY IF EXISTS event_wrapups_delete ON event_wrapups;
CREATE POLICY event_wrapups_delete ON event_wrapups
  FOR DELETE TO authenticated
  USING (has_role('admin'));

DROP POLICY IF EXISTS event_wrapup_media_select ON event_wrapup_media;
CREATE POLICY event_wrapup_media_select ON event_wrapup_media
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM event_wrapups w
      WHERE w.id = wrapup_id
        AND (
          owns_event_request(w.event_request_id)
          OR has_role('admin') OR has_role('communications')
          OR (w.share_with_other_ministries AND has_any_hub_role())
        )
    )
  );

DROP POLICY IF EXISTS event_wrapup_media_insert ON event_wrapup_media;
CREATE POLICY event_wrapup_media_insert ON event_wrapup_media
  FOR INSERT TO authenticated
  WITH CHECK (
    uploaded_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM event_wrapups w
      WHERE w.id = wrapup_id AND (owns_event_request(w.event_request_id) OR has_role('admin'))
    )
  );

DROP POLICY IF EXISTS event_wrapup_media_delete ON event_wrapup_media;
CREATE POLICY event_wrapup_media_delete ON event_wrapup_media
  FOR DELETE TO authenticated
  USING (
    has_role('admin')
    OR (uploaded_by = auth.uid() AND EXISTS (
          SELECT 1 FROM event_wrapups w WHERE w.id = wrapup_id AND owns_event_request(w.event_request_id)))
  );

-- ── event-wrapup-media bucket (private) ──────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-wrapup-media', 'event-wrapup-media', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "wrapup_media_read" ON storage.objects;
CREATE POLICY "wrapup_media_read"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'event-wrapup-media'
    AND (
      owner = auth.uid()
      OR has_role('admin') OR has_role('communications')
      OR EXISTS (
        SELECT 1 FROM event_wrapup_media m
        JOIN event_wrapups w ON w.id = m.wrapup_id
        WHERE m.storage_path = name AND w.share_with_other_ministries AND has_any_hub_role()
      )
    )
  );

DROP POLICY IF EXISTS "wrapup_media_insert" ON storage.objects;
CREATE POLICY "wrapup_media_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'event-wrapup-media' AND owner = auth.uid());

DROP POLICY IF EXISTS "wrapup_media_update" ON storage.objects;
CREATE POLICY "wrapup_media_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'event-wrapup-media' AND (owner = auth.uid() OR has_role('admin')))
  WITH CHECK (bucket_id = 'event-wrapup-media' AND (owner = auth.uid() OR has_role('admin')));

DROP POLICY IF EXISTS "wrapup_media_delete" ON storage.objects;
CREATE POLICY "wrapup_media_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'event-wrapup-media' AND (owner = auth.uid() OR has_role('admin')));
