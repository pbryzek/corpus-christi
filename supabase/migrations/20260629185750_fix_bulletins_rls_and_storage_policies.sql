-- ── 1. Admins table + is_admin() helper ──────────────────────────────────────
-- Allows bulletins RLS to restrict mutations to known admin users
-- rather than any authenticated user.

CREATE TABLE admins (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins_read_self" ON admins FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

-- Seed all existing auth users as admins
INSERT INTO admins (user_id) SELECT id FROM auth.users;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid());
$$;

-- ── 2. Fix bulletins RLS — replace always-true conditions with is_admin() ────

DROP POLICY "bulletins_insert_admin" ON bulletins;
DROP POLICY "bulletins_update_admin" ON bulletins;
DROP POLICY "bulletins_delete_admin" ON bulletins;

CREATE POLICY "bulletins_insert_admin" ON bulletins FOR INSERT
  TO authenticated WITH CHECK (is_admin());

CREATE POLICY "bulletins_update_admin" ON bulletins FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "bulletins_delete_admin" ON bulletins FOR DELETE
  TO authenticated USING (is_admin());

-- ── 3. Remove broad storage SELECT policy ────────────────────────────────────
-- Public buckets serve objects directly by URL without needing a SELECT policy
-- on storage.objects. The policy only adds listing capability, which is
-- more exposure than intended.

DROP POLICY "bulletins_public_read" ON storage.objects;
