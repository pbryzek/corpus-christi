-- Restore EXECUTE on is_admin() for authenticated role.
--
-- The previous "harden" migration revoked EXECUTE from authenticated, which
-- broke every RLS policy that calls is_admin() (bulletins insert/update/delete,
-- and any others). RLS policies run as the caller's role; when authenticated
-- can't call is_admin(), the check errors and the row is rejected — this is
-- why bulletin uploads have been silently failing.
--
-- Keeping the anon revoke: only signed-in users need to evaluate admin status.
-- The function is SECURITY DEFINER with a locked search_path and only exposes
-- a boolean about the caller's own row in public.admins, so re-granting
-- EXECUTE does not widen the attack surface meaningfully.

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
