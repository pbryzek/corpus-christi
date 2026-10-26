import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useHubRole } from '../../lib/useHubRole';
import { BudgetRequest, Reimbursement, ReimbursementReceipt } from '../../lib/hubTypes';
import { formatDateTime } from '../../lib/parishTime';
import HubShell, { ErrorNote, Spinner, StatusBadge } from '../../components/hub/HubShell';
import { currency, financeBadge } from '../../lib/hubFormat';

export default function HubFinancePage() {
  const { isAdmin, isFinance, loading: roleLoading } = useHubRole();
  const [budgets, setBudgets] = useState<BudgetRequest[]>([]);
  const [reimbursements, setReimbursements] = useState<Reimbursement[]>([]);
  const [receipts, setReceipts] = useState<ReimbursementReceipt[]>([]);
  const [titles, setTitles] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [signing, setSigning] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [bRes, rRes, eRes] = await Promise.all([
      supabase.from('budget_requests').select('*').order('created_at', { ascending: false }),
      supabase.from('reimbursements').select('*').order('created_at', { ascending: false }),
      supabase.from('event_requests').select('id, title'),
    ]);

    if (bRes.error) setError(bRes.error.message);
    else setBudgets((bRes.data ?? []) as BudgetRequest[]);
    const reimb = (rRes.data ?? []) as Reimbursement[];
    setReimbursements(reimb);

    if (reimb.length > 0) {
      const { data: receiptData } = await supabase
        .from('reimbursement_receipts')
        .select('*')
        .in('reimbursement_id', reimb.map(r => r.id));
      setReceipts((receiptData ?? []) as ReimbursementReceipt[]);
    } else {
      setReceipts([]);
    }

    const map: Record<string, string> = {};
    for (const e of (eRes.data ?? []) as { id: string; title: string }[]) map[e.id] = e.title;
    setTitles(map);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function decide(table: 'budget_requests' | 'reimbursements', id: string, status: 'approved' | 'rejected') {
    setBusyId(id);
    setError(null);
    const { error } = await supabase.from(table).update({ status }).eq('id', id);
    setBusyId(null);
    if (error) setError(error.message);
    else await load();
  }

  async function viewReceipt(path: string) {
    setSigning(path);
    const { data, error } = await supabase.storage.from('finance-docs').createSignedUrl(path, 60);
    setSigning(null);
    if (error || !data) {
      setError(`Could not open that receipt: ${error?.message ?? 'unknown error'}`);
      return;
    }
    window.open(data.signedUrl, '_blank', 'noopener,noreferrer');
  }

  async function markProcessed(id: string) {
    setBusyId(id);
    setError(null);
    const { error } = await supabase
      .from('reimbursements')
      .update({ processed_at: new Date().toISOString() })
      .eq('id', id);
    setBusyId(null);
    if (error) setError(error.message);
    else await load();
  }

  if (roleLoading) return <HubShell><Spinner /></HubShell>;

  if (!isFinance && !isAdmin) {
    return (
      <HubShell>
        <ErrorNote message="Finance is limited to the finance team and parish office administrators." />
      </HubShell>
    );
  }

  return (
    <HubShell>
      <h1 className="text-2xl font-bold text-slate-800">Finance</h1>
      <p className="text-slate-500 text-sm mt-1 mb-6">
        Budget requests and reimbursements across every ministry.
      </p>

      {error && <div className="mb-6"><ErrorNote message={error} /></div>}

      {loading ? <Spinner /> : (
        <>
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">Budget requests</h2>
          {budgets.length === 0 ? (
            <EmptyCard>No budget requests.</EmptyCard>
          ) : (
            <ul className="space-y-3 mb-10">
              {budgets.map(b => (
                <li key={b.id} className="bg-white border border-slate-100 rounded-xl px-5 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800">{currency(b.amount_requested)}</p>
                      <p className="text-sm text-slate-500 mt-0.5">{b.purpose}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        <Link to={`/hub/events/${b.event_request_id}`} className="hover:text-blue-700">
                          {titles[b.event_request_id] ?? 'Event'}
                        </Link>
                        {b.submitted_at && <> · {formatDateTime(b.submitted_at)}</>}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <StatusBadge status={financeBadge(b.status)} />
                      {b.status === 'submitted' && (
                        <div className="flex gap-2">
                          <button onClick={() => void decide('budget_requests', b.id, 'approved')} disabled={busyId === b.id} className={approveBtn}>
                            Approve
                          </button>
                          <button onClick={() => void decide('budget_requests', b.id, 'rejected')} disabled={busyId === b.id} className={rejectBtn}>
                            Decline
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">Reimbursements</h2>
          {reimbursements.length === 0 ? (
            <EmptyCard>No reimbursements.</EmptyCard>
          ) : (
            <ul className="space-y-3">
              {reimbursements.map(r => (
                <li key={r.id} className="bg-white border border-slate-100 rounded-xl px-5 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800">{currency(r.amount_total)}</p>
                      <p className="text-sm text-slate-500 mt-0.5">Payable to {r.payee_name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        <Link to={`/hub/events/${r.event_request_id}`} className="hover:text-blue-700">
                          {titles[r.event_request_id] ?? 'Event'}
                        </Link>
                        {r.processed_at && <> · check processed {formatDateTime(r.processed_at)}</>}
                      </p>
                      {r.notes && <p className="text-sm text-slate-600 mt-1.5">{r.notes}</p>}
                      {receipts.filter(rc => rc.reimbursement_id === r.id).map(rc => (
                        <button
                          key={rc.id}
                          onClick={() => void viewReceipt(rc.storage_path)}
                          disabled={signing === rc.storage_path}
                          className="block text-xs font-medium text-blue-700 hover:text-blue-800 underline mt-1 disabled:opacity-60"
                        >
                          {signing === rc.storage_path ? 'Opening…' : 'View receipt'}
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <StatusBadge status={financeBadge(r.status)} />
                      {r.status === 'submitted' && (
                        <div className="flex gap-2">
                          <button onClick={() => void decide('reimbursements', r.id, 'approved')} disabled={busyId === r.id} className={approveBtn}>
                            Approve
                          </button>
                          <button onClick={() => void decide('reimbursements', r.id, 'rejected')} disabled={busyId === r.id} className={rejectBtn}>
                            Decline
                          </button>
                        </div>
                      )}
                      {r.status === 'approved' && !r.processed_at && (
                        <button onClick={() => void markProcessed(r.id)} disabled={busyId === r.id} className={approveBtn}>
                          Mark check sent
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </HubShell>
  );
}

const approveBtn =
  'bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs px-3 py-1.5 rounded-lg transition disabled:opacity-60';
const rejectBtn =
  'bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold text-xs px-3 py-1.5 rounded-lg transition disabled:opacity-60';

function EmptyCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl px-6 py-10 text-center mb-10">
      <p className="text-slate-500 text-sm">{children}</p>
    </div>
  );
}
