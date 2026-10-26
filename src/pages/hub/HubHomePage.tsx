import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useHubRole } from '../../lib/useHubRole';
import { EventRequest } from '../../lib/hubTypes';
import { formatDateTime } from '../../lib/parishTime';
import HubShell, { ErrorNote, Spinner, StatusBadge } from '../../components/hub/HubShell';
import NewEventRequestForm from '../../components/hub/NewEventRequestForm';

export default function HubHomePage() {
  const { ministries, isAdmin, loading: roleLoading } = useHubRole();
  const [requests, setRequests] = useState<EventRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    // RLS already narrows this to the caller's own requests, their ministries',
    // or everything if they are admin/finance/comms — no filter needed here.
    const { data, error } = await supabase
      .from('event_requests')
      .select('*')
      .order('starts_at', { ascending: false });

    if (error) setError(error.message);
    else setRequests((data ?? []) as EventRequest[]);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const canCreate = ministries.length > 0 || isAdmin;

  return (
    <HubShell>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My events</h1>
          <p className="text-slate-500 text-sm mt-1">
            Plan an event, request a room, promotion and a budget, then send it for approval.
          </p>
        </div>
        {canCreate && !creating && (
          <button
            onClick={() => setCreating(true)}
            className="shrink-0 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm px-4 py-2.5 rounded-lg transition"
          >
            New event
          </button>
        )}
      </div>

      {error && <div className="mb-6"><ErrorNote message={error} /></div>}

      {creating && (
        <div className="mb-6">
          <NewEventRequestForm
            ministries={ministries}
            onCancel={() => setCreating(false)}
            onCreated={() => { setCreating(false); void load(); }}
          />
        </div>
      )}

      {!roleLoading && !canCreate && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl px-5 py-4 text-sm text-amber-900 mb-6">
          You aren't listed as a leader of any ministry yet, so you can't start an event request.
          The parish office adds ministries and their leaders.
        </div>
      )}

      {loading ? <Spinner /> : requests.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-2xl px-6 py-14 text-center">
          <p className="text-slate-500 text-sm">No event requests yet.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {requests.map(r => (
            <li key={r.id}>
              <Link
                to={`/hub/events/${r.id}`}
                className="block bg-white border border-slate-100 rounded-xl px-5 py-4 hover:border-blue-200 hover:shadow-sm transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="font-semibold text-slate-800 truncate">{r.title}</h2>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {formatDateTime(r.starts_at, r.time_tbd)}
                      {r.location && <> · {r.location}</>}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {r.needs_communications && <Tag>Promotion</Tag>}
                      {r.needs_budget && <Tag>Budget</Tag>}
                      {r.needs_registration && <Tag>Registration</Tag>}
                    </div>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </HubShell>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-xs">
      {children}
    </span>
  );
}
