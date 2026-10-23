/*
  # Fix prayer_intentions INSERT policy — replace always-true check

  ## Problem
  The existing "Anyone can submit prayer intentions" INSERT policy used
  `WITH CHECK (true)`, which effectively disabled row-level security for
  anonymous inserts — any row, including empty or malformed ones, could
  be inserted without restriction.

  ## Changes
  1. Drop the permissive always-true INSERT policy on `prayer_intentions`.
  2. Replace it with a policy that enforces minimum data integrity:
     - `intention_text` must be non-empty (after trimming whitespace)
     - `submitter_name` must be non-empty (after trimming whitespace)
     - `submitter_email` must contain an "@" character (basic format guard)
  This keeps the table open for anonymous parish visitors to submit prayer
  requests while preventing empty, blank, or structurally invalid rows.

  ## Security
  - Applies to: anon role (unauthenticated visitors)
  - Operation: INSERT only
  - No SELECT/UPDATE/DELETE changes
*/

DROP POLICY IF EXISTS "Anyone can submit prayer intentions" ON prayer_intentions;

CREATE POLICY "Anon can submit valid prayer intentions"
  ON prayer_intentions FOR INSERT
  TO anon
  WITH CHECK (
    length(trim(intention_text)) > 0
    AND length(trim(submitter_name)) > 0
    AND submitter_email LIKE '%@%'
  );
