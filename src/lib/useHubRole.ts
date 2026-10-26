import { useCallback, useEffect, useState } from 'react';
import { supabase } from './supabase';
import { useAuth } from './useAuth';

export type AppRole = 'admin' | 'finance' | 'communications' | 'ministry_leader';

export interface Ministry {
  id: string;
  name: string;
}

/**
 * Who the signed-in user is, as far as the hub is concerned.
 *
 * This drives what the UI offers, NOT what it is allowed to do — every table
 * is protected by RLS and the status transitions by triggers, so hiding a
 * button here is a convenience, never the security boundary. `user_roles` is
 * readable only by its owner, so this reads the caller's own roles and nobody
 * else's.
 */
export function useHubRole() {
  const { session, loading: authLoading, signOut } = useAuth();
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = session?.user?.id ?? null;

  const load = useCallback(async () => {
    if (!userId) {
      setRoles([]);
      setMinistries([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const [roleRes, ministryRes] = await Promise.all([
      supabase.from('user_roles').select('role'),
      supabase.from('ministry_members').select('ministries ( id, name )'),
    ]);

    if (roleRes.error) {
      setError(roleRes.error.message);
      setLoading(false);
      return;
    }

    setRoles((roleRes.data ?? []).map(r => r.role as AppRole));

    // The embedded ministry can come back as an object or a single-element
    // array depending on how PostgREST resolves the relationship.
    const led: Ministry[] = [];
    for (const row of ministryRes.data ?? []) {
      const m = (row as { ministries: Ministry | Ministry[] | null }).ministries;
      if (Array.isArray(m)) led.push(...m);
      else if (m) led.push(m);
    }
    setMinistries(led);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    if (!authLoading) void load();
  }, [authLoading, load]);

  const has = (role: AppRole) => roles.includes(role);

  return {
    session,
    userId,
    roles,
    ministries,
    loading: authLoading || loading,
    error,
    reload: load,
    signOut,
    isAdmin: has('admin'),
    isFinance: has('finance'),
    isComms: has('communications'),
    isLeader: has('ministry_leader'),
    /** Any hub role at all — the gate for /hub. */
    hasHubAccess: roles.length > 0,
  };
}
