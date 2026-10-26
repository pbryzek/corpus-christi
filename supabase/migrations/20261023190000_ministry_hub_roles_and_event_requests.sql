/*
  # Ministry Leaders Hub — Phase 1, step 1: roles, ministry membership, event requests

  Foundation for the Ministry Leaders Hub. Everything here is ADDITIVE: no
  existing table, column or policy is modified, so the live site keeps working
  exactly as it does today until the hub UI is wired up.

  1. Roles
     Until now every signed-in user was effectively a full admin (`events` and
     `registrations` policies only test `auth.uid() IS NOT NULL`). The hub gives
     accounts to ministry leaders, who must NOT have that power, so this adds a
     real role table and helpers.

     `has_role()` and `leads_ministry()` are SECURITY INVOKER to match the
     existing `is_admin()` (see 20260718171907). They are safe to call from a
     policy because `user_roles` and `ministry_members` each carry a
     "read my own rows" SELECT policy.

  2. Ministry membership
     Reuses the existing (currently empty) `ministries` table and scopes leaders
     to the ministries they actually run.

  3. Event lifecycle
     `event_requests` is the workflow record: draft -> submitted -> approved ->
     published -> held -> closed. The public calendar table `events` stays the
     PUBLISHED output only; on approval a row is copied into `events` and linked
     back via `published_event_id`. Nothing reads the hub from the public site.

     A trigger stops ministry leaders from approving, publishing or closing their
     own requests; only admin or finance may move a request past `submitted`.

  Deliberately NOT in this step: rooms/bookings, budgets, reimbursements,
  post-event wrap-ups, the receipts bucket, and the notification log.
*/

-- ── 1. Roles ─────────────────────────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE app_role AS ENUM ('admin', 'finance', 'communications', 'ministry_leader');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS user_roles (
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  role app_role NOT NULL,
  granted_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, role)
);

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Readable only by its owner, which is what keeps has_role() usable from a
-- policy without granting anyone a view of the whole roster.
DROP POLICY IF EXISTS user_roles_read_self ON user_roles;
CREATE POLICY user_roles_read_self ON user_roles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(check_role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = check_role
  );
$$;

REVOKE EXECUTE ON FUNCTION public.has_role(app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(app_role) FROM anon;
GRANT EXECUTE ON FUNCTION public.has_role(app_role) TO authenticated;

-- Existing admins (public.admins / is_admin()) are granted the new 'admin' role
-- so the current admin UI keeps full access once policies start using has_role().
INSERT INTO user_roles (user_id, role)
SELECT user_id, 'admin'::app_role FROM admins
ON CONFLICT DO NOTHING;

-- ── 2. Ministry membership ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ministry_members (
  ministry_id uuid NOT NULL REFERENCES ministries (id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  is_leader boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (ministry_id, user_id)
);

ALTER TABLE ministry_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS ministry_members_read_self ON ministry_members;
CREATE POLICY ministry_members_read_self ON ministry_members
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR has_role('admin'));

CREATE OR REPLACE FUNCTION public.leads_ministry(check_ministry uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM ministry_members
    WHERE user_id = auth.uid()
      AND ministry_id = check_ministry
      AND is_leader
  );
$$;

REVOKE EXECUTE ON FUNCTION public.leads_ministry(uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.leads_ministry(uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.leads_ministry(uuid) TO authenticated;

-- ── 3. Event requests ────────────────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'event_request_status') THEN
    CREATE TYPE event_request_status AS ENUM (
      'draft', 'submitted', 'changes_requested', 'approved',
      'published', 'held', 'closed', 'cancelled'
    );
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS event_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ministry_id uuid NOT NULL REFERENCES ministries (id) ON DELETE RESTRICT,
  created_by uuid NOT NULL REFERENCES auth.users (id) ON DELETE RESTRICT,
  status event_request_status NOT NULL DEFAULT 'draft',

  -- Event details. Mirrors the shape of public.events so publishing is a copy.
  title text NOT NULL,
  description text,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz,
  time_tbd boolean NOT NULL DEFAULT false,
  recurrence text,
  location text,
  show_on_home boolean NOT NULL DEFAULT false,
  contact_email text,

  -- Which downstream workflows this request needs.
  needs_communications boolean NOT NULL DEFAULT false,
  needs_budget boolean NOT NULL DEFAULT false,
  needs_registration boolean NOT NULL DEFAULT false,
  registration_url text,
  payment_url text,

  -- Set when the request is published onto the public calendar.
  published_event_id uuid REFERENCES events (id) ON DELETE SET NULL,

  submitted_at timestamptz,
  approved_at timestamptz,
  approved_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  closed_at timestamptz,
  review_notes text,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT event_requests_ends_after_starts
    CHECK (ends_at IS NULL OR ends_at >= starts_at)
);

CREATE INDEX IF NOT EXISTS event_requests_ministry_idx ON event_requests (ministry_id, starts_at DESC);
CREATE INDEX IF NOT EXISTS event_requests_status_idx   ON event_requests (status, starts_at);
CREATE INDEX IF NOT EXISTS event_requests_creator_idx  ON event_requests (created_by, starts_at DESC);

-- ── updated_at ───────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS event_requests_set_updated_at ON event_requests;
CREATE TRIGGER event_requests_set_updated_at
  BEFORE UPDATE ON event_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── Status transition guard ──────────────────────────────────────────────────
-- RLS decides who may touch a row; this decides who may advance it. Without it
-- a ministry leader with UPDATE rights on their own draft could set
-- status='published' directly.
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
    -- Leaders may submit, withdraw to draft, or cancel. Nothing further.
    IF NOT privileged
       AND NEW.status NOT IN ('draft', 'submitted', 'cancelled') THEN
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

DROP TRIGGER IF EXISTS event_requests_guard_status ON event_requests;
CREATE TRIGGER event_requests_guard_status
  BEFORE UPDATE ON event_requests
  FOR EACH ROW EXECUTE FUNCTION public.event_requests_guard_status();

-- ── RLS ──────────────────────────────────────────────────────────────────────
-- Not public: nothing here is readable by anon. The public site reads `events`.
ALTER TABLE event_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS event_requests_select ON event_requests;
CREATE POLICY event_requests_select ON event_requests
  FOR SELECT TO authenticated
  USING (
    created_by = auth.uid()
    OR leads_ministry(ministry_id)
    OR has_role('admin')
    OR has_role('finance')
    OR has_role('communications')
  );

DROP POLICY IF EXISTS event_requests_insert ON event_requests;
CREATE POLICY event_requests_insert ON event_requests
  FOR INSERT TO authenticated
  WITH CHECK (
    created_by = auth.uid()
    AND (leads_ministry(ministry_id) OR has_role('admin'))
  );

-- A leader may keep editing until the request is approved; after that only
-- admin/finance can. The status guard trigger limits WHICH statuses they set.
DROP POLICY IF EXISTS event_requests_update ON event_requests;
CREATE POLICY event_requests_update ON event_requests
  FOR UPDATE TO authenticated
  USING (
    has_role('admin')
    OR has_role('finance')
    OR (
      (created_by = auth.uid() OR leads_ministry(ministry_id))
      AND status IN ('draft', 'submitted', 'changes_requested')
    )
  )
  WITH CHECK (
    has_role('admin')
    OR has_role('finance')
    OR (created_by = auth.uid() OR leads_ministry(ministry_id))
  );

DROP POLICY IF EXISTS event_requests_delete ON event_requests;
CREATE POLICY event_requests_delete ON event_requests
  FOR DELETE TO authenticated
  USING (
    has_role('admin')
    OR ((created_by = auth.uid() OR leads_ministry(ministry_id)) AND status = 'draft')
  );
