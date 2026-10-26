/*
  # Ministry Leaders Hub — Phase 1, step 3: budgets and reimbursements

  "Submit a Budget and Reimbursement" in the workflow. Additive.

  1. budget_requests — planned spend, routed to finance for approval.
  2. reimbursements — actual spend, with an expense report and receipts.
  3. reimbursement_receipts — one row per receipt file.

  4. finance-docs bucket (PRIVATE)
     Every bucket that existed before this (`bulletins`, `page-images`) is
     public. Receipts and expense reports must not be, so this bucket is created
     with public = false and read access is limited to the uploader plus
     finance/admin. Files are therefore served through signed URLs, NOT through
     /storage/v1/object/public/..., so the client must call createSignedUrl().

  5. Approvals
     Only finance or admin may approve or reject a budget or reimbursement; a
     trigger enforces this so a leader cannot approve their own spend even
     though they may edit the row while it is still a draft.

  ASSUMPTION worth confirming: 'finance' and 'admin' are treated as equivalent
  approvers. If budget sign-off must be finance-only, or must additionally be
  countersigned, narrow the guard functions below.
*/

-- ── budget_requests ──────────────────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'finance_status') THEN
    CREATE TYPE finance_status AS ENUM (
      'draft', 'submitted', 'changes_requested', 'approved', 'rejected', 'paid'
    );
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS budget_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_request_id uuid NOT NULL REFERENCES event_requests (id) ON DELETE CASCADE,
  submitted_by uuid NOT NULL REFERENCES auth.users (id) ON DELETE RESTRICT,

  amount_requested numeric(12, 2) NOT NULL CHECK (amount_requested >= 0),
  purpose text NOT NULL,
  -- [{ description, amount }, ...]; the dashboard only needs the total.
  line_items jsonb NOT NULL DEFAULT '[]'::jsonb,

  status finance_status NOT NULL DEFAULT 'draft',
  submitted_at timestamptz,
  decided_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  decided_at timestamptz,
  decision_notes text,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT budget_requests_line_items_is_array CHECK (jsonb_typeof(line_items) = 'array')
);

CREATE INDEX IF NOT EXISTS budget_requests_request_idx ON budget_requests (event_request_id);
CREATE INDEX IF NOT EXISTS budget_requests_status_idx  ON budget_requests (status, submitted_at);

-- ── reimbursements ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reimbursements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_request_id uuid NOT NULL REFERENCES event_requests (id) ON DELETE CASCADE,
  submitted_by uuid NOT NULL REFERENCES auth.users (id) ON DELETE RESTRICT,

  payee_name text NOT NULL,
  amount_total numeric(12, 2) NOT NULL CHECK (amount_total >= 0),
  -- Object key inside the private finance-docs bucket.
  expense_report_path text,
  notes text,

  status finance_status NOT NULL DEFAULT 'draft',
  submitted_at timestamptz,
  decided_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  decided_at timestamptz,
  decision_notes text,
  -- "Minister notified check was processed"
  processed_at timestamptz,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS reimbursements_request_idx ON reimbursements (event_request_id);
CREATE INDEX IF NOT EXISTS reimbursements_status_idx  ON reimbursements (status, submitted_at);

CREATE TABLE IF NOT EXISTS reimbursement_receipts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reimbursement_id uuid NOT NULL REFERENCES reimbursements (id) ON DELETE CASCADE,
  storage_path text NOT NULL,
  amount numeric(12, 2) CHECK (amount IS NULL OR amount >= 0),
  description text,
  uploaded_by uuid NOT NULL REFERENCES auth.users (id) ON DELETE RESTRICT,
  uploaded_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS reimbursement_receipts_parent_idx
  ON reimbursement_receipts (reimbursement_id);

-- ── updated_at ───────────────────────────────────────────────────────────────
DROP TRIGGER IF EXISTS budget_requests_set_updated_at ON budget_requests;
CREATE TRIGGER budget_requests_set_updated_at
  BEFORE UPDATE ON budget_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS reimbursements_set_updated_at ON reimbursements;
CREATE TRIGGER reimbursements_set_updated_at
  BEFORE UPDATE ON reimbursements
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── Approval guards ──────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.finance_guard_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
DECLARE
  approver boolean := has_role('finance') OR has_role('admin');
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    -- Submitters may move between draft and submitted, nothing else.
    IF NOT approver AND NEW.status NOT IN ('draft', 'submitted') THEN
      RAISE EXCEPTION 'status % requires the finance or admin role', NEW.status
        USING ERRCODE = 'insufficient_privilege';
    END IF;

    IF NEW.status = 'submitted' AND NEW.submitted_at IS NULL THEN
      NEW.submitted_at = now();
    END IF;
    IF NEW.status IN ('approved', 'rejected') AND NEW.decided_at IS NULL THEN
      NEW.decided_at = now();
      NEW.decided_by = auth.uid();
    END IF;
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS budget_requests_guard_status ON budget_requests;
CREATE TRIGGER budget_requests_guard_status
  BEFORE UPDATE ON budget_requests
  FOR EACH ROW EXECUTE FUNCTION public.finance_guard_status();

DROP TRIGGER IF EXISTS reimbursements_guard_status ON reimbursements;
CREATE TRIGGER reimbursements_guard_status
  BEFORE UPDATE ON reimbursements
  FOR EACH ROW EXECUTE FUNCTION public.finance_guard_status();

-- Only finance/admin may mark a reimbursement paid out.
CREATE OR REPLACE FUNCTION public.reimbursements_guard_processed()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NEW.processed_at IS DISTINCT FROM OLD.processed_at
     AND NOT (has_role('finance') OR has_role('admin')) THEN
    RAISE EXCEPTION 'marking a reimbursement processed requires the finance or admin role'
      USING ERRCODE = 'insufficient_privilege';
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS reimbursements_guard_processed ON reimbursements;
CREATE TRIGGER reimbursements_guard_processed
  BEFORE UPDATE ON reimbursements
  FOR EACH ROW EXECUTE FUNCTION public.reimbursements_guard_processed();

-- ── RLS ──────────────────────────────────────────────────────────────────────
-- Financial detail is NOT visible to the communications role.
ALTER TABLE budget_requests        ENABLE ROW LEVEL SECURITY;
ALTER TABLE reimbursements         ENABLE ROW LEVEL SECURITY;
ALTER TABLE reimbursement_receipts ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['budget_requests', 'reimbursements']
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', t || '_select', t);
    EXECUTE format($q$
      CREATE POLICY %I ON %I FOR SELECT TO authenticated
      USING (has_role('finance') OR has_role('admin')
             OR owns_event_request(event_request_id))$q$, t || '_select', t);

    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', t || '_insert', t);
    EXECUTE format($q$
      CREATE POLICY %I ON %I FOR INSERT TO authenticated
      WITH CHECK (submitted_by = auth.uid()
                  AND (has_role('finance') OR has_role('admin')
                       OR owns_event_request(event_request_id)))$q$, t || '_insert', t);

    -- A submitter may edit until a decision is recorded; after that only
    -- finance/admin. The guard trigger limits which statuses they may set.
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', t || '_update', t);
    EXECUTE format($q$
      CREATE POLICY %I ON %I FOR UPDATE TO authenticated
      USING (has_role('finance') OR has_role('admin')
             OR (owns_event_request(event_request_id)
                 AND status IN ('draft', 'submitted', 'changes_requested')))
      WITH CHECK (has_role('finance') OR has_role('admin')
                  OR owns_event_request(event_request_id))$q$, t || '_update', t);

    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', t || '_delete', t);
    EXECUTE format($q$
      CREATE POLICY %I ON %I FOR DELETE TO authenticated
      USING (has_role('admin')
             OR (owns_event_request(event_request_id) AND status = 'draft'))$q$,
      t || '_delete', t);
  END LOOP;
END $$;

DROP POLICY IF EXISTS reimbursement_receipts_select ON reimbursement_receipts;
CREATE POLICY reimbursement_receipts_select ON reimbursement_receipts
  FOR SELECT TO authenticated
  USING (
    has_role('finance') OR has_role('admin')
    OR EXISTS (
      SELECT 1 FROM reimbursements r
      WHERE r.id = reimbursement_id AND owns_event_request(r.event_request_id)
    )
  );

DROP POLICY IF EXISTS reimbursement_receipts_insert ON reimbursement_receipts;
CREATE POLICY reimbursement_receipts_insert ON reimbursement_receipts
  FOR INSERT TO authenticated
  WITH CHECK (
    uploaded_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM reimbursements r
      WHERE r.id = reimbursement_id
        AND (has_role('finance') OR has_role('admin')
             OR owns_event_request(r.event_request_id))
    )
  );

DROP POLICY IF EXISTS reimbursement_receipts_delete ON reimbursement_receipts;
CREATE POLICY reimbursement_receipts_delete ON reimbursement_receipts
  FOR DELETE TO authenticated
  USING (
    has_role('admin')
    OR (uploaded_by = auth.uid() AND EXISTS (
          SELECT 1 FROM reimbursements r
          WHERE r.id = reimbursement_id AND r.status IN ('draft', 'submitted')))
  );

-- ── finance-docs bucket (private) ────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('finance-docs', 'finance-docs', false)
ON CONFLICT (id) DO NOTHING;

-- No anon policy at all: this bucket is never publicly readable.
DROP POLICY IF EXISTS "finance_docs_read" ON storage.objects;
CREATE POLICY "finance_docs_read"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'finance-docs'
    AND (owner = auth.uid() OR has_role('finance') OR has_role('admin'))
  );

DROP POLICY IF EXISTS "finance_docs_insert" ON storage.objects;
CREATE POLICY "finance_docs_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'finance-docs' AND owner = auth.uid());

-- Present so re-uploading the same key (x-upsert) works; the bulletins bucket
-- lacks this, which is why same-name re-uploads fail there.
DROP POLICY IF EXISTS "finance_docs_update" ON storage.objects;
CREATE POLICY "finance_docs_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'finance-docs' AND (owner = auth.uid() OR has_role('admin')))
  WITH CHECK (bucket_id = 'finance-docs' AND (owner = auth.uid() OR has_role('admin')));

DROP POLICY IF EXISTS "finance_docs_delete" ON storage.objects;
CREATE POLICY "finance_docs_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'finance-docs' AND (owner = auth.uid() OR has_role('admin')));
