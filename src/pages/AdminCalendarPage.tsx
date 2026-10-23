import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, CreditCard as Edit2, Trash2, X, Check, LogOut, Calendar, Users, Heart, BookOpen, ChevronDown, ChevronUp, AlertTriangle, ExternalLink, FileText, Newspaper, Upload, Megaphone } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/useAuth';
import AdminPagesTab from '../components/AdminPagesTab';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  end_time: string | null;
  event_type: string;
  location: string | null;
  is_featured: boolean;
  recurrence: string | null;
  event_url: string | null;
  time_tbd: boolean;
}

interface Registration {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  interests: string | null;
  message: string | null;
  created_at: string;
}

interface PrayerIntention {
  id: string;
  intention_text: string;
  submitter_name: string;
  submitter_email: string;
  is_anonymous: boolean;
  prayed_for: boolean;
  created_at: string;
}

interface SacramentInquiry {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  sacrament_interest: string;
  message: string | null;
  created_at: string;
}

type Tab = 'calendar' | 'registrations' | 'prayer' | 'sacraments' | 'pages' | 'bulletins' | 'announcements';

interface Bulletin {
  id: string;
  title: string;
  published_date: string;
  file_url: string;
  kind: BulletinKind;
  created_at: string;
}

type BulletinKind = 'bulletin' | 'worship_aide';

interface Announcement {
  id: string;
  title: string;
  body: string;
  link_url: string | null;
  link_label: string | null;
  is_active: boolean;
  show_on_home: boolean;
  show_on_living_faith: boolean;
  sort_order: number;
  created_at: string;
}

const emptyAnnouncement = {
  title: '',
  body: '',
  link_url: '',
  link_label: '',
  is_active: true,
  show_on_home: true,
  show_on_living_faith: false,
  sort_order: 0,
};

type AnnouncementForm = typeof emptyAnnouncement;

// ─── Event Form ───────────────────────────────────────────────────────────────

const emptyForm = {
  title: '',
  description: '',
  event_date: '',
  event_time: '',
  end_time: '',
  event_type: 'Event',
  location: '',
  is_featured: false,
  recurrence: '',
  event_url: '',
};

type FormData = typeof emptyForm;

function toIso(dateStr: string, timeStr: string): string {
  if (!dateStr) return '';
  const t = timeStr || '00:00';
  // Determine the Pacific offset (PDT vs PST) for the given date/time so the
  // value is stored as the correct UTC instant rather than being misread as UTC.
  const probeUtc = new Date(`${dateStr}T${t}:00Z`);
  const tzPart = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    timeZoneName: 'shortOffset',
  }).formatToParts(probeUtc).find(p => p.type === 'timeZoneName')?.value ?? 'GMT-7';
  const m = tzPart.match(/GMT([+-])(\d+)/);
  const sign = m?.[1] ?? '-';
  const hrs = (m?.[2] ?? '7').padStart(2, '0');
  return new Date(`${dateStr}T${t}:00${sign}${hrs}:00`).toISOString();
}

const TZ = 'America/Los_Angeles';

function toDateStr(iso: string) {
  if (!iso) return '';
  // Extract YYYY-MM-DD in PT so the date picker pre-fills correctly
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' })
    .format(new Date(iso));
  return parts; // en-CA gives YYYY-MM-DD
}

function toTimeStr(iso: string) {
  if (!iso) return '';
  return new Date(iso).toLocaleTimeString('en-US', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hour12: false });
}

function formatDisplayDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { timeZone: TZ, month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDisplayTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { timeZone: TZ, hour: 'numeric', minute: '2-digit', hour12: true });
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function AdminCalendarPage() {
  const navigate = useNavigate();
  const { session, signOut } = useAuth();
  const [tab, setTab] = useState<Tab>('calendar');

  // Events
  const [events, setEvents] = useState<Event[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [formSaving, setFormSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Registrations
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [regsLoading, setRegsLoading] = useState(false);
  const [expandedReg, setExpandedReg] = useState<string | null>(null);

  // Prayer
  const [prayers, setPrayers] = useState<PrayerIntention[]>([]);
  const [prayersLoading, setPrayersLoading] = useState(false);

  // Sacrament Inquiries
  const [inquiries, setInquiries] = useState<SacramentInquiry[]>([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);
  const [expandedInquiry, setExpandedInquiry] = useState<string | null>(null);

  // Bulletins
  const [bulletins, setBulletins] = useState<Bulletin[]>([]);
  const [bulletinsLoading, setBulletinsLoading] = useState(false);
  const [bulletinTitle, setBulletinTitle] = useState('');
  const [bulletinDate, setBulletinDate] = useState('');
  const [bulletinFile, setBulletinFile] = useState<File | null>(null);
  const [bulletinKind, setBulletinKind] = useState<BulletinKind>('bulletin');
  const [bulletinUploading, setBulletinUploading] = useState(false);
  const [bulletinError, setBulletinError] = useState('');

  // Announcements
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [announcementsLoading, setAnnouncementsLoading] = useState(false);
  const [announcementForm, setAnnouncementForm] = useState<AnnouncementForm>(emptyAnnouncement);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [announcementSaving, setAnnouncementSaving] = useState(false);
  const [announcementDeleteConfirm, setAnnouncementDeleteConfirm] = useState<string | null>(null);

  // ── Load events ──
  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    setEventsLoading(true);
    const { data } = await supabase.from('events').select('*').order('event_date', { ascending: true });
    setEvents(data || []);
    setEventsLoading(false);
  }

  // ── Load tab data lazily ──
  useEffect(() => {
    if (tab === 'registrations' && registrations.length === 0) loadRegistrations();
    if (tab === 'prayer' && prayers.length === 0) loadPrayers();
    if (tab === 'sacraments' && inquiries.length === 0) loadInquiries();
    if (tab === 'bulletins' && bulletins.length === 0) loadBulletins();
    if (tab === 'announcements' && announcements.length === 0) loadAnnouncements();
  }, [tab]);

  async function loadRegistrations() {
    setRegsLoading(true);
    const { data } = await supabase.from('registrations').select('*').order('created_at', { ascending: false });
    setRegistrations(data || []);
    setRegsLoading(false);
  }

  async function loadPrayers() {
    setPrayersLoading(true);
    const { data } = await supabase.from('prayer_intentions').select('*').order('created_at', { ascending: false });
    setPrayers(data || []);
    setPrayersLoading(false);
  }

  async function loadInquiries() {
    setInquiriesLoading(true);
    const { data } = await supabase.from('sacrament_inquiries').select('*').order('created_at', { ascending: false });
    setInquiries(data || []);
    setInquiriesLoading(false);
  }

  // ── Event CRUD ──

  function openNewForm() {
    setEditingEvent(null);
    setFormData(emptyForm);
    setShowForm(true);
  }

  function openEditForm(event: Event) {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      event_date: toDateStr(event.event_date),
      event_time: toTimeStr(event.event_date),
      end_time: event.end_time ? toTimeStr(event.end_time) : '',
      event_type: event.event_type,
      location: event.location || '',
      is_featured: event.is_featured,
      recurrence: event.recurrence || '',
      event_url: event.event_url || '',
    });
    setShowForm(true);
  }

  async function saveEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.title || !formData.event_date) return;
    setFormSaving(true);

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      event_date: toIso(formData.event_date, formData.event_time),
      end_time: formData.end_time ? toIso(formData.event_date, formData.end_time) : null,
      event_type: formData.event_type,
      location: formData.location.trim() || null,
      is_featured: formData.is_featured,
      recurrence: formData.recurrence || null,
      event_url: formData.event_url.trim() || null,
      updated_at: new Date().toISOString(),
    };

    if (editingEvent) {
      await supabase.from('events').update(payload).eq('id', editingEvent.id);
    } else {
      await supabase.from('events').insert(payload);
    }

    setFormSaving(false);
    setShowForm(false);
    setEditingEvent(null);
    loadEvents();
  }

  async function deleteEvent(id: string) {
    await supabase.from('events').delete().eq('id', id);
    setDeleteConfirm(null);
    loadEvents();
  }

  // ── Prayer ──
  async function togglePrayed(prayer: PrayerIntention) {
    await supabase.from('prayer_intentions').update({ prayed_for: !prayer.prayed_for }).eq('id', prayer.id);
    setPrayers(prev => prev.map(p => p.id === prayer.id ? { ...p, prayed_for: !p.prayed_for } : p));
  }

  async function deletePrayer(id: string) {
    await supabase.from('prayer_intentions').delete().eq('id', id);
    setPrayers(prev => prev.filter(p => p.id !== id));
  }

  // ── Inquiry ──
  async function deleteInquiry(id: string) {
    await supabase.from('sacrament_inquiries').delete().eq('id', id);
    setInquiries(prev => prev.filter(i => i.id !== id));
  }

  // ── Bulletins ──
  async function loadBulletins() {
    setBulletinsLoading(true);
    const { data } = await supabase.from('bulletins').select('*').order('published_date', { ascending: false });
    setBulletins(data || []);
    setBulletinsLoading(false);
  }

  async function uploadBulletin(e: React.FormEvent) {
    e.preventDefault();
    if (!bulletinTitle.trim() || !bulletinDate || !bulletinFile) return;
    setBulletinUploading(true);
    setBulletinError('');

    const ext = bulletinFile.name.split('.').pop()?.toLowerCase();
    const filename = `${bulletinDate}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('bulletins')
      .upload(filename, bulletinFile, { contentType: 'application/pdf' });

    if (uploadError) {
      setBulletinError('Upload failed. Please try again.');
      setBulletinUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from('bulletins').getPublicUrl(filename);

    const { error: insertError } = await supabase.from('bulletins').insert({
      title: bulletinTitle.trim(),
      published_date: bulletinDate,
      file_url: urlData.publicUrl,
      kind: bulletinKind,
    });

    if (insertError) {
      setBulletinError('Failed to save the upload. Please try again.');
      setBulletinUploading(false);
      return;
    }

    setBulletinTitle('');
    setBulletinDate('');
    setBulletinFile(null);
    setBulletinUploading(false);
    loadBulletins();
  }

  async function deleteBulletin(bulletin: Bulletin) {
    // Only delete from storage if it's a Supabase-hosted URL
    if (bulletin.file_url.includes('/storage/v1/object/public/bulletins/')) {
      const path = bulletin.file_url.split('/storage/v1/object/public/bulletins/')[1];
      await supabase.storage.from('bulletins').remove([path]);
    }
    await supabase.from('bulletins').delete().eq('id', bulletin.id);
    setBulletins(prev => prev.filter(b => b.id !== bulletin.id));
  }

  // ── Announcements ──
  async function loadAnnouncements() {
    setAnnouncementsLoading(true);
    const { data } = await supabase
      .from('announcements')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });
    setAnnouncements(data || []);
    setAnnouncementsLoading(false);
  }

  function resetAnnouncementForm() {
    setEditingAnnouncement(null);
    setAnnouncementForm(emptyAnnouncement);
  }

  function openEditAnnouncement(a: Announcement) {
    setEditingAnnouncement(a);
    setAnnouncementForm({
      title: a.title,
      body: a.body,
      link_url: a.link_url || '',
      link_label: a.link_label || '',
      is_active: a.is_active,
      show_on_home: a.show_on_home,
      show_on_living_faith: a.show_on_living_faith,
      sort_order: a.sort_order,
    });
  }

  async function saveAnnouncement(e: React.FormEvent) {
    e.preventDefault();
    if (!announcementForm.title.trim() || !announcementForm.body.trim()) return;
    setAnnouncementSaving(true);
    const payload = {
      title: announcementForm.title.trim(),
      body: announcementForm.body.trim(),
      link_url: announcementForm.link_url.trim() || null,
      link_label: announcementForm.link_label.trim() || null,
      is_active: announcementForm.is_active,
      show_on_home: announcementForm.show_on_home,
      show_on_living_faith: announcementForm.show_on_living_faith,
      sort_order: Number(announcementForm.sort_order) || 0,
      updated_at: new Date().toISOString(),
    };
    if (editingAnnouncement) {
      await supabase.from('announcements').update(payload).eq('id', editingAnnouncement.id);
    } else {
      await supabase.from('announcements').insert(payload);
    }
    setAnnouncementSaving(false);
    resetAnnouncementForm();
    loadAnnouncements();
  }

  async function toggleAnnouncementActive(a: Announcement) {
    await supabase
      .from('announcements')
      .update({ is_active: !a.is_active, updated_at: new Date().toISOString() })
      .eq('id', a.id);
    setAnnouncements(prev => prev.map(x => x.id === a.id ? { ...x, is_active: !x.is_active } : x));
  }

  async function deleteAnnouncement(id: string) {
    await supabase.from('announcements').delete().eq('id', id);
    setAnnouncements(prev => prev.filter(x => x.id !== id));
    setAnnouncementDeleteConfirm(null);
    if (editingAnnouncement?.id === id) resetAnnouncementForm();
  }

  // ── Registration ──
  async function deleteRegistration(id: string) {
    await supabase.from('registrations').delete().eq('id', id);
    setRegistrations(prev => prev.filter(r => r.id !== id));
  }

  async function handleLogout() {
    await signOut();
    navigate('/admin/login', { replace: true });
  }

  if (!session) return null;

  const recurringEvents = events.filter(e => e.recurrence);
  const oneOffEvents = events.filter(e => !e.recurrence);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Bar */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M12 2v20M2 12h20" />
            </svg>
          </div>
          <div>
            <span className="font-bold text-slate-800 text-sm">Corpus Christi</span>
            <span className="text-slate-400 text-xs block leading-none">Admin Dashboard</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500 hidden sm:block">{session.user.email}</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-600 transition"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:block">Log out</span>
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 px-6">
        <div className="flex gap-0 max-w-5xl mx-auto">
          {[
            { id: 'calendar', label: 'Calendar', icon: Calendar },
            { id: 'registrations', label: 'Registrations', icon: Users },
            { id: 'prayer', label: 'Prayer Intentions', icon: Heart },
            { id: 'sacraments', label: 'Sacrament Inquiries', icon: BookOpen },
            { id: 'bulletins', label: 'Bulletins', icon: Newspaper },
            { id: 'announcements', label: 'Announcements', icon: Megaphone },
            { id: 'pages', label: 'Pages', icon: FileText },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id as Tab)}
              className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium border-b-2 transition -mb-px ${
                tab === id
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:block">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* ─── CALENDAR TAB ─── */}
        {tab === 'calendar' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800">Manage Events</h2>
              <button
                onClick={openNewForm}
                className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
              >
                <Plus className="w-4 h-4" />
                Add Event
              </button>
            </div>

            {eventsLoading ? (
              <div className="space-y-3">
                {[1,2,3].map(i => <div key={i} className="h-16 bg-white rounded-xl animate-pulse" />)}
              </div>
            ) : (
              <>
                {/* Recurring Mass Schedule */}
                {recurringEvents.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Recurring Mass Schedule</h3>
                    <div className="bg-white rounded-xl border border-slate-100 divide-y divide-slate-50 shadow-sm">
                      {recurringEvents.map(event => (
                        <EventRow
                          key={event.id}
                          event={event}
                          onEdit={openEditForm}
                          onDelete={id => setDeleteConfirm(id)}
                          deleteConfirm={deleteConfirm}
                          onConfirmDelete={deleteEvent}
                          onCancelDelete={() => setDeleteConfirm(null)}
                          isRecurring
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* One-off Events */}
                <div>
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Upcoming Events</h3>
                  {oneOffEvents.length === 0 ? (
                    <div className="bg-white rounded-xl border border-slate-100 p-8 text-center text-slate-400 text-sm shadow-sm">
                      No events added yet.{' '}
                      <button onClick={openNewForm} className="text-blue-600 hover:underline">Add one →</button>
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl border border-slate-100 divide-y divide-slate-50 shadow-sm">
                      {oneOffEvents.map(event => (
                        <EventRow
                          key={event.id}
                          event={event}
                          onEdit={openEditForm}
                          onDelete={id => setDeleteConfirm(id)}
                          deleteConfirm={deleteConfirm}
                          onConfirmDelete={deleteEvent}
                          onCancelDelete={() => setDeleteConfirm(null)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* ─── REGISTRATIONS TAB ─── */}
        {tab === 'registrations' && (
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-6">
              Visitor Registrations
              {registrations.length > 0 && <span className="ml-2 text-sm font-normal text-slate-400">({registrations.length})</span>}
            </h2>
            {regsLoading ? (
              <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-white rounded-xl animate-pulse" />)}</div>
            ) : registrations.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-100 p-8 text-center text-slate-400 text-sm shadow-sm">No registrations yet.</div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-100 divide-y divide-slate-50 shadow-sm">
                {registrations.map(reg => (
                  <div key={reg.id} className="px-5 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <button
                          onClick={() => setExpandedReg(expandedReg === reg.id ? null : reg.id)}
                          className="flex items-center gap-2 text-left w-full group"
                        >
                          <div>
                            <span className="font-medium text-slate-800 text-sm">{reg.first_name} {reg.last_name}</span>
                            <span className="text-slate-400 text-xs ml-2">{reg.email}</span>
                          </div>
                          {expandedReg === reg.id ? <ChevronUp className="w-4 h-4 text-slate-400 ml-auto" /> : <ChevronDown className="w-4 h-4 text-slate-400 ml-auto" />}
                        </button>
                        {expandedReg === reg.id && (
                          <div className="mt-3 space-y-1.5 text-sm text-slate-600 pl-0">
                            {reg.phone && <p><span className="text-slate-400">Phone:</span> {reg.phone}</p>}
                            {reg.interests && <p><span className="text-slate-400">Interests:</span> {reg.interests}</p>}
                            {reg.message && <p><span className="text-slate-400">Message:</span> {reg.message}</p>}
                            <p className="text-slate-400 text-xs">{new Date(reg.created_at).toLocaleDateString('en-US', { timeZone: TZ, month: 'long', day: 'numeric', year: 'numeric' })}</p>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => deleteRegistration(reg.id)}
                        className="text-slate-300 hover:text-red-400 transition flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── PRAYER INTENTIONS TAB ─── */}
        {tab === 'prayer' && (
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-6">
              Prayer Intentions
              {prayers.length > 0 && <span className="ml-2 text-sm font-normal text-slate-400">({prayers.length})</span>}
            </h2>
            {prayersLoading ? (
              <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-white rounded-xl animate-pulse" />)}</div>
            ) : prayers.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-100 p-8 text-center text-slate-400 text-sm shadow-sm">No prayer intentions submitted yet.</div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-100 divide-y divide-slate-50 shadow-sm">
                {prayers.map(prayer => (
                  <div key={prayer.id} className={`px-5 py-4 flex items-start gap-4 transition ${prayer.prayed_for ? 'opacity-60' : ''}`}>
                    <button
                      onClick={() => togglePrayed(prayer)}
                      title={prayer.prayed_for ? 'Mark as not prayed for' : 'Mark as prayed for'}
                      className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${prayer.prayed_for ? 'bg-green-500 border-green-500' : 'border-slate-300 hover:border-green-400'}`}
                    >
                      {prayer.prayed_for && <Check className="w-3 h-3 text-white" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm text-slate-800 leading-relaxed ${prayer.prayed_for ? 'line-through text-slate-400' : ''}`}>
                        {prayer.intention_text}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {prayer.is_anonymous ? 'Anonymous' : prayer.submitter_name}
                        {' · '}{new Date(prayer.created_at).toLocaleDateString('en-US', { timeZone: TZ, month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <button
                      onClick={() => deletePrayer(prayer.id)}
                      className="text-slate-300 hover:text-red-400 transition flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── BULLETINS TAB ─── */}
        {tab === 'bulletins' && (
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-6">Bulletins &amp; Worship Aids</h2>

            {/* Upload form */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm px-6 py-5 mb-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Upload New {bulletinKind === 'worship_aide' ? 'Worship Aid' : 'Bulletin'}</h3>
              <form onSubmit={uploadBulletin} className="space-y-4">
                <div className="inline-flex rounded-lg bg-slate-100 p-1" role="radiogroup" aria-label="Upload type">
                  {([['bulletin', 'Bulletin'], ['worship_aide', 'Worship Aid']] as const).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      role="radio"
                      aria-checked={bulletinKind === value}
                      onClick={() => setBulletinKind(value)}
                      className={`px-4 py-1.5 text-sm font-medium rounded-md transition ${bulletinKind === value ? 'bg-white text-blue-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                {bulletinKind === 'worship_aide' && (
                  <p className="text-xs text-slate-500">The most recent worship aid appears in the "This Week's Worship Aid" box on the Bulletins page.</p>
                )}
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField label="Title *">
                    <input
                      required
                      value={bulletinTitle}
                      onChange={e => setBulletinTitle(e.target.value)}
                      className="input"
                      placeholder="e.g. Thirteenth Sunday in Ordinary Time"
                    />
                  </FormField>
                  <FormField label={bulletinKind === 'worship_aide' ? 'Mass Date *' : 'Published Date *'}>
                    <input
                      required
                      type="date"
                      value={bulletinDate}
                      onChange={e => setBulletinDate(e.target.value)}
                      className="input"
                    />
                  </FormField>
                </div>
                <FormField label="PDF File *">
                  <label className="flex items-center gap-3 border-2 border-dashed border-slate-200 rounded-lg px-4 py-3 cursor-pointer hover:border-blue-400 transition group">
                    <Upload className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition flex-shrink-0" />
                    <span className="text-sm text-slate-500 truncate">
                      {bulletinFile ? bulletinFile.name : 'Choose a PDF file…'}
                    </span>
                    <input
                      type="file"
                      accept="application/pdf,.pdf"
                      className="hidden"
                      onChange={e => setBulletinFile(e.target.files?.[0] ?? null)}
                    />
                  </label>
                </FormField>
                {bulletinError && <p className="text-sm text-red-600">{bulletinError}</p>}
                <button
                  type="submit"
                  disabled={bulletinUploading || !bulletinTitle || !bulletinDate || !bulletinFile}
                  className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload className="w-4 h-4" />
                  {bulletinUploading ? 'Uploading…' : `Upload ${bulletinKind === 'worship_aide' ? 'Worship Aid' : 'Bulletin'}`}
                </button>
              </form>
            </div>

            {/* Bulletin list */}
            {bulletinsLoading ? (
              <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-14 bg-white rounded-xl animate-pulse" />)}</div>
            ) : bulletins.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-100 p-8 text-center text-slate-400 text-sm shadow-sm">Nothing uploaded yet.</div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-100 divide-y divide-slate-50 shadow-sm">
                {bulletins.map(b => (
                  <div key={b.id} className="px-5 py-3.5 flex items-center gap-4">
                    {b.kind === 'worship_aide'
                      ? <FileText className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      : <Newspaper className="w-4 h-4 text-slate-300 flex-shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{b.title}</p>
                        <span className={`flex-shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full ${b.kind === 'worship_aide' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                          {b.kind === 'worship_aide' ? 'Worship Aid' : 'Bulletin'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {new Date(b.published_date + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <a
                      href={b.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition flex-shrink-0"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      View PDF
                    </a>
                    <button
                      onClick={() => { if (confirm(`Delete "${b.title}"?`)) deleteBulletin(b); }}
                      aria-label={`Delete ${b.title}`}
                      className="p-1.5 hover:bg-red-50 rounded-lg text-slate-300 hover:text-red-400 transition flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── ANNOUNCEMENTS TAB ─── */}
        {tab === 'announcements' && (
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Homepage Announcements</h2>
            <p className="text-sm text-slate-500 mb-6">
              Active announcements appear as amber cards at the start of the "Upcoming Events" grid on the homepage.
              Inactive announcements are hidden from visitors but stay listed here.
            </p>

            {/* Form */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm px-6 py-5 mb-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-4">
                {editingAnnouncement ? 'Edit Announcement' : 'New Announcement'}
              </h3>
              <form onSubmit={saveAnnouncement} className="space-y-4">
                <FormField label="Title *">
                  <input
                    required
                    value={announcementForm.title}
                    onChange={e => setAnnouncementForm(f => ({ ...f, title: e.target.value }))}
                    className="input"
                    placeholder="e.g. Welcome Our Stranger has reached 90% of its goal!"
                  />
                </FormField>
                <FormField label="Body *">
                  <textarea
                    required
                    value={announcementForm.body}
                    onChange={e => setAnnouncementForm(f => ({ ...f, body: e.target.value }))}
                    className="input resize-none"
                    rows={4}
                    placeholder="Full message shown on the homepage card…"
                  />
                </FormField>
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField label="Link URL (optional)">
                    <input
                      value={announcementForm.link_url}
                      onChange={e => setAnnouncementForm(f => ({ ...f, link_url: e.target.value }))}
                      className="input"
                      placeholder="/living-our-faith or https://…"
                    />
                  </FormField>
                  <FormField label="Link Label (optional)">
                    <input
                      value={announcementForm.link_label}
                      onChange={e => setAnnouncementForm(f => ({ ...f, link_label: e.target.value }))}
                      className="input"
                      placeholder="Learn more"
                    />
                  </FormField>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField label="Sort Order">
                    <input
                      type="number"
                      value={announcementForm.sort_order}
                      onChange={e => setAnnouncementForm(f => ({ ...f, sort_order: Number(e.target.value) }))}
                      className="input"
                    />
                  </FormField>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer select-none py-2.5">
                      <input
                        type="checkbox"
                        checked={announcementForm.is_active}
                        onChange={e => setAnnouncementForm(f => ({ ...f, is_active: e.target.checked }))}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-700">Active</span>
                    </label>
                  </div>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">Show On</p>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={announcementForm.show_on_home}
                      onChange={e => setAnnouncementForm(f => ({ ...f, show_on_home: e.target.checked }))}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700">Homepage (Upcoming Events card)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={announcementForm.show_on_living_faith}
                      onChange={e => setAnnouncementForm(f => ({ ...f, show_on_living_faith: e.target.checked }))}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700">Living Our Faith page (popup)</span>
                  </label>
                </div>
                <div className="flex gap-3 pt-2">
                  {editingAnnouncement && (
                    <button
                      type="button"
                      onClick={resetAnnouncementForm}
                      className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition"
                    >
                      Cancel Edit
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={announcementSaving || !announcementForm.title.trim() || !announcementForm.body.trim()}
                    className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {announcementSaving ? 'Saving…' : editingAnnouncement ? 'Save Changes' : 'Add Announcement'}
                  </button>
                </div>
              </form>
            </div>

            {/* List */}
            {announcementsLoading ? (
              <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-white rounded-xl animate-pulse" />)}</div>
            ) : announcements.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-100 p-8 text-center text-slate-400 text-sm shadow-sm">
                No announcements yet.
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-100 divide-y divide-slate-50 shadow-sm">
                {announcements.map(a => (
                  <div key={a.id} className="px-5 py-4 flex items-start gap-4">
                    <button
                      onClick={() => toggleAnnouncementActive(a)}
                      title={a.is_active ? 'Deactivate' : 'Activate'}
                      className={`mt-0.5 w-2.5 h-2.5 rounded-full flex-shrink-0 transition ${a.is_active ? 'bg-amber-500 hover:bg-amber-600' : 'bg-slate-300 hover:bg-slate-400'}`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-slate-800 text-sm">{a.title}</span>
                        {!a.is_active && (
                          <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">Inactive</span>
                        )}
                        {a.show_on_home && (
                          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">Home</span>
                        )}
                        {a.show_on_living_faith && (
                          <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-medium">Living Our Faith</span>
                        )}
                        {!a.show_on_home && !a.show_on_living_faith && (
                          <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">Not shown anywhere</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{a.body}</p>
                      {a.link_url && (
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                          <ExternalLink className="w-3 h-3" />
                          {a.link_url}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {announcementDeleteConfirm === a.id ? (
                        <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-lg px-3 py-1.5">
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                          <span className="text-xs text-red-600 font-medium">Delete?</span>
                          <button onClick={() => deleteAnnouncement(a.id)} className="text-xs text-red-600 font-bold hover:text-red-800">Yes</button>
                          <button onClick={() => setAnnouncementDeleteConfirm(null)} className="text-xs text-slate-500 hover:text-slate-700">No</button>
                        </div>
                      ) : (
                        <>
                          <button onClick={() => openEditAnnouncement(a)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => setAnnouncementDeleteConfirm(a.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-slate-300 hover:text-red-400 transition">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── PAGES TAB ─── */}
        {tab === 'pages' && <AdminPagesTab />}

        {/* ─── SACRAMENT INQUIRIES TAB ─── */}
        {tab === 'sacraments' && (
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-6">
              Sacrament Inquiries
              {inquiries.length > 0 && <span className="ml-2 text-sm font-normal text-slate-400">({inquiries.length})</span>}
            </h2>
            {inquiriesLoading ? (
              <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-white rounded-xl animate-pulse" />)}</div>
            ) : inquiries.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-100 p-8 text-center text-slate-400 text-sm shadow-sm">No sacrament inquiries yet.</div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-100 divide-y divide-slate-50 shadow-sm">
                {inquiries.map(inq => (
                  <div key={inq.id} className="px-5 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <button
                          onClick={() => setExpandedInquiry(expandedInquiry === inq.id ? null : inq.id)}
                          className="flex items-center gap-2 text-left w-full"
                        >
                          <div className="flex-1">
                            <span className="font-medium text-slate-800 text-sm">{inq.first_name} {inq.last_name}</span>
                            <span className="ml-2 text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">{inq.sacrament_interest}</span>
                          </div>
                          {expandedInquiry === inq.id ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                        </button>
                        {expandedInquiry === inq.id && (
                          <div className="mt-3 space-y-1.5 text-sm text-slate-600">
                            <p><span className="text-slate-400">Email:</span> {inq.email}</p>
                            {inq.phone && <p><span className="text-slate-400">Phone:</span> {inq.phone}</p>}
                            {inq.message && <p><span className="text-slate-400">Message:</span> {inq.message}</p>}
                            <p className="text-slate-400 text-xs">{new Date(inq.created_at).toLocaleDateString('en-US', { timeZone: TZ, month: 'long', day: 'numeric', year: 'numeric' })}</p>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => deleteInquiry(inq.id)}
                        className="text-slate-300 hover:text-red-400 transition flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─── EVENT FORM MODAL ─── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-8" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-800 text-lg">{editingEvent ? 'Edit Event' : 'Add Event'}</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={saveEvent} className="px-6 py-5 space-y-4">
              <FormField label="Title *">
                <input
                  required
                  value={formData.title}
                  onChange={e => setFormData(f => ({ ...f, title: e.target.value }))}
                  className="input"
                  placeholder="Event title"
                />
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Date *">
                  <input
                    required
                    type="date"
                    value={formData.event_date}
                    onChange={e => setFormData(f => ({ ...f, event_date: e.target.value }))}
                    className="input"
                  />
                </FormField>
                <FormField label="Start Time">
                  <input
                    type="time"
                    value={formData.event_time}
                    onChange={e => setFormData(f => ({ ...f, event_time: e.target.value }))}
                    className="input"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="End Time">
                  <input
                    type="time"
                    value={formData.end_time}
                    onChange={e => setFormData(f => ({ ...f, end_time: e.target.value }))}
                    className="input"
                  />
                </FormField>
                <FormField label="Type">
                  <select
                    value={formData.event_type}
                    onChange={e => setFormData(f => ({ ...f, event_type: e.target.value }))}
                    className="input"
                  >
                    <option>Event</option>
                    <option>Mass</option>
                    <option>Meeting</option>
                    <option>Social</option>
                    <option>Retreat</option>
                    <option>Other</option>
                  </select>
                </FormField>
              </div>

              <FormField label="Location">
                <input
                  value={formData.location}
                  onChange={e => setFormData(f => ({ ...f, location: e.target.value }))}
                  className="input"
                  placeholder="322 St. James Drive, Piedmont"
                />
              </FormField>

              <FormField label="Recurrence">
                <select
                  value={formData.recurrence}
                  onChange={e => setFormData(f => ({ ...f, recurrence: e.target.value }))}
                  className="input"
                >
                  <option value="">None (one-time event)</option>
                  <optgroup label="Daily">
                    <option value="daily">Every Day</option>
                    <option value="weekday">Every Weekday (Mon–Fri)</option>
                  </optgroup>
                  <optgroup label="Weekly">
                    <option value="weekly-sun">Every Sunday</option>
                    <option value="weekly-mon">Every Monday</option>
                    <option value="weekly-tue">Every Tuesday</option>
                    <option value="weekly-wed">Every Wednesday</option>
                    <option value="weekly-thu">Every Thursday</option>
                    <option value="weekly-fri">Every Friday</option>
                    <option value="weekly-sat">Every Saturday</option>
                  </optgroup>
                  <optgroup label="Every Other Week">
                    <option value="biweekly-sun">Every Other Sunday</option>
                    <option value="biweekly-mon">Every Other Monday</option>
                    <option value="biweekly-tue">Every Other Tuesday</option>
                    <option value="biweekly-wed">Every Other Wednesday</option>
                    <option value="biweekly-thu">Every Other Thursday</option>
                    <option value="biweekly-fri">Every Other Friday</option>
                    <option value="biweekly-sat">Every Other Saturday</option>
                  </optgroup>
                  <optgroup label="Monthly">
                    <option value="monthly-first-sun">1st Sunday of the Month</option>
                    <option value="monthly-first-mon">1st Monday of the Month</option>
                    <option value="monthly-first-wed">1st Wednesday of the Month</option>
                    <option value="monthly-first-fri">1st Friday of the Month</option>
                    <option value="monthly-second-sun">2nd Sunday of the Month</option>
                    <option value="monthly-second-sat">2nd Saturday of the Month</option>
                    <option value="monthly-third-sun">3rd Sunday of the Month</option>
                    <option value="monthly-last-sun">Last Sunday of the Month</option>
                    <option value="monthly-date">Same Date Each Month</option>
                  </optgroup>
                </select>
              </FormField>

              <FormField label="Description">
                <textarea
                  value={formData.description}
                  onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
                  className="input resize-none"
                  rows={3}
                  placeholder="Event details..."
                />
              </FormField>

              <FormField label="Link (optional)">
                <input
                  type="url"
                  value={formData.event_url}
                  onChange={e => setFormData(f => ({ ...f, event_url: e.target.value }))}
                  className="input"
                  placeholder="https://..."
                />
              </FormField>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={e => setFormData(f => ({ ...f, is_featured: e.target.checked }))}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">Featured event</span>
              </label>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSaving}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold transition disabled:opacity-60"
                >
                  {formSaving ? 'Saving...' : editingEvent ? 'Save Changes' : 'Add Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function EventRow({
  event,
  onEdit,
  onDelete,
  deleteConfirm,
  onConfirmDelete,
  onCancelDelete,
  isRecurring = false,
}: {
  event: Event;
  onEdit: (e: Event) => void;
  onDelete: (id: string) => void;
  deleteConfirm: string | null;
  onConfirmDelete: (id: string) => void;
  onCancelDelete: () => void;
  isRecurring?: boolean;
}) {
  const recurrenceLabel: Record<string, string> = {
    'daily': 'Daily',
    'weekday': 'Mon–Fri',
    'weekly-sun': 'Every Sun',
    'weekly-mon': 'Every Mon',
    'weekly-tue': 'Every Tue',
    'weekly-wed': 'Every Wed',
    'weekly-thu': 'Every Thu',
    'weekly-fri': 'Every Fri',
    'weekly-sat': 'Every Sat',
    'biweekly-sun': 'Every Other Sun',
    'biweekly-mon': 'Every Other Mon',
    'biweekly-tue': 'Every Other Tue',
    'biweekly-wed': 'Every Other Wed',
    'biweekly-thu': 'Every Other Thu',
    'biweekly-fri': 'Every Other Fri',
    'biweekly-sat': 'Every Other Sat',
    'monthly-first-sun': '1st Sun/Month',
    'monthly-first-mon': '1st Mon/Month',
    'monthly-first-wed': '1st Wed/Month',
    'monthly-first-fri': '1st Fri/Month',
    'monthly-second-sun': '2nd Sun/Month',
    'monthly-second-sat': '2nd Sat/Month',
    'monthly-third-sun': '3rd Sun/Month',
    'monthly-last-sun': 'Last Sun/Month',
    'monthly-date': 'Monthly',
  };

  return (
    <div className="px-5 py-3.5 flex items-start gap-4">
      <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${event.event_type === 'Mass' ? 'bg-blue-600' : 'bg-amber-500'}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-slate-800 text-sm">{event.title}</span>
          {isRecurring && event.recurrence && (
            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
              {recurrenceLabel[event.recurrence] || event.recurrence}
            </span>
          )}
          {event.is_featured && (
            <span className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full font-medium">Featured</span>
          )}
        </div>
        <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
          {!isRecurring && <span>{formatDisplayDate(event.event_date)} · {formatDisplayTime(event.event_date)}</span>}
          {isRecurring && <span>{formatDisplayTime(event.event_date)}</span>}
          {event.location && <span>· {event.location}</span>}
          {event.event_url && (
            <a href={event.event_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600 transition">
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {deleteConfirm === event.id ? (
          <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-lg px-3 py-1.5">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span className="text-xs text-red-600 font-medium">Delete?</span>
            <button onClick={() => onConfirmDelete(event.id)} className="text-xs text-red-600 font-bold hover:text-red-800">Yes</button>
            <button onClick={onCancelDelete} className="text-xs text-slate-500 hover:text-slate-700">No</button>
          </div>
        ) : (
          <>
            <button onClick={() => onEdit(event)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition">
              <Edit2 className="w-4 h-4" />
            </button>
            <button onClick={() => onDelete(event.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-slate-300 hover:text-red-400 transition">
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
