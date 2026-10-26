import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Ministry, useHubRole } from '../../lib/useHubRole';
import { toIso } from '../../lib/parishTime';
import { ErrorNote } from './HubShell';

interface Props {
  ministries: Ministry[];
  onCancel: () => void;
  onCreated: (id: string) => void;
}

export default function NewEventRequestForm({ ministries, onCancel, onCreated }: Props) {
  const { userId, isAdmin } = useHubRole();
  const navigate = useNavigate();

  const [allMinistries, setAllMinistries] = useState<Ministry[]>(ministries);
  const [ministryId, setMinistryId] = useState(ministries[0]?.id ?? '');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [timeTbd, setTimeTbd] = useState(false);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [needsComms, setNeedsComms] = useState(false);
  const [needsBudget, setNeedsBudget] = useState(false);
  const [needsRegistration, setNeedsRegistration] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // An admin may file on behalf of any ministry, so they need the full list.
  // `ministries` is publicly readable, so this is a plain select.
  useEffect(() => {
    if (!isAdmin) return;
    let cancelled = false;
    void supabase.from('ministries').select('id, name').order('name').then(({ data }) => {
      if (!cancelled && data) setAllMinistries(data as Ministry[]);
    });
    return () => { cancelled = true; };
  }, [isAdmin]);

  const options = isAdmin ? allMinistries : ministries;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!ministryId) {
      setError('Choose a ministry.');
      return;
    }
    if (!timeTbd && !startTime) {
      setError('Enter a start time, or tick "time to be decided".');
      return;
    }

    const startsAt = toIso(date, timeTbd ? '00:00' : startTime);
    const endsAt = !timeTbd && endTime ? toIso(date, endTime) : null;

    if (endsAt && endsAt < startsAt) {
      setError('The end time is before the start time.');
      return;
    }

    setSaving(true);
    const { data, error } = await supabase
      .from('event_requests')
      .insert({
        ministry_id: ministryId,
        created_by: userId,
        title: title.trim(),
        description: description.trim() || null,
        starts_at: startsAt,
        ends_at: endsAt,
        time_tbd: timeTbd,
        location: location.trim() || null,
        needs_communications: needsComms,
        needs_budget: needsBudget,
        needs_registration: needsRegistration,
      })
      .select('id')
      .single();

    setSaving(false);

    if (error) {
      setError(error.message);
      return;
    }
    onCreated(data.id);
    navigate(`/hub/events/${data.id}`);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
      <h2 className="font-semibold text-slate-800">New event request</h2>

      <Field label="Ministry">
        <select
          required
          value={ministryId}
          onChange={e => setMinistryId(e.target.value)}
          className={inputClass}
        >
          <option value="">Choose…</option>
          {options.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        {options.length === 0 && (
          <p className="text-xs text-amber-700 mt-1.5">
            No ministries exist yet — the parish office must add them first.
          </p>
        )}
      </Field>

      <Field label="Event name">
        <input
          required
          value={title}
          onChange={e => setTitle(e.target.value)}
          className={inputClass}
          placeholder="Advent Lessons and Carols"
        />
      </Field>

      <div className="grid sm:grid-cols-3 gap-4">
        <Field label="Date">
          <input required type="date" value={date} onChange={e => setDate(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Start time">
          <input
            type="time"
            value={startTime}
            disabled={timeTbd}
            onChange={e => setStartTime(e.target.value)}
            className={`${inputClass} disabled:bg-slate-50 disabled:text-slate-400`}
          />
        </Field>
        <Field label="End time">
          <input
            type="time"
            value={endTime}
            disabled={timeTbd}
            onChange={e => setEndTime(e.target.value)}
            className={`${inputClass} disabled:bg-slate-50 disabled:text-slate-400`}
          />
        </Field>
      </div>

      <Check checked={timeTbd} onChange={setTimeTbd} label="Time to be decided" />

      <Field label="Location">
        <input
          value={location}
          onChange={e => setLocation(e.target.value)}
          className={inputClass}
          placeholder="Parish Hall"
        />
      </Field>

      <Field label="Description">
        <textarea
          rows={3}
          value={description}
          onChange={e => setDescription(e.target.value)}
          className={inputClass}
          placeholder="What is it, who is it for?"
        />
      </Field>

      <fieldset className="border-t border-slate-100 pt-4">
        <legend className="text-sm font-medium text-slate-700 mb-2">This event needs</legend>
        <div className="space-y-2">
          <Check checked={needsComms} onChange={setNeedsComms} label="Promotion (bulletin, email, website…)" />
          <Check checked={needsBudget} onChange={setNeedsBudget} label="A budget" />
          <Check checked={needsRegistration} onChange={setNeedsRegistration} label="Registration or tickets" />
        </div>
      </fieldset>

      {error && <ErrorNote message={error} />}

      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm px-4 py-2.5 rounded-lg transition disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save as draft'}
        </button>
        <button type="button" onClick={onCancel} className="text-sm font-medium text-slate-600 hover:text-slate-900">
          Cancel
        </button>
      </div>
      <p className="text-xs text-slate-400">
        Saving creates a draft. Nothing is visible on the parish calendar until it's approved.
      </p>
    </form>
  );
}

const inputClass =
  'w-full px-4 py-2.5 rounded-lg border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-slate-700 mb-1.5">{label}</span>
      {children}
    </label>
  );
}

function Check({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-slate-300 text-blue-700 focus:ring-blue-500"
      />
      {label}
    </label>
  );
}

export { Field, Check, inputClass };
