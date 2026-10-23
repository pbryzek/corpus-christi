/*
# Allow authenticated admins to read all announcements

The public SELECT policy on `announcements` intentionally hides inactive
or expired rows from visitors. The admin dashboard however needs to see
every row so admins can toggle rows back on, edit them, or clean them up.

Since only admin users can authenticate on this site, we add a
supplementary SELECT policy scoped `TO authenticated` that returns all
rows. RLS combines matching policies with OR, so anonymous visitors are
still filtered by the public policy while admins see everything.

1. Security
- Add `announcements_select_admin_all` SELECT policy on `announcements` for authenticated users returning every row.
*/

DROP POLICY IF EXISTS "announcements_select_admin_all" ON announcements;
CREATE POLICY "announcements_select_admin_all"
  ON announcements FOR SELECT
  TO authenticated
  USING (true);
