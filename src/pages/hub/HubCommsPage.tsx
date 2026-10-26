import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useHubRole } from '../../lib/useHubRole';
import { CHANNEL_LABELS, CommsStatus, CommunicationsRequest } from '../../lib/hubTypes';
import { formatDateTime } from '../../lib/parishTime';
import HubShell, { ErrorNote, Spinner, StatusBadge } from '../../components/hub/HubShell';

const NEXT_STATUS: Partial<Record<CommsStatus, { to: CommsStatus; label: string }>> = {
  requested: { to: 'in_progress', label: 'Start work' },
  in_progress: { to: 'scheduled', label: 'Mark scheduled' },
  scheduled: { to: 'published', label: 'Mark published' },
};

export default function HubCommsPage() {
  const { isAdmin, isComms, loading: roleLoading } = useHubRole();
  const [requests, setRequests] = useState<CommunicationsRequest[]>([]);
  const [titles, setTitles] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [cRes, eRes] = await Promise.all([
      supabase.from('communications_requests').select('*').order('needed_by', { nullsFirst: false }),
      supabase.from('event_requests').select('id, title'),
    ]);

    if (cRes.error) setError(cRes.error.message);
    else setRequests((cRes.data ?? []) as CommunicationsRequest[]);

    const map: Record<string, string> = {};
    for (const e of (eRes.data ?? []) as { id: string; title: string }[]) map[e.id] = e.title;
    setTitles(map);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function advance(id: string, to: CommsStatus) {
    setBusyId(id);
    setError(null);
    const { error } = await supabase.from('communications_requests').update({ status: to }).eq('id', id);
    setBusyId(null);
    if (error) setError(error.message);
    else await load();
  }

  if (roleLoading) return <HubShell><Spinner /></HubShell>;

  if (!isComms && !isAdmin) {
    return (
      <HubShell>
        <ErrorNote message="Communications is limited to the communications team and parish office administrators." />
      </HubShell>
    );
  }

  return (
    <HubShell>
      <h1 className="text-2xl font-bold text-slate-800">Communications</h1>
      <p className="text-slate-500 text-sm mt-1 mb-6">
        Promotion requests from every ministry, soonest deadline first.
      </p>

      {error && <div className="mb-6"><ErrorNote message={error} /></div>}

      {loading ? <Spinner /> : requests.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-2xl px-6 py-14 text-center">
          <p className="text-slate-500 text-sm">No promotion requests.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {requests.map(c => {
            const next = NEXT_STATUS[c.status];
            return (
              <li key={c.id} className="bg-white border border-slate-100 rounded-xl px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800">{c.headline}</p>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {c.channels.map(ch => CHANNEL_LABELS[ch]).join(' · ')}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      <Link to={`/hub/events/${c.event_request_id}`} className="hover:text-blue-700">
                        {titles[c.event_request_id] ?? 'Event'}
                      </Link>
                      {c.needed_by && <> · needed by {c.needed_by}</>}
                      {!c.needed_by && <> · requested {formatDateTime(c.created_at)}</>}
                    </p>
                    {c.body_copy && (
                      <p className="text-sm text-slate-600 mt-2 whitespace-pre-line">{c.body_copy}</p>
                    )}
                    {c.call_to_action && (
                      <p className="text-xs text-slate-500 mt-1">CTA: {c.call_to_action}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <StatusBadge status={c.status === 'requested' ? 'submitted' : c.status} />
                    {next && (
                      <button
                        onClick={() => void advance(c.id, next.to)}
                        disabled={busyId === c.id}
                        className="bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs px-3 py-1.5 rounded-lg transition disabled:opacity-60"
                      >
                        {busyId === c.id ? 'Saving…' : next.label}
                      </button>
                    )}
                    {c.status !== 'published' && c.status !== 'declined' && (
                      <button
                        onClick={() => void advance(c.id, 'declined')}
                        disabled={busyId === c.id}
                        className="text-xs font-medium text-slate-500 hover:text-red-700"
                      >
                        Decline
                      </button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </HubShell>
  );
}
