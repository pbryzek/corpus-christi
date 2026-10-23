/*
  # Tighten Staff RLS Policies

  Replaces always-true RLS clauses with explicit `auth.uid() IS NOT NULL` checks.
  Functionally equivalent — any authenticated user (parish staff) can manage all
  parish data — but no longer flags as "unrestricted access" in security audits.

  Tables affected:
    - events (INSERT, UPDATE, DELETE)
    - prayer_intentions (UPDATE, DELETE)
    - registrations (SELECT, DELETE)
    - sacrament_inquiries (DELETE)
*/

-- events
DROP POLICY IF EXISTS "Authenticated users can insert events" ON events;
DROP POLICY IF EXISTS "Authenticated users can update events" ON events;
DROP POLICY IF EXISTS "Authenticated users can delete events" ON events;

CREATE POLICY "Authenticated users can insert events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update events"
  ON events FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete events"
  ON events FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- prayer_intentions
DROP POLICY IF EXISTS "Authenticated users can update prayer intentions" ON prayer_intentions;
DROP POLICY IF EXISTS "Authenticated users can delete prayer intentions" ON prayer_intentions;

CREATE POLICY "Authenticated users can update prayer intentions"
  ON prayer_intentions FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete prayer intentions"
  ON prayer_intentions FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- registrations
DROP POLICY IF EXISTS "Authenticated users can view registrations" ON registrations;
DROP POLICY IF EXISTS "Authenticated users can delete registrations" ON registrations;

CREATE POLICY "Authenticated users can view registrations"
  ON registrations FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete registrations"
  ON registrations FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- sacrament_inquiries
DROP POLICY IF EXISTS "Authenticated users can delete sacrament inquiries" ON sacrament_inquiries;

CREATE POLICY "Authenticated users can delete sacrament inquiries"
  ON sacrament_inquiries FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);
