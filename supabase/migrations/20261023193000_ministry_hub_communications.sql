/*
  # Ministry Leaders Hub — Phase 1, step 4: communications requests and toolkit

  "Communications request" and "Communications Toolkit available throughout
  workflow" in the workflow. Additive.

  1. communications_requests
     What a ministry leader wants promoted, and where. `channels` is an array of
     the existing parish channels listed under "Existing Tools"; the future ones
     (social media, mobile app, text messaging) are included in the enum so
     adding them later needs no migration.

     Multiple rows per event are allowed on purpose: a second push closer to the
     date is a new request, not an edit of the old one. The dashboard reads the
     most recent per event.

  2. communications_toolkit
     The templates/instructions/checklist content, editable by the comms team
     and readable by every signed-in leader. Content only, no workflow.

  3. Visibility
     The communications role sees every request but NOT budgets or
     reimbursements (step 3 withholds those). Leaders see only their own
     ministry's. Nothing here is readable by anon.
*/

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'comms_channel') THEN
    CREATE TYPE comms_channel AS ENUM (
      'bulletin', 'weekly_email', 'pulpit_announcement', 'website',
      'flyer', 'qr_code', 'signup_form', 'social_media', 'text_message', 'mobile_app'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'comms_status') THEN
    CREATE TYPE comms_status AS ENUM (
      'draft', 'requested', 'in_progress', 'scheduled', 'published', 'declined'
    );
  END IF;
END $$;

-- ── communications_requests ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS communications_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_request_id uuid NOT NULL REFERENCES event_requests (id) ON DELETE CASCADE,
  requested_by uuid NOT NULL REFERENCES auth.users (id) ON DELETE RESTRICT,

  channels comms_channel[] NOT NULL DEFAULT '{}',
  headline text NOT NULL,
  body_copy text,
  call_to_action text,
  image_url text,
  -- Deadline the leader needs it live by (bulletin cut-offs etc).
  needed_by date,

  status comms_status NOT NULL DEFAULT 'draft',
  requested_at timestamptz,
  assigned_to uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  handled_at timestamptz,
  handler_notes text,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- A request that has left draft must name at least one channel.
-- Added out-of-line so re-running this migration repairs an existing table.
-- NOTE: cardinality(), not array_length(). array_length('{}', 1) is NULL, and a
-- CHECK whose expression is NULL PASSES, so the array_length form silently
-- allowed channel-less requests through.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'communications_requests_channels_not_empty'
  ) THEN
    ALTER TABLE communications_requests
      DROP CONSTRAINT communications_requests_channels_not_empty;
  END IF;

  ALTER TABLE communications_requests
    ADD CONSTRAINT communications_requests_channels_not_empty
    CHECK (status = 'draft' OR cardinality(channels) >= 1);
END $$;

CREATE INDEX IF NOT EXISTS communications_requests_request_idx
  ON communications_requests (event_request_id, created_at DESC);
CREATE INDEX IF NOT EXISTS communications_requests_status_idx
  ON communications_requests (status, needed_by);
CREATE INDEX IF NOT EXISTS communications_requests_channels_idx
  ON communications_requests USING gin (channels);

DROP TRIGGER IF EXISTS communications_requests_set_updated_at ON communications_requests;
CREATE TRIGGER communications_requests_set_updated_at
  BEFORE UPDATE ON communications_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Only the comms team (or an admin) may progress a request past 'requested'.
CREATE OR REPLACE FUNCTION public.communications_guard_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
DECLARE
  handler boolean := has_role('communications') OR has_role('admin');
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    IF NOT handler AND NEW.status NOT IN ('draft', 'requested') THEN
      RAISE EXCEPTION 'status % requires the communications or admin role', NEW.status
        USING ERRCODE = 'insufficient_privilege';
    END IF;

    IF NEW.status = 'requested' AND NEW.requested_at IS NULL THEN
      NEW.requested_at = now();
    END IF;
    IF NEW.status IN ('published', 'declined') AND NEW.handled_at IS NULL THEN
      NEW.handled_at = now();
    END IF;
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS communications_requests_guard_status ON communications_requests;
CREATE TRIGGER communications_requests_guard_status
  BEFORE UPDATE ON communications_requests
  FOR EACH ROW EXECUTE FUNCTION public.communications_guard_status();

ALTER TABLE communications_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS communications_requests_select ON communications_requests;
CREATE POLICY communications_requests_select ON communications_requests
  FOR SELECT TO authenticated
  USING (
    has_role('communications') OR has_role('admin')
    OR owns_event_request(event_request_id)
  );

DROP POLICY IF EXISTS communications_requests_insert ON communications_requests;
CREATE POLICY communications_requests_insert ON communications_requests
  FOR INSERT TO authenticated
  WITH CHECK (
    requested_by = auth.uid()
    AND (has_role('communications') OR has_role('admin')
         OR owns_event_request(event_request_id))
  );

DROP POLICY IF EXISTS communications_requests_update ON communications_requests;
CREATE POLICY communications_requests_update ON communications_requests
  FOR UPDATE TO authenticated
  USING (
    has_role('communications') OR has_role('admin')
    OR (owns_event_request(event_request_id)
        AND status IN ('draft', 'requested'))
  )
  WITH CHECK (
    has_role('communications') OR has_role('admin')
    OR owns_event_request(event_request_id)
  );

DROP POLICY IF EXISTS communications_requests_delete ON communications_requests;
CREATE POLICY communications_requests_delete ON communications_requests
  FOR DELETE TO authenticated
  USING (
    has_role('admin')
    OR (owns_event_request(event_request_id) AND status = 'draft')
  );

-- ── communications_toolkit ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS communications_toolkit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  -- 'template' | 'instructions' | 'checklist' | 'support'
  kind text NOT NULL DEFAULT 'template',
  body text,
  file_url text,
  sort_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS communications_toolkit_sort_idx
  ON communications_toolkit (sort_order);

DROP TRIGGER IF EXISTS communications_toolkit_set_updated_at ON communications_toolkit;
CREATE TRIGGER communications_toolkit_set_updated_at
  BEFORE UPDATE ON communications_toolkit
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE communications_toolkit ENABLE ROW LEVEL SECURITY;

-- Every signed-in leader can read the toolkit; only comms/admin maintain it.
DROP POLICY IF EXISTS communications_toolkit_select ON communications_toolkit;
CREATE POLICY communications_toolkit_select ON communications_toolkit
  FOR SELECT TO authenticated
  USING (is_published OR has_role('communications') OR has_role('admin'));

DROP POLICY IF EXISTS communications_toolkit_write ON communications_toolkit;
CREATE POLICY communications_toolkit_write ON communications_toolkit
  FOR ALL TO authenticated
  USING (has_role('communications') OR has_role('admin'))
  WITH CHECK (has_role('communications') OR has_role('admin'));
