import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useHubRole } from '../../lib/useHubRole';
import { EventRequest } from '../../lib/hubTypes';
import { formatDateTime } from '../../lib/parishTime';
import HubShell, { ErrorNote, Spinner, StatusBadge } from '../../components/hub/HubShell';

/**
 * Read-only view of approved and published events, embedded inside the hub
 * dashboard. Full event management (create/edit/delete directly on the
 * public calendar, registrations, bulletins, etc.) stays on /admin/calendar,
 * linked from the nav — this tab only answers "what's scheduled."
 */
export default function HubCalendarPage() {
  const { isAdmin, loading: roleLoading } = useHubRole();
  const [requests, setRequests] = useState<EventRequest[]>([]);
  const [ministryNames, setMinistryNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [reqRes, minRes] = await Promise.all([
      supabase
        .from('event_requests')
        .select('*')
        .in('status', ['approved', 'published'])
        .order('starts_at'),
      supabase.from('ministries').select('id, name'),
    ]);

    if (reqRes.error) setError(reqRes.error.message);
    else setRequests((reqRes.data ?? []) as EventRequest[]);

    const names: Record<string, string> = {};
    for (const m of (minRes.data ?? []) as { id: string; name: string }[]) names[m.id] = m.name;
    setMinistryNames(names);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  if (roleLoading) return <HubShell><Spinner /></HubShell>;

  if (!isAdmin) {
    return (
      <HubShell>
        <ErrorNote message="The calendar view is limited to parish office administrators." />
      </HubShell>
    );
  }

  return (
    <HubShell>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Calendar</h1>
          <p className="text-slate-500 text-sm mt-1">
            Scheduled and approved events coming out of the hub.
          </p>
        </div>
        <Link
          to="/admin/calendar"
          className="shrink-0 text-sm font-medium text-blue-700 hover:text-blue-800"
        >
          Full admin calendar →
        </Link>
      </div>

      {error && <div className="mb-6"><ErrorNote message={error} /></div>}

      {loading ? <Spinner /> : requests.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-2xl px-6 py-14 text-center">
          <p className="text-slate-500 text-sm">Nothing approved or published yet.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {requests.map(r => (
            <li key={r.id} className="bg-white border border-slate-100 rounded-xl px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <Link to={`/hub/events/${r.id}`} className="font-semibold text-slate-800 hover:text-blue-700">
                    {r.title}
                  </Link>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {formatDateTime(r.starts_at, r.time_tbd)}
                    {r.location && <> · {r.location}</>}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {ministryNames[r.ministry_id] ?? 'Unknown ministry'}
                  </p>
                </div>
                <StatusBadge status={r.status} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </HubShell>
  );
}
