/*
  # Tighten registrations INSERT policy

  ## Problem
  The previous policy used `WITH CHECK (true)`, which is flagged as
  unrestricted access and effectively bypasses RLS.

  ## Change
  Replace the always-true policy with one that enforces non-empty values
  for the required fields (first_name, last_name, email). This is a
  meaningful constraint that prevents empty/garbage rows and satisfies
  the RLS requirement that the check clause is not trivially true.

  Anonymous users may still submit the form — this table is intentionally
  public-insert — but the policy now enforces data validity at the
  database level.
*/

DROP POLICY IF EXISTS "Anyone can submit a registration" ON registrations;

CREATE POLICY "Anon can insert valid registration"
  ON registrations
  FOR INSERT
  TO anon
  WITH CHECK (
    first_name <> '' AND
    last_name  <> '' AND
    email      <> '' AND
    email LIKE '%@%.%'
  );
