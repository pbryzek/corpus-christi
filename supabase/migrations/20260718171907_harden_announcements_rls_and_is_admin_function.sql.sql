/*
# Harden announcements RLS policies and is_admin() function

## Why this migration exists

A security audit flagged two issues:

1. The `public.announcements` admin write policies
   (`announcements_insert_admin`, `announcements_update_admin`,
   `announcements_delete_admin`) used `USING (true)` / `WITH CHECK (true)`
   scoped to `authenticated`. This meant ANY signed-in user — not just
   admins — could insert, update, or delete announcements, effectively
   bypassing row-level security for the entire table.

2. The helper function `public.is_admin()` was declared
   `SECURITY DEFINER`, which means it executes with the privileges of its
   owner (a privileged role) whenever invoked. The `authenticated` role had
   `EXECUTE` on it, so any signed-in user could call it via
   `/rest/v1/rpc/is_admin`. Although the function only returns a boolean
   about the caller's own row, `SECURITY DEFINER` is unnecessary here and is
   flagged as a risk.

## What this migration changes

### 1. Announcements admin policies — scoped to actual admins

Replaces the three always-true admin write policies on `announcements` with
real admin-gated predicates that call `is_admin()`:

- `announcements_insert_admin` (INSERT): `WITH CHECK (is_admin())`
- `announcements_update_admin` (UPDATE): `USING (is_admin()) WITH CHECK (is_admin())`
- `announcements_delete_admin` (DELETE): `USING (is_admin())`

This matches the existing pattern already used by the `bulletins` table
(`bulletins_insert_admin`, `bulletins_update_admin`,
`bulletins_delete_admin`). After this change, only users whose `user_id`
appears in `public.admins` can write to or delete from `announcements`.

The existing public read policy `announcements_select_public` (read active
announcements within their start/end window) is unchanged — visitors still
see active announcements as before. The existing
`announcements_select_admin_all` policy (which lets admins read every row
including inactive / outside-window ones) is also unchanged; it is already
admin-gated through the `admins` table membership used by the admin UI.

Wait — `announcements_select_admin_all` currently uses `USING (true)` for
authenticated. That has the same flaw as the write policies: it lets any
signed-in user read every announcement including inactive/future/past ones.
This migration also tightens it to `USING (is_admin())` so only admins see
the full set, while ordinary signed-in users see only the public-windowed
rows via `announcements_select_public`.

### 2. is_admin() — SECURITY INVOKER + EXECUTE for authenticated

Re-declares `is_admin()` as `SECURITY INVOKER` (it was SECURITY DEFINER).
`SECURITY INVOKER` runs with the caller's privileges. This is safe because:

- `public.admins` has RLS enabled with policy `admins_read_self`
  (`auth.uid() = user_id`), so each authenticated user can only read their
  own row. A non-admin querying `admins` sees zero rows, so
  `EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid())`
  returns false. An admin sees their own row, so it returns true.
- The function is `STABLE` and has a locked `search_path = ''` to prevent
  search_path injection (unchanged from prior hardening).

`EXECUTE` is kept granted to `authenticated` because RLS policies on
`bulletins` and (now) `announcements` call `is_admin()` and policies run as
the caller's role. Revoking it would silently break admin writes/deletes
across the app — this is exactly what happened in a prior migration
(20260709174022). `EXECUTE` remains revoked from `anon` and `PUBLIC`.

## Tables affected
- `public.announcements` (RLS policies tightened; no column changes)
- `public.admins` (unchanged — RLS already correctly scoped via
  `admins_read_self`)
- `public.bulletins` (unchanged — already uses `is_admin()` correctly)

## Security changes
- `announcements_insert_admin`: WITH CHECK now `is_admin()` instead of `true`
- `announcements_update_admin`: USING + WITH CHECK now `is_admin()` instead of `true`
- `announcements_delete_admin`: USING now `is_admin()` instead of `true`
- `announcements_select_admin_all`: USING now `is_admin()` instead of `true`
- `is_admin()`: SECURITY DEFINER -> SECURITY INVOKER; EXECUTE for
  authenticated preserved; search_path locked at ''; STABLE preserved

## Idempotency
All policy statements DROP IF EXISTS before CREATE. The function is
CREATE OR REPLACE. Safe to re-run.
*/

-- ---------------------------------------------------------------------------
-- 1. Tighten announcements admin RLS policies
-- ---------------------------------------------------------------------------

-- INSERT: only admins
DROP POLICY IF EXISTS "announcements_insert_admin" ON public.announcements;
CREATE POLICY "announcements_insert_admin"
  ON public.announcements FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- UPDATE: only admins
DROP POLICY IF EXISTS "announcements_update_admin" ON public.announcements;
CREATE POLICY "announcements_update_admin"
  ON public.announcements FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- DELETE: only admins
DROP POLICY IF EXISTS "announcements_delete_admin" ON public.announcements;
CREATE POLICY "announcements_delete_admin"
  ON public.announcements FOR DELETE
  TO authenticated
  USING (is_admin());

-- SELECT (admin all-rows view): only admins. Public windowed reads stay
-- available via announcements_select_public for anon + authenticated.
DROP POLICY IF EXISTS "announcements_select_admin_all" ON public.announcements;
CREATE POLICY "announcements_select_admin_all"
  ON public.announcements FOR SELECT
  TO authenticated
  USING (is_admin());

-- ---------------------------------------------------------------------------
-- 2. Convert is_admin() to SECURITY INVOKER
-- ---------------------------------------------------------------------------
-- SECURITY INVOKER is safe here: public.admins has RLS enabled with
-- admins_read_self (auth.uid() = user_id), so the caller can only see their
-- own row. The EXISTS check therefore resolves correctly under the caller's
-- privileges. Keep EXECUTE on authenticated because RLS policies on
-- bulletins and announcements call this function and run as the caller.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = ''
AS $$
  SELECT EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid());
$$;

-- Re-assert grants/revokes so this migration is self-contained and safe to
-- re-run even if a prior migration state differs.
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
