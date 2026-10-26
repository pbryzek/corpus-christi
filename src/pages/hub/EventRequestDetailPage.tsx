import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useHubRole } from '../../lib/useHubRole';
import {
  BudgetRequest, CHANNEL_LABELS, CommsChannel, CommunicationsRequest,
  EventRequest, Reimbursement, ReimbursementReceipt, Room, RoomBooking,
} from '../../lib/hubTypes';
import { formatDateTime, formatDisplayTime, toIso } from '../../lib/parishTime';
import { currency, financeBadge } from '../../lib/hubFormat';
import HubShell, { ErrorNote, Spinner, StatusBadge } from '../../components/hub/HubShell';
import { Check, Field, inputClass } from '../../components/hub/NewEventRequestForm';

export default function EventRequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { userId, isAdmin } = useHubRole();

  const [req, setReq] = useState<EventRequest | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<RoomBooking[]>([]);
  const [budgets, setBudgets] = useState<BudgetRequest[]>([]);
  const [reimbursements, setReimbursements] = useState<Reimbursement[]>([]);
  const [receipts, setReceipts] = useState<ReimbursementReceipt[]>([]);
  const [comms, setComms] = useState<CommunicationsRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);

    const [reqRes, roomRes, bookRes, budgetRes, reimbRes, commsRes] = await Promise.all([
      supabase.from('event_requests').select('*').eq('id', id).maybeSingle(),
      supabase.from('rooms').select('id, name, capacity, is_active').eq('is_active', true).order('name'),
      supabase.from('room_bookings').select('*').eq('event_request_id', id).order('starts_at'),
      supabase.from('budget_requests').select('*').eq('event_request_id', id).order('created_at'),
      supabase.from('reimbursements').select('*').eq('event_request_id', id).order('created_at'),
      supabase.from('communications_requests').select('*').eq('event_request_id', id).order('created_at', { ascending: false }),
    ]);

    if (reqRes.error) { setError(reqRes.error.message); setLoading(false); return; }
    if (!reqRes.data) { setError('That event request does not exist, or you do not have access to it.'); setLoading(false); return; }

    setReq(reqRes.data as EventRequest);
    setRooms((roomRes.data ?? []) as Room[]);
    setBookings((bookRes.data ?? []) as RoomBooking[]);
    // budget_requests/reimbursements are invisible to the communications role by
    // design, so an empty result here is expected for them, not a failure.
    setBudgets((budgetRes.data ?? []) as BudgetRequest[]);
    const reimb = (reimbRes.data ?? []) as Reimbursement[];
    setReimbursements(reimb);
    setComms((commsRes.data ?? []) as CommunicationsRequest[]);

    if (reimb.length > 0) {
      const { data: receiptData } = await supabase
        .from('reimbursement_receipts')
        .select('*')
        .in('reimbursement_id', reimb.map(r => r.id));
      setReceipts((receiptData ?? []) as ReimbursementReceipt[]);
    } else {
      setReceipts([]);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => { void load(); }, [load]);

  async function setStatus(status: string, successMessage: string) {
    if (!id) return;
    setBusy(true);
    setError(null);
    setNotice(null);
    const { error } = await supabase.from('event_requests').update({ status }).eq('id', id);
    setBusy(false);
    if (error) setError(error.message);
    else { setNotice(successMessage); await load(); }
  }

  async function publish() {
    if (!id) return;
    setBusy(true);
    setError(null);
    setNotice(null);
    const { error } = await supabase.rpc('approve_event_request', { req: id });
    setBusy(false);
    if (error) setError(error.message);
    else { setNotice('Published to the parish calendar.'); await load(); }
  }

  async function withdraw() {
    if (!id) return;
    setBusy(true);
    setError(null);
    setNotice(null);
    const { error } = await supabase.rpc('unpublish_event_request', { req: id });
    setBusy(false);
    if (error) setError(error.message);
    else { setNotice('Removed from the parish calendar.'); await load(); }
  }

  if (loading) return <HubShell><Spinner /></HubShell>;

  if (!req) {
    return (
      <HubShell>
        <ErrorNote message={error ?? 'Not found.'} />
        <Link to="/hub" className="inline-block mt-4 text-sm font-medium text-blue-700">← Back to my events</Link>
      </HubShell>
    );
  }

  const mine = req.created_by === userId;
  const editable = ['draft', 'submitted', 'changes_requested'].includes(req.status);
  const canSubmit = mine && ['draft', 'changes_requested'].includes(req.status);

  return (
    <HubShell>
      <Link to="/hub" className="text-sm font-medium text-slate-500 hover:text-slate-800">← My events</Link>

      <div className="flex items-start justify-between gap-4 mt-3 mb-1">
        <h1 className="text-2xl font-bold text-slate-800">{req.title}</h1>
        <StatusBadge status={req.status} />
      </div>
      <p className="text-slate-500 text-sm mb-6">
        {formatDateTime(req.starts_at, req.time_tbd)}
        {req.ends_at && !req.time_tbd && <> – {formatDisplayTime(req.ends_at)}</>}
        {req.location && <> · {req.location}</>}
      </p>

      {notice && (
        <div className="mb-5 bg-emerald-50 border border-emerald-100 rounded-lg px-4 py-3 text-emerald-800 text-sm">
          {notice}
        </div>
      )}
      {error && <div className="mb-5"><ErrorNote message={error} /></div>}

      {req.review_notes && (
        <div className="mb-5 bg-amber-50 border border-amber-100 rounded-xl px-5 py-4">
          <p className="text-xs font-semibold text-amber-900 uppercase tracking-wide">Note from the office</p>
          <p className="text-sm text-amber-900 mt-1">{req.review_notes}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-3 mb-8">
        {canSubmit && (
          <button onClick={() => void setStatus('submitted', 'Sent to the parish office for approval.')} disabled={busy} className={primaryBtn}>
            Send for approval
          </button>
        )}
        {isAdmin && req.status === 'submitted' && (
          <>
            <button onClick={() => void publish()} disabled={busy} className={primaryBtn}>
              Approve &amp; publish
            </button>
            <button onClick={() => void setStatus('changes_requested', 'Sent back for changes.')} disabled={busy} className={secondaryBtn}>
              Request changes
            </button>
          </>
        )}
        {isAdmin && req.status === 'published' && (
          <button onClick={() => void withdraw()} disabled={busy} className={secondaryBtn}>
            Remove from calendar
          </button>
        )}
        {mine && editable && (
          <button onClick={() => void setStatus('cancelled', 'Event cancelled.')} disabled={busy} className={secondaryBtn}>
            Cancel event
          </button>
        )}
      </div>

      {req.published_event_id && (
        <div className="mb-8 bg-emerald-50 border border-emerald-100 rounded-xl px-5 py-4 text-sm text-emerald-900">
          This event is live on the{' '}
          <Link to="/calendar" className="font-semibold underline">parish calendar</Link>.
        </div>
      )}

      {req.description && (
        <Section title="Description">
          <p className="text-sm text-slate-600 whitespace-pre-line">{req.description}</p>
        </Section>
      )}

      <Section title="Rooms">
        <RoomSection
          requestId={req.id}
          rooms={rooms}
          bookings={bookings}
          eventDate={req.starts_at}
          editable={editable}
          onChange={load}
        />
      </Section>

      {(req.needs_communications || comms.length > 0) && (
        <Section title="Promotion">
          <CommsSection
            requestId={req.id}
            userId={userId}
            requests={comms}
            editable={editable}
            onChange={load}
          />
        </Section>
      )}

      {(req.needs_budget || budgets.length > 0) && (
        <Section title="Budget">
          <BudgetSection
            requestId={req.id}
            userId={userId}
            budgets={budgets}
            editable={editable}
            onChange={load}
          />
        </Section>
      )}

      {(req.needs_budget || reimbursements.length > 0) && (
        <Section title="Reimbursements">
          <ReimbursementSection
            requestId={req.id}
            userId={userId}
            reimbursements={reimbursements}
            receipts={receipts}
            onChange={load}
          />
        </Section>
      )}
    </HubShell>
  );
}

const primaryBtn =
  'bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm px-4 py-2.5 rounded-lg transition disabled:opacity-60';
const secondaryBtn =
  'bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold text-sm px-4 py-2.5 rounded-lg transition disabled:opacity-60';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">{title}</h2>
      <div className="bg-white border border-slate-100 rounded-2xl p-5">{children}</div>
    </section>
  );
}

/* ── Rooms ──────────────────────────────────────────────────────────────── */

function RoomSection({ requestId, rooms, bookings, eventDate, editable, onChange }: {
  requestId: string;
  rooms: Room[];
  bookings: RoomBooking[];
  eventDate: string;
  editable: boolean;
  onChange: () => Promise<void>;
}) {
  const { userId } = useHubRole();
  const [open, setOpen] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [date, setDate] = useState(eventDate.slice(0, 10));
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function book(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const startsAt = toIso(date, start);
    const endsAt = toIso(date, end);
    if (endsAt <= startsAt) { setError('The end time must be after the start time.'); return; }

    setBusy(true);
    const { error } = await supabase.from('room_bookings').insert({
      room_id: roomId,
      event_request_id: requestId,
      starts_at: startsAt,
      ends_at: endsAt,
      setup_notes: notes.trim() || null,
      created_by: userId,
    });
    setBusy(false);

    if (error) {
      // 23P01 is the exclusion constraint: another booking already holds the slot.
      setError(
        error.code === '23P01'
          ? 'That room is already booked for part of that time. Pick another slot or room.'
          : error.message,
      );
      return;
    }
    setOpen(false);
    setRoomId(''); setStart(''); setEnd(''); setNotes('');
    await onChange();
  }

  async function release(bookingId: string) {
    setBusy(true);
    const { error } = await supabase.from('room_bookings').update({ status: 'released' }).eq('id', bookingId);
    setBusy(false);
    if (error) setError(error.message);
    else await onChange();
  }

  const live = bookings.filter(b => b.status !== 'released');

  return (
    <div className="space-y-4">
      {live.length === 0 ? (
        <p className="text-sm text-slate-500">No room reserved.</p>
      ) : (
        <ul className="divide-y divide-slate-100 -my-1">
          {live.map(b => {
            const room = rooms.find(r => r.id === b.room_id);
            return (
              <li key={b.id} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800">{room?.name ?? 'Room'}</p>
                  <p className="text-xs text-slate-500">
                    {formatDateTime(b.starts_at)} – {formatDisplayTime(b.ends_at)}
                  </p>
                  {b.setup_notes && <p className="text-xs text-slate-400 mt-0.5">{b.setup_notes}</p>}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <StatusBadge status={b.status === 'confirmed' ? 'approved' : 'submitted'} />
                  {editable && (
                    <button onClick={() => void release(b.id)} disabled={busy} className="text-xs font-medium text-slate-500 hover:text-red-700">
                      Release
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {rooms.length === 0 ? (
        <p className="text-xs text-amber-700">
          No rooms have been set up yet — the parish office adds the bookable spaces.
        </p>
      ) : editable && !open ? (
        <button onClick={() => setOpen(true)} className="text-sm font-medium text-blue-700 hover:text-blue-800">
          + Reserve a room
        </button>
      ) : null}

      {open && (
        <form onSubmit={book} className="border-t border-slate-100 pt-4 space-y-4">
          <Field label="Room">
            <select required value={roomId} onChange={e => setRoomId(e.target.value)} className={inputClass}>
              <option value="">Choose…</option>
              {rooms.map(r => (
                <option key={r.id} value={r.id}>
                  {r.name}{r.capacity ? ` (holds ${r.capacity})` : ''}
                </option>
              ))}
            </select>
          </Field>
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Date">
              <input required type="date" value={date} onChange={e => setDate(e.target.value)} className={inputClass} />
            </Field>
            <Field label="From">
              <input required type="time" value={start} onChange={e => setStart(e.target.value)} className={inputClass} />
            </Field>
            <Field label="To">
              <input required type="time" value={end} onChange={e => setEnd(e.target.value)} className={inputClass} />
            </Field>
          </div>
          <Field label="Setup notes">
            <input value={notes} onChange={e => setNotes(e.target.value)} className={inputClass} placeholder="30 chairs in a circle, projector" />
          </Field>
          {error && <ErrorNote message={error} />}
          <div className="flex items-center gap-3">
            <button type="submit" disabled={busy} className={primaryBtn}>
              {busy ? 'Reserving…' : 'Request room'}
            </button>
            <button type="button" onClick={() => { setOpen(false); setError(null); }} className="text-sm font-medium text-slate-600">
              Cancel
            </button>
          </div>
          <p className="text-xs text-slate-400">
            Includes setup and cleanup time — the room is held for the whole slot you enter.
          </p>
        </form>
      )}
      {!open && error && <ErrorNote message={error} />}
    </div>
  );
}

/* ── Promotion ──────────────────────────────────────────────────────────── */

const OFFERED_CHANNELS: CommsChannel[] = [
  'bulletin', 'weekly_email', 'pulpit_announcement', 'website', 'flyer', 'signup_form',
];

function CommsSection({ requestId, userId, requests, editable, onChange }: {
  requestId: string;
  userId: string | null;
  requests: CommunicationsRequest[];
  editable: boolean;
  onChange: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [headline, setHeadline] = useState('');
  const [body, setBody] = useState('');
  const [cta, setCta] = useState('');
  const [neededBy, setNeededBy] = useState('');
  const [channels, setChannels] = useState<CommsChannel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function toggle(c: CommsChannel) {
    setChannels(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (channels.length === 0) {
      setError('Choose at least one place to promote this.');
      return;
    }
    setBusy(true);
    const { error } = await supabase.from('communications_requests').insert({
      event_request_id: requestId,
      requested_by: userId,
      headline: headline.trim(),
      body_copy: body.trim() || null,
      call_to_action: cta.trim() || null,
      needed_by: neededBy || null,
      channels,
      status: 'requested',
    });
    setBusy(false);
    if (error) { setError(error.message); return; }
    setOpen(false);
    setHeadline(''); setBody(''); setCta(''); setNeededBy(''); setChannels([]);
    await onChange();
  }

  return (
    <div className="space-y-4">
      {requests.length === 0 ? (
        <p className="text-sm text-slate-500">No promotion requested yet.</p>
      ) : (
        <ul className="divide-y divide-slate-100 -my-1">
          {requests.map(c => (
            <li key={c.id} className="py-3">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800">{c.headline}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {c.channels.map(ch => CHANNEL_LABELS[ch]).join(' · ')}
                  </p>
                  {c.needed_by && (
                    <p className="text-xs text-slate-400 mt-0.5">Needed by {c.needed_by}</p>
                  )}
                  {c.handler_notes && (
                    <p className="text-xs text-slate-500 mt-1 italic">{c.handler_notes}</p>
                  )}
                </div>
                <StatusBadge status={c.status === 'requested' ? 'submitted' : c.status} />
              </div>
            </li>
          ))}
        </ul>
      )}

      {editable && !open && (
        <button onClick={() => setOpen(true)} className="text-sm font-medium text-blue-700 hover:text-blue-800">
          + Request promotion
        </button>
      )}

      {open && (
        <form onSubmit={submit} className="border-t border-slate-100 pt-4 space-y-4">
          <Field label="Headline">
            <input required value={headline} onChange={e => setHeadline(e.target.value)} className={inputClass} placeholder="Join us for Lessons and Carols" />
          </Field>
          <Field label="Copy">
            <textarea rows={3} value={body} onChange={e => setBody(e.target.value)} className={inputClass} placeholder="The text you'd like used, if you have it." />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Call to action">
              <input value={cta} onChange={e => setCta(e.target.value)} className={inputClass} placeholder="Sign up at the parish office" />
            </Field>
            <Field label="Needed by">
              <input type="date" value={neededBy} onChange={e => setNeededBy(e.target.value)} className={inputClass} />
            </Field>
          </div>
          <fieldset>
            <legend className="text-sm font-medium text-slate-700 mb-2">Where</legend>
            <div className="grid sm:grid-cols-2 gap-y-2">
              {OFFERED_CHANNELS.map(c => (
                <Check key={c} checked={channels.includes(c)} onChange={() => toggle(c)} label={CHANNEL_LABELS[c]} />
              ))}
            </div>
          </fieldset>
          {error && <ErrorNote message={error} />}
          <div className="flex items-center gap-3">
            <button type="submit" disabled={busy} className={primaryBtn}>
              {busy ? 'Sending…' : 'Send to communications'}
            </button>
            <button type="button" onClick={() => { setOpen(false); setError(null); }} className="text-sm font-medium text-slate-600">
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

/* ── Budget ─────────────────────────────────────────────────────────────── */

function BudgetSection({ requestId, userId, budgets, editable, onChange }: {
  requestId: string;
  userId: string | null;
  budgets: BudgetRequest[];
  editable: boolean;
  onChange: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const value = Number(amount);
    if (!Number.isFinite(value) || value < 0) {
      setError('Enter a valid amount.');
      return;
    }
    setBusy(true);
    const { error } = await supabase.from('budget_requests').insert({
      event_request_id: requestId,
      submitted_by: userId,
      amount_requested: value,
      purpose: purpose.trim(),
      status: 'submitted',
    });
    setBusy(false);
    if (error) { setError(error.message); return; }
    setOpen(false);
    setAmount(''); setPurpose('');
    await onChange();
  }

  return (
    <div className="space-y-4">
      {budgets.length === 0 ? (
        <p className="text-sm text-slate-500">No budget requested yet.</p>
      ) : (
        <ul className="divide-y divide-slate-100 -my-1">
          {budgets.map(b => (
            <li key={b.id} className="flex items-start justify-between gap-4 py-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800">
                  {currency(b.amount_requested)}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{b.purpose}</p>
                {b.decision_notes && (
                  <p className="text-xs text-slate-500 mt-1 italic">{b.decision_notes}</p>
                )}
              </div>
              <StatusBadge status={financeBadge(b.status)} />
            </li>
          ))}
        </ul>
      )}

      {editable && !open && (
        <button onClick={() => setOpen(true)} className="text-sm font-medium text-blue-700 hover:text-blue-800">
          + Request a budget
        </button>
      )}

      {open && (
        <form onSubmit={submit} className="border-t border-slate-100 pt-4 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Amount (USD)">
              <input
                required type="number" min="0" step="0.01"
                value={amount} onChange={e => setAmount(e.target.value)}
                className={inputClass} placeholder="450.00"
              />
            </Field>
            <Field label="What for">
              <input required value={purpose} onChange={e => setPurpose(e.target.value)} className={inputClass} placeholder="Food and supplies" />
            </Field>
          </div>
          {error && <ErrorNote message={error} />}
          <div className="flex items-center gap-3">
            <button type="submit" disabled={busy} className={primaryBtn}>
              {busy ? 'Sending…' : 'Send to finance'}
            </button>
            <button type="button" onClick={() => { setOpen(false); setError(null); }} className="text-sm font-medium text-slate-600">
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

/* ── Reimbursements ─────────────────────────────────────────────────────── */

/**
 * A reimbursement can carry several receipts (`reimbursement_receipts`), but
 * this form attaches at most one at submission time — adding more later is a
 * follow-up, not something the first version needs. The file goes to the
 * PRIVATE `finance-docs` bucket, so it is served through a signed URL the
 * viewer requests on demand, never a public storage URL.
 */
function ReimbursementSection({ requestId, userId, reimbursements, receipts, onChange }: {
  requestId: string;
  userId: string | null;
  reimbursements: Reimbursement[];
  receipts: ReimbursementReceipt[];
  onChange: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [payee, setPayee] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [signing, setSigning] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const value = Number(amount);
    if (!Number.isFinite(value) || value < 0) {
      setError('Enter a valid amount.');
      return;
    }

    setBusy(true);
    const { data: created, error: insertError } = await supabase
      .from('reimbursements')
      .insert({
        event_request_id: requestId,
        submitted_by: userId,
        payee_name: payee.trim(),
        amount_total: value,
        notes: notes.trim() || null,
        status: 'submitted',
      })
      .select('id')
      .single();

    if (insertError) {
      setError(insertError.message);
      setBusy(false);
      return;
    }

    if (file) {
      const path = `${created.id}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('finance-docs')
        .upload(path, file, { contentType: file.type || 'application/octet-stream' });

      if (uploadError) {
        // The reimbursement itself was saved; only the attachment failed. Say
        // so rather than implying the whole submission needs to be redone.
        setError(`Submitted, but the receipt failed to upload: ${uploadError.message}`);
      } else {
        await supabase.from('reimbursement_receipts').insert({
          reimbursement_id: created.id,
          storage_path: path,
          amount: value,
          uploaded_by: userId,
        });
      }
    }

    setBusy(false);
    setOpen(false);
    setPayee(''); setAmount(''); setNotes(''); setFile(null);
    await onChange();
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

  return (
    <div className="space-y-4">
      {reimbursements.length === 0 ? (
        <p className="text-sm text-slate-500">No reimbursements submitted yet.</p>
      ) : (
        <ul className="divide-y divide-slate-100 -my-1">
          {reimbursements.map(r => {
            const own = receipts.filter(rc => rc.reimbursement_id === r.id);
            return (
              <li key={r.id} className="py-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800">{currency(r.amount_total)}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Payable to {r.payee_name}</p>
                    {r.notes && <p className="text-xs text-slate-500 mt-1">{r.notes}</p>}
                    {r.decision_notes && (
                      <p className="text-xs text-slate-500 mt-1 italic">{r.decision_notes}</p>
                    )}
                    {r.processed_at && (
                      <p className="text-xs text-emerald-700 mt-1">Check sent {formatDateTime(r.processed_at)}</p>
                    )}
                    {own.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {own.map(rc => (
                          <button
                            key={rc.id}
                            onClick={() => void viewReceipt(rc.storage_path)}
                            disabled={signing === rc.storage_path}
                            className="text-xs font-medium text-blue-700 hover:text-blue-800 underline disabled:opacity-60"
                          >
                            {signing === rc.storage_path ? 'Opening…' : 'View receipt'}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <StatusBadge status={financeBadge(r.status)} />
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Unlike the budget request above, this is never gated on `editable`:
          a reimbursement is normally filed AFTER the event happens, when the
          request is already published or closed. */}
      {!open && (
        <button onClick={() => setOpen(true)} className="text-sm font-medium text-blue-700 hover:text-blue-800">
          + Submit a reimbursement
        </button>
      )}

      {open && (
        <form onSubmit={submit} className="border-t border-slate-100 pt-4 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Payee name">
              <input required value={payee} onChange={e => setPayee(e.target.value)} className={inputClass} placeholder="Who should be paid back" />
            </Field>
            <Field label="Amount (USD)">
              <input
                required type="number" min="0" step="0.01"
                value={amount} onChange={e => setAmount(e.target.value)}
                className={inputClass} placeholder="82.50"
              />
            </Field>
          </div>
          <Field label="Notes">
            <input value={notes} onChange={e => setNotes(e.target.value)} className={inputClass} placeholder="What the expense was for" />
          </Field>
          <Field label="Receipt (optional)">
            <input
              type="file"
              accept="application/pdf,image/*"
              onChange={e => setFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-slate-600"
            />
            <p className="text-xs text-slate-400 mt-1">
              Only you, finance and the office can ever open this file — it is never public.
            </p>
          </Field>
          {error && <ErrorNote message={error} />}
          <div className="flex items-center gap-3">
            <button type="submit" disabled={busy} className={primaryBtn}>
              {busy ? 'Sending…' : 'Send to finance'}
            </button>
            <button type="button" onClick={() => { setOpen(false); setError(null); }} className="text-sm font-medium text-slate-600">
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

