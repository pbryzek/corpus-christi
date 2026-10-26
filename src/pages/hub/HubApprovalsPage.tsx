import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useHubRole } from '../../lib/useHubRole';
import { EventRequest } from '../../lib/hubTypes';
import { formatDateTime } from '../../lib/parishTime';
import HubShell, { ErrorNote, Spinner, StatusBadge } from '../../components/hub/HubShell';

export default function HubApprovalsPage() {
  const { isAdmin, loading: roleLoading } = useHubRole();
  const [requests, setRequests] = useState<EventRequest[]>([]);
  const [ministryNames, setMinistryNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [reqRes, minRes] = await Promise.all([
      supabase
        .from('event_requests')
        .select('*')
        .in('status', ['submitted', 'approved'])
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

  async function publish(id: string) {
    setBusyId(id);
    setError(null);
    const { error } = await supabase.rpc('approve_event_request', { req: id });
    setBusyId(null);
    if (error) setError(error.message);
    else await load();
  }

  if (roleLoading) return <HubShell><Spinner /></HubShell>;

  if (!isAdmin) {
    return (
      <HubShell>
        <ErrorNote message="Approvals are limited to parish office administrators." />
      </HubShell>
    );
  }

  return (
    <HubShell>
      <h1 className="text-2xl font-bold text-slate-800">Approvals</h1>
      <p className="text-slate-500 text-sm mt-1 mb-6">
        Approving copies the event onto the public parish calendar.
      </p>

      {error && <div className="mb-6"><ErrorNote message={error} /></div>}

      {loading ? <Spinner /> : requests.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-2xl px-6 py-14 text-center">
          <p className="text-slate-500 text-sm">Nothing waiting for approval.</p>
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
                    {r.submitted_at && <> · submitted {formatDateTime(r.submitted_at)}</>}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <StatusBadge status={r.status} />
                  <button
                    onClick={() => void publish(r.id)}
                    disabled={busyId === r.id}
                    className="bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs px-3 py-1.5 rounded-lg transition disabled:opacity-60"
                  >
                    {busyId === r.id ? 'Publishing…' : 'Approve & publish'}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </HubShell>
  );
}
