import { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle, ArrowLeft, Calendar, ChevronDown, ChevronUp,
  CreditCard as Edit2, ExternalLink, FileText, Image, Plus,
  Trash2, Upload, Users, X,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { compressImage } from '../lib/compressImage';
import { useAuth } from '../lib/useAuth';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PageEvent {
  id: string;
  page_slug: string;
  emoji: string | null;
  title: string;
  description: string | null;
  event_date: string;
  location: string | null;
  rsvp_open: boolean;
  rsvp_url: string | null;
  sort_order: number;
}

interface PagePhoto {
  id: string;
  page_slug: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
  is_featured: boolean;
}

interface PageContact {
  id: string;
  page_slug: string;
  name: string;
  role: string | null;
  email: string | null;
  phone: string | null;
  bio: string | null;
  image_url: string | null;
  sort_order: number;
}

interface PageContent {
  id: string;
  page_slug: string;
  section_key: string;
  title: string | null;
  subtitle: string | null;
  body_text: string | null;
  image_url: string | null;
  link_url: string | null;
  link_label: string | null;
}

type SubTab = 'events' | 'photos' | 'contacts' | 'content';

// ─── Known public/ images ─────────────────────────────────────────────────────

const PUBLIC_IMAGES: { url: string; label: string }[] = [
  { url: '/Leo_headshot.png',    label: 'Fr. Leo' },
  { url: '/Paul_Loh.jpg',        label: 'Paul Loh' },
  { url: '/Lisa.jpg',            label: 'Lisa' },
  { url: '/Aileen.jpg',          label: 'Aileen' },
  { url: '/Dave_K.jpg',          label: 'Dave K.' },
  { url: '/David_R.jpg',         label: 'David R.' },
  { url: '/Francisco.jpg',       label: 'Francisco' },
  { url: '/Kit.jpg',             label: 'Kit' },
  { url: '/Sophia.jpg',          label: 'Sophia' },
  { url: '/Stannye.jpg',         label: 'Stannye' },
  { url: '/MeetTeam-Carol.jpeg', label: 'Carol' },
  { url: '/MeetTeamRobert.jpg',  label: 'Robert' },
  { url: '/adrian.png',          label: 'Adrian' },
  { url: '/ankie.png',           label: 'Ankie' },
  { url: '/anne.png',            label: 'Anne' },
  { url: '/joe.png',             label: 'Joe' },
  { url: '/mele.jpg',            label: 'Mele' },
  { url: '/rebecca.png',         label: 'Rebecca' },
  { url: '/peele_family.jpg',    label: 'Peele Family' },
  { url: '/fr-leo-welcome.png',  label: 'Fr. Leo (Welcome)' },
  { url: '/Stannye.jpg',         label: 'Stannye' },
  { url: '/church.jpg',          label: 'Church' },
  { url: '/inner_church_compressed.jpg', label: 'Church Interior' },
  { url: '/Music_compressed.jpg',label: 'Music' },
  { url: '/Choir_1.jpg',         label: 'Choir' },
  { url: '/Who_We_Are.jpg',      label: 'Who We Are' },
  { url: '/Gallery_c.jpg',       label: 'Gallery' },
  { url: '/welcome-basket-sm.jpg', label: 'Welcome Basket' },
  { url: '/Baptism.png',         label: 'Baptism' },
  { url: '/Confirmation.jpg',    label: 'Confirmation' },
  { url: '/cooking.png',         label: 'Cooking' },
  { url: '/ffstock.png',         label: 'Faith Formation' },
  { url: '/files_9546889-2026-05-01T01-11-33-634Z-familycircle.png', label: 'Family Circle' },
];

// ─── Image Picker ─────────────────────────────────────────────────────────────

function ImagePickerField({
  value,
  onChange,
  label = 'Photo',
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [storageImages, setStorageImages] = useState<{ url: string; label: string }[]>([]);
  const [loadingStorage, setLoadingStorage] = useState(false);
  const [tab, setTab] = useState<'public' | 'uploads'>('public');
  const [uploading, setUploading] = useState(false);
  const uploadRef = useRef<HTMLInputElement>(null);

  async function fetchStorage() {
    setLoadingStorage(true);
    const { data } = await supabase.storage.from('page-images').list('', { limit: 200, sortBy: { column: 'created_at', order: 'desc' } });
    if (data) {
      const imgs = data
        .filter(f => f.name !== '.emptyFolderPlaceholder')
        .map(f => {
          const { data: { publicUrl } } = supabase.storage.from('page-images').getPublicUrl(f.name);
          return { url: publicUrl, label: f.name };
        });
      setStorageImages(imgs);
    }
    setLoadingStorage(false);
  }

  function handleOpen() {
    setOpen(true);
    fetchStorage();
  }

  function pick(url: string) {
    onChange(url);
    setOpen(false);
  }

  async function handleUploadNew(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const compressed = await compressImage(file);
    const ext = compressed.name.split('.').pop() ?? 'jpg';
    const path = `uploads/${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from('page-images').upload(path, compressed, { contentType: compressed.type });
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from('page-images').getPublicUrl(path);
      pick(publicUrl);
    }
    setUploading(false);
    if (uploadRef.current) uploadRef.current.value = '';
  }

  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{label}</label>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg border border-slate-200 bg-slate-50 flex-shrink-0 overflow-hidden flex items-center justify-center">
          {value
            ? <img src={value} alt="" className="w-full h-full object-cover" />
            : <Image className="w-5 h-5 text-slate-300" />
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-500 truncate mb-1.5">{value || 'No image selected'}</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleOpen}
              className="text-xs font-medium text-blue-600 hover:text-blue-800 transition"
            >
              {value ? 'Change image' : 'Choose image'}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="text-xs font-medium text-slate-400 hover:text-red-500 transition"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base">Choose Image</h3>
              <div className="flex items-center gap-2">
                <label className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg cursor-pointer transition ${uploading ? 'bg-slate-100 text-slate-400' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}>
                  <Upload className="w-3.5 h-3.5" />
                  {uploading ? 'Compressing...' : 'Upload New'}
                  <input
                    ref={uploadRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleUploadNew}
                    disabled={uploading}
                  />
                </label>
                <button onClick={() => setOpen(false)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex border-b border-slate-100 px-6">
              {(['public', 'uploads'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-3 py-2.5 text-sm font-medium border-b-2 transition -mb-px ${
                    tab === t ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {t === 'public' ? 'Site Images' : 'Uploaded Photos'}
                </button>
              ))}
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {tab === 'public' && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                  {PUBLIC_IMAGES.map(img => (
                    <button
                      key={img.url}
                      type="button"
                      onClick={() => pick(img.url)}
                      className={`group flex flex-col items-center gap-1.5 p-1.5 rounded-xl border-2 transition ${
                        value === img.url
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-transparent hover:border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-full aspect-square rounded-lg overflow-hidden bg-slate-100">
                        <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[10px] text-slate-500 truncate w-full text-center leading-tight">{img.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {tab === 'uploads' && (
                loadingStorage ? (
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                    {[1,2,3,4,5,6,7,8,9,10].map(i => (
                      <div key={i} className="aspect-square rounded-xl bg-slate-100 animate-pulse" />
                    ))}
                  </div>
                ) : storageImages.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-8">No uploaded photos yet. Upload photos using the Photos tab.</p>
                ) : (
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                    {storageImages.map(img => (
                      <button
                        key={img.url}
                        type="button"
                        onClick={() => pick(img.url)}
                        className={`group flex flex-col items-center gap-1.5 p-1.5 rounded-xl border-2 transition ${
                          value === img.url
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-transparent hover:border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="w-full aspect-square rounded-lg overflow-hidden bg-slate-100">
                          <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-[10px] text-slate-500 truncate w-full text-center leading-tight">{img.label}</span>
                      </button>
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page registry ────────────────────────────────────────────────────────────

interface PageDef {
  slug: string;
  label: string;
  path: string;
  hasEvents?: boolean;
  hasPhotos?: boolean;
  hasContacts?: boolean;
  hasContent?: boolean;
}

const MAIN_PAGES_GROUP: { heading: string; pages: PageDef[] } = {
  heading: 'Main Pages',
  pages: [
    { slug: 'homepage', label: 'Homepage', path: '/', hasPhotos: true, hasContent: true },
    { slug: 'about',    label: 'About Us', path: '/about', hasPhotos: true, hasContacts: true, hasContent: true },
  ],
};

const MAIN_PAGES_EMAILS = ['wllmcrsby@gmail.com', 'ministry@cc-parish.org', 'annezehren@mac.com'];

// Super admins see every site page (including static pages like Mass, Give, etc.)
const SUPER_ADMIN_EMAILS = [
  'wllmcrsby@gmail.com',
  'miahamcc@gmail.com',
  'annezehren@mac.com',
];

const SITE_PAGES_GROUP: { heading: string; pages: PageDef[] } = {
  heading: 'Site Pages',
  pages: [
    { slug: 'mass',              label: 'Mass Times',             path: '/mass',              hasPhotos: true, hasContent: true },
    { slug: 'bulletins',         label: 'Bulletins',              path: '/bulletins',         hasPhotos: true, hasContent: true },
    { slug: 'contact',           label: 'Contact',                path: '/contact',           hasContacts: true, hasContent: true },
    { slug: 'faith-formation',   label: 'Faith Formation (Landing)', path: '/faith-formation', hasPhotos: true, hasContent: true },
    { slug: 'sacraments',        label: 'Sacraments',             path: '/sacraments',        hasPhotos: true, hasContent: true },
    { slug: 'give',              label: 'Give',                   path: '/give',              hasPhotos: true, hasContent: true },
    { slug: 'new-visitors',      label: 'New Visitors',           path: '/new-visitors',      hasPhotos: true, hasContent: true },
    { slug: 'ministries-landing', label: 'Ministries (Landing)',  path: '/ministries',        hasPhotos: true, hasContent: true },
    { slug: 'groups-landing',    label: 'Groups (Landing)',       path: '/groups',            hasPhotos: true, hasContent: true },
    { slug: 'privacy',           label: 'Privacy Policy',         path: '/privacy',           hasContent: true },
  ],
};

const PAGE_GROUPS: { heading: string; pages: PageDef[] }[] = [
  {
    heading: 'Ministries',
    pages: [
      { slug: 'music-ministry',            label: 'Music Ministry',                           path: '/music-ministry',            hasPhotos: true, hasContacts: true, hasContent: true },
      { slug: 'lectors-altar-eucharistic', label: 'Lectors, Altar Servers & Eucharistic',     path: '/lectors-altar-eucharistic', hasContacts: true, hasContent: true },
      { slug: 'greeters-ushers',           label: 'Greeters & Ushers',                        path: '/greeters-ushers',           hasContacts: true, hasContent: true },
      { slug: 'altarguild-hospitality',    label: 'Altar Guild, Hospitality & Environmental', path: '/altarguild-hospitality',    hasContacts: true, hasContent: true },
      { slug: 'homebound-grief',           label: 'Homebound & Grief Support',                path: '/homebound-grief',           hasEvents: true, hasContacts: true, hasContent: true },
    ],
  },
  {
    heading: 'Groups',
    pages: [
      { slug: 'genxish',          label: 'GenX-ish Fellowship', path: '/genxish',          hasEvents: true, hasPhotos: true, hasContacts: true, hasContent: true },
      { slug: 'family-circle',    label: 'Family Circle',       path: '/family-circle',    hasEvents: true, hasPhotos: true, hasContacts: true, hasContent: true },
      { slug: 'living-our-faith', label: 'Living Our Faith',    path: '/living-our-faith', hasEvents: true, hasPhotos: true, hasContacts: true, hasContent: true },
    ],
  },
  {
    heading: 'Faith Formation',
    pages: [
      { slug: 'family-faith-formation', label: 'Family Faith Formation',       path: '/family-faith-formation', hasEvents: true, hasPhotos: true, hasContacts: true, hasContent: true },
      { slug: 'confirmation',           label: 'Confirmation & Youth Ministry', path: '/confirmation',           hasEvents: true, hasPhotos: true, hasContacts: true, hasContent: true },
      { slug: 'ocia',                   label: 'OCIA',                          path: '/ocia',                   hasEvents: true, hasPhotos: true, hasContacts: true, hasContent: true },
      { slug: 'formed',                 label: 'FORMED',                        path: '/formed',                 hasContent: true },
    ],
  },
];

// ─── Capability badge config ─────────────────────────────────────────────────

const CAPS = [
  { key: 'hasEvents',   label: 'Events',  Icon: Calendar, table: 'page_events' },
  { key: 'hasPhotos',   label: 'Photos',  Icon: Image,    table: 'page_photos' },
  { key: 'hasContacts', label: 'Team',    Icon: Users,    table: 'page_contacts' },
  { key: 'hasContent',  label: 'Content', Icon: FileText, table: 'page_content' },
] as const;

type CountMap = Record<string, Record<string, number>>;

// ─── Root: page list ──────────────────────────────────────────────────────────

export default function AdminPagesTab() {
  const [activePage, setActivePage] = useState<PageDef | null>(null);
  const [counts, setCounts] = useState<CountMap>({});
  const { session } = useAuth();
  const userEmail = session?.user?.email || '';
  const canEditAllPages = SUPER_ADMIN_EMAILS.includes(userEmail);
  const canEditMainPages = MAIN_PAGES_EMAILS.includes(userEmail) || canEditAllPages;

  const allGroups = [
    ...(canEditMainPages ? [MAIN_PAGES_GROUP] : []),
    ...PAGE_GROUPS,
    ...(canEditAllPages ? [SITE_PAGES_GROUP] : []),
  ];

  useEffect(() => {
    async function fetchCounts() {
      const tables = ['page_events', 'page_photos', 'page_contacts', 'page_content'] as const;
      const results: CountMap = {};
      await Promise.all(
        tables.map(async (table) => {
          const { data } = await supabase.from(table).select('page_slug');
          if (data) {
            const map: Record<string, number> = {};
            data.forEach(row => { map[row.page_slug] = (map[row.page_slug] || 0) + 1; });
            results[table] = map;
          }
        })
      );
      setCounts(results);
    }
    fetchCounts();
  }, []);

  if (activePage) {
    return <PageEditor page={activePage} onBack={() => setActivePage(null)} />;
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-1">Manage Pages</h2>
      <p className="text-sm text-slate-400 mb-8">
        Edit events, photos, team members, and content blocks for ministry,
        group, and faith formation pages.
      </p>

      <div className="space-y-8">
        {allGroups.map(({ heading, pages }) => (
          <div key={heading}>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
              {heading}
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {pages.map(page => (
                <button
                  key={page.slug}
                  onClick={() => setActivePage(page)}
                  className="bg-white rounded-xl border border-slate-100 px-5 py-4 text-left hover:border-blue-200 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-800 text-sm group-hover:text-blue-700 transition-colors">
                      {page.label}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <span className="text-xs text-slate-400 mt-0.5 block">{page.path}</span>
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {CAPS.filter(cap => page[cap.key as keyof PageDef]).map(cap => {
                      const count = counts[cap.table]?.[page.slug] || 0;
                      return (
                        <span
                          key={cap.key}
                          className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${
                            count > 0
                              ? 'bg-blue-50 text-blue-600'
                              : 'bg-slate-50 text-slate-400'
                          }`}
                        >
                          <cap.Icon className="w-3 h-3" />
                          {cap.label}
                          {count > 0 && (
                            <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-1 rounded-full ml-0.5">
                              {count}
                            </span>
                          )}
                        </span>
                      );
                    })}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Page editor ──────────────────────────────────────────────────────────────

function PageEditor({ page, onBack }: { page: PageDef; onBack: () => void }) {
  const subTabs: { id: SubTab; label: string; Icon: typeof Calendar }[] = [
    ...(page.hasEvents   ? [{ id: 'events' as SubTab,   label: 'Events',          Icon: Calendar }] : []),
    ...(page.hasPhotos   ? [{ id: 'photos' as SubTab,   label: 'Photos',          Icon: Image }] : []),
    ...(page.hasContacts ? [{ id: 'contacts' as SubTab, label: 'Team / Contacts', Icon: Users }] : []),
    ...(page.hasContent  ? [{ id: 'content' as SubTab,  label: 'Content',         Icon: FileText }] : []),
  ];

  const defaultTab = subTabs[0]?.id ?? 'content';
  const [subTab, setSubTab] = useState<SubTab>(defaultTab);

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-slate-800 leading-tight">{page.label}</h2>
          <span className="text-xs text-slate-400">{page.path}</span>
        </div>
        <a
          href={page.path}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition"
        >
          View page <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Sub-tabs */}
      <div className="flex border-b border-slate-200 mb-6 overflow-x-auto">
        {subTabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setSubTab(id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition -mb-px ${
              subTab === id
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {subTab === 'events'   && page.hasEvents   && <EventsEditor   slug={page.slug} />}
      {subTab === 'photos'   && page.hasPhotos   && <PhotosEditor   slug={page.slug} />}
      {subTab === 'contacts' && page.hasContacts && <ContactsEditor slug={page.slug} />}
      {subTab === 'content'  && page.hasContent  && <ContentEditor  slug={page.slug} />}
    </div>
  );
}

// ─── Events editor ────────────────────────────────────────────────────────────

const emptyEventForm = {
  emoji: '', title: '', description: '', event_date: '',
  location: '', rsvp_open: false, rsvp_url: '',
};

function EventsEditor({ slug }: { slug: string }) {
  const [items, setItems]           = useState<PageEvent[]>([]);
  const [loading, setLoading]       = useState(true);
  const [showForm, setShowForm]     = useState(false);
  const [editing, setEditing]       = useState<PageEvent | null>(null);
  const [delConfirm, setDelConfirm] = useState<string | null>(null);
  const [form, setForm]             = useState(emptyEventForm);
  const [saving, setSaving]         = useState(false);

  useEffect(() => { load(); }, [slug]);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from('page_events').select('*').eq('page_slug', slug)
      .order('sort_order', { ascending: true });
    setItems(data || []);
    setLoading(false);
  }

  function openNew() {
    setEditing(null);
    setForm(emptyEventForm);
    setShowForm(true);
  }

  function openEdit(ev: PageEvent) {
    setEditing(ev);
    setForm({
      emoji: ev.emoji || '', title: ev.title,
      description: ev.description || '', event_date: ev.event_date,
      location: ev.location || '', rsvp_open: ev.rsvp_open,
      rsvp_url: ev.rsvp_url || '',
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      page_slug: slug,
      emoji: form.emoji.trim() || null,
      title: form.title.trim(),
      description: form.description.trim() || null,
      event_date: form.event_date.trim(),
      location: form.location.trim() || null,
      rsvp_open: form.rsvp_open,
      rsvp_url: form.rsvp_url.trim() || null,
      sort_order: editing ? editing.sort_order : items.length + 1,
    };
    if (editing) {
      await supabase.from('page_events').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('page_events').insert(payload);
    }
    setSaving(false);
    setShowForm(false);
    load();
  }

  async function deleteItem(id: string) {
    await supabase.from('page_events').delete().eq('id', id);
    setDelConfirm(null);
    load();
  }

  async function move(id: string, dir: 'up' | 'down') {
    const idx = items.findIndex(i => i.id === id);
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= items.length) return;
    const a = items[idx], b = items[swapIdx];
    await Promise.all([
      supabase.from('page_events').update({ sort_order: b.sort_order }).eq('id', a.id),
      supabase.from('page_events').update({ sort_order: a.sort_order }).eq('id', b.id),
    ]);
    load();
  }

  if (loading) return <Skeleton />;

  return (
    <div>
      <SectionHeader title="Upcoming Events">
        <button onClick={openNew} className="btn-primary">
          <Plus className="w-4 h-4" /> Add Event
        </button>
      </SectionHeader>

      {items.length === 0 ? (
        <EmptySlate label="No events yet." onAdd={openNew} />
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 divide-y divide-slate-50 shadow-sm">
          {items.map((ev, idx) => (
            <div key={ev.id} className="px-5 py-4 flex items-start gap-3">
              <div className="flex flex-col gap-0.5 mt-1 flex-shrink-0">
                <button
                  disabled={idx === 0}
                  onClick={() => move(ev.id, 'up')}
                  className="text-slate-300 hover:text-slate-500 disabled:opacity-20 transition text-xs leading-none"
                >▲</button>
                <button
                  disabled={idx === items.length - 1}
                  onClick={() => move(ev.id, 'down')}
                  className="text-slate-300 hover:text-slate-500 disabled:opacity-20 transition text-xs leading-none"
                >▼</button>
              </div>
              <div className="text-2xl flex-shrink-0 leading-none mt-0.5">{ev.emoji || '📅'}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-slate-800 text-sm">{ev.title}</span>
                  {ev.rsvp_open && (
                    <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">
                      RSVP Open
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {ev.event_date}{ev.location ? ` · ${ev.location}` : ''}
                </p>
                {ev.description && (
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">{ev.description}</p>
                )}
              </div>
              <RowActions
                id={ev.id} delConfirm={delConfirm}
                onEdit={() => openEdit(ev)}
                onDelete={() => setDelConfirm(ev.id)}
                onConfirmDelete={() => deleteItem(ev.id)}
                onCancelDelete={() => setDelConfirm(null)}
              />
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <Modal title={editing ? 'Edit Event' : 'Add Event'} onClose={() => setShowForm(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-[56px_1fr] gap-3">
              <Field label="Emoji">
                <input
                  value={form.emoji}
                  onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))}
                  className="input text-center"
                  placeholder="🎉"
                  maxLength={4}
                />
              </Field>
              <Field label="Title *">
                <input
                  required
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="input"
                  placeholder="Event title"
                />
              </Field>
            </div>
            <Field label="Date & Time *">
              <input
                required
                value={form.event_date}
                onChange={e => setForm(f => ({ ...f, event_date: e.target.value }))}
                className="input"
                placeholder="Thursday, May 28  ·  7:00 – 9:00 PM"
              />
            </Field>
            <Field label="Location">
              <input
                value={form.location}
                onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                className="input"
                placeholder="Gibson Center"
              />
            </Field>
            <Field label="Description">
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className="input resize-none"
                rows={2}
                placeholder="Short description…"
              />
            </Field>
            <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.rsvp_open}
                onChange={e => setForm(f => ({ ...f, rsvp_open: e.target.checked }))}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              RSVP Open
            </label>
            {form.rsvp_open && (
              <Field label="RSVP URL">
                <input
                  type="url"
                  value={form.rsvp_url}
                  onChange={e => setForm(f => ({ ...f, rsvp_url: e.target.value }))}
                  className="input"
                  placeholder="https://forms.gle/…"
                />
              </Field>
            )}
            <ModalButtons onCancel={() => setShowForm(false)} saving={saving} isEdit={!!editing} />
          </form>
        </Modal>
      )}
    </div>
  );
}

// ─── Photos editor ────────────────────────────────────────────────────────────

function PhotosEditor({ slug }: { slug: string }) {
  const [items, setItems]             = useState<PagePhoto[]>([]);
  const [loading, setLoading]         = useState(true);
  const [uploading, setUploading]     = useState(false);
  const [editTarget, setEditTarget]   = useState<PagePhoto | null>(null);
  const [captionDraft, setCaptionDraft]   = useState('');
  const [featuredDraft, setFeaturedDraft] = useState(false);
  const [delConfirm, setDelConfirm]   = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { load(); }, [slug]);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from('page_photos').select('*').eq('page_slug', slug)
      .order('sort_order', { ascending: true });
    setItems(data || []);
    setLoading(false);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const compressed = await compressImage(file);
    const ext = compressed.name.split('.').pop() ?? 'jpg';
    const path = `${slug}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from('page-images').upload(path, compressed, { contentType: compressed.type });
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from('page-images').getPublicUrl(path);
      await supabase.from('page_photos').insert({
        page_slug: slug, image_url: publicUrl,
        sort_order: items.length + 1, is_featured: false,
      });
      load();
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  }

  function openEdit(photo: PagePhoto) {
    setEditTarget(photo);
    setCaptionDraft(photo.caption ?? '');
    setFeaturedDraft(photo.is_featured);
  }

  async function saveCaption(e: React.FormEvent) {
    e.preventDefault();
    if (!editTarget) return;
    await supabase.from('page_photos')
      .update({ caption: captionDraft.trim() || null, is_featured: featuredDraft })
      .eq('id', editTarget.id);
    setEditTarget(null);
    load();
  }

  async function deletePhoto(id: string) {
    const photo = items.find(p => p.id === id);
    if (photo) {
      const parts = photo.image_url.split('/page-images/');
      const path = parts[parts.length - 1];
      if (path) await supabase.storage.from('page-images').remove([path]);
    }
    await supabase.from('page_photos').delete().eq('id', id);
    setDelConfirm(null);
    load();
  }

  if (loading) return <Skeleton />;

  return (
    <div>
      <SectionHeader title="Photos">
        <label
          className={`btn-primary cursor-pointer ${uploading ? 'opacity-60 pointer-events-none' : ''}`}
        >
          <Upload className="w-4 h-4" />
          {uploading ? 'Compressing & Uploading…' : 'Upload Photo'}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />
        </label>
      </SectionHeader>

      {items.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-100 p-8 text-center text-slate-400 text-sm shadow-sm">
          No photos yet. Upload one to get started.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {items.map(photo => (
            <div
              key={photo.id}
              className="relative group rounded-xl overflow-hidden border border-slate-100 shadow-sm bg-white"
            >
              <img
                src={photo.image_url}
                alt={photo.caption ?? ''}
                className="w-full h-40 object-cover"
              />
              {photo.is_featured && (
                <span className="absolute top-2 left-2 text-xs bg-amber-400 text-stone-900 px-2 py-0.5 rounded font-semibold">
                  Featured
                </span>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => openEdit(photo)}
                  className="p-2 bg-white rounded-lg shadow hover:bg-slate-50 transition"
                >
                  <Edit2 className="w-4 h-4 text-slate-700" />
                </button>
                {delConfirm === photo.id ? (
                  <div className="flex items-center gap-1 bg-white rounded-lg px-2 py-1.5 shadow text-xs">
                    <button onClick={() => deletePhoto(photo.id)} className="text-red-600 font-bold">Yes</button>
                    <span className="text-slate-300">/</span>
                    <button onClick={() => setDelConfirm(null)} className="text-slate-500">No</button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDelConfirm(photo.id)}
                    className="p-2 bg-white rounded-lg shadow hover:bg-red-50 transition"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                )}
              </div>
              {photo.caption && (
                <div className="px-3 py-2">
                  <p className="text-xs text-slate-500 truncate">{photo.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {editTarget && (
        <Modal title="Edit Photo" onClose={() => setEditTarget(null)}>
          <form onSubmit={saveCaption} className="space-y-4">
            <img
              src={editTarget.image_url}
              alt=""
              className="w-full h-44 object-cover rounded-lg"
            />
            <Field label="Caption">
              <input
                value={captionDraft}
                onChange={e => setCaptionDraft(e.target.value)}
                className="input"
                placeholder="Optional caption…"
              />
            </Field>
            <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-slate-700">
              <input
                type="checkbox"
                checked={featuredDraft}
                onChange={e => setFeaturedDraft(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Featured photo
            </label>
            <ModalButtons onCancel={() => setEditTarget(null)} saving={false} isEdit />
          </form>
        </Modal>
      )}
    </div>
  );
}

// ─── Contacts editor ──────────────────────────────────────────────────────────

const emptyContactForm = {
  name: '', role: '', email: '', phone: '', bio: '', image_url: '',
};

function ContactsEditor({ slug }: { slug: string }) {
  const [items, setItems]           = useState<PageContact[]>([]);
  const [loading, setLoading]       = useState(true);
  const [showForm, setShowForm]     = useState(false);
  const [editing, setEditing]       = useState<PageContact | null>(null);
  const [delConfirm, setDelConfirm] = useState<string | null>(null);
  const [form, setForm]             = useState(emptyContactForm);
  const [saving, setSaving]         = useState(false);
  const [expanded, setExpanded]     = useState<string | null>(null);

  useEffect(() => { load(); }, [slug]);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from('page_contacts').select('*').eq('page_slug', slug)
      .order('sort_order', { ascending: true });
    setItems(data || []);
    setLoading(false);
  }

  function openNew() {
    setEditing(null);
    setForm(emptyContactForm);
    setShowForm(true);
  }

  function openEdit(c: PageContact) {
    setEditing(c);
    setForm({
      name: c.name, role: c.role ?? '', email: c.email ?? '',
      phone: c.phone ?? '', bio: c.bio ?? '', image_url: c.image_url ?? '',
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      page_slug: slug,
      name: form.name.trim(),
      role: form.role.trim() || null,
      email: form.email.trim() || null,
      phone: form.phone.trim() || null,
      bio: form.bio.trim() || null,
      image_url: form.image_url.trim() || null,
      sort_order: editing ? editing.sort_order : items.length + 1,
    };
    if (editing) {
      await supabase.from('page_contacts').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('page_contacts').insert(payload);
    }
    setSaving(false);
    setShowForm(false);
    load();
  }

  async function deleteItem(id: string) {
    await supabase.from('page_contacts').delete().eq('id', id);
    setDelConfirm(null);
    load();
  }

  if (loading) return <Skeleton />;

  return (
    <div>
      <SectionHeader title="Team / Contacts">
        <button onClick={openNew} className="btn-primary">
          <Plus className="w-4 h-4" /> Add Person
        </button>
      </SectionHeader>

      {items.length === 0 ? (
        <EmptySlate label="No contacts yet." onAdd={openNew} />
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 divide-y divide-slate-50 shadow-sm">
          {items.map(contact => (
            <div key={contact.id} className="px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {contact.image_url
                    ? <img src={contact.image_url} alt="" className="w-full h-full object-cover" />
                    : <Users className="w-4 h-4 text-slate-400" />
                  }
                </div>
                <button
                  onClick={() => setExpanded(expanded === contact.id ? null : contact.id)}
                  className="flex-1 min-w-0 text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-800 text-sm">{contact.name}</span>
                    {contact.role && (
                      <span className="text-xs text-slate-400 hidden sm:block">{contact.role}</span>
                    )}
                    {expanded === contact.id
                      ? <ChevronUp className="w-3.5 h-3.5 text-slate-400 ml-auto" />
                      : <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-auto" />
                    }
                  </div>
                </button>
                <RowActions
                  id={contact.id} delConfirm={delConfirm}
                  onEdit={() => openEdit(contact)}
                  onDelete={() => setDelConfirm(contact.id)}
                  onConfirmDelete={() => deleteItem(contact.id)}
                  onCancelDelete={() => setDelConfirm(null)}
                />
              </div>
              {expanded === contact.id && (
                <div className="mt-3 ml-12 space-y-1 text-xs text-slate-500">
                  {contact.bio && <p className="italic">{contact.bio}</p>}
                  {contact.email && (
                    <p>Email: <a href={`mailto:${contact.email}`} className="text-blue-500">{contact.email}</a></p>
                  )}
                  {contact.phone && <p>Phone: {contact.phone}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <Modal title={editing ? 'Edit Contact' : 'Add Contact'} onClose={() => setShowForm(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Name *">
              <input
                required
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="input"
                placeholder="Full name"
              />
            </Field>
            <Field label="Role / Title">
              <input
                value={form.role}
                onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                className="input"
                placeholder="e.g., Music Director"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Email">
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="input"
                  placeholder="name@email.com"
                />
              </Field>
              <Field label="Phone">
                <input
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  className="input"
                  placeholder="(510) 555-1234"
                />
              </Field>
            </div>
            <Field label="Bio">
              <textarea
                value={form.bio}
                onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                className="input resize-none"
                rows={2}
                placeholder="Short bio…"
              />
            </Field>
            <ImagePickerField
              label="Photo"
              value={form.image_url}
              onChange={url => setForm(f => ({ ...f, image_url: url }))}
            />
            <ModalButtons onCancel={() => setShowForm(false)} saving={saving} isEdit={!!editing} />
          </form>
        </Modal>
      )}
    </div>
  );
}

// ─── Content editor ───────────────────────────────────────────────────────────

const emptyContentForm = {
  section_key: '', title: '', subtitle: '', body_text: '',
  image_url: '', link_url: '', link_label: '',
};

function ContentEditor({ slug }: { slug: string }) {
  const [items, setItems]       = useState<PageContent[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState<PageContent | null>(null);
  const [form, setForm]         = useState(emptyContentForm);
  const [saving, setSaving]     = useState(false);

  useEffect(() => { load(); }, [slug]);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from('page_content').select('*').eq('page_slug', slug)
      .order('section_key', { ascending: true });
    setItems(data || []);
    setLoading(false);
  }

  function openNew() {
    setEditing(null);
    setForm(emptyContentForm);
    setShowForm(true);
  }

  function openEdit(s: PageContent) {
    setEditing(s);
    setForm({
      section_key: s.section_key, title: s.title ?? '',
      subtitle: s.subtitle ?? '', body_text: s.body_text ?? '',
      image_url: s.image_url ?? '', link_url: s.link_url ?? '',
      link_label: s.link_label ?? '',
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      page_slug: slug,
      section_key: form.section_key.trim(),
      title: form.title.trim() || null,
      subtitle: form.subtitle.trim() || null,
      body_text: form.body_text.trim() || null,
      image_url: form.image_url.trim() || null,
      link_url: form.link_url.trim() || null,
      link_label: form.link_label.trim() || null,
      updated_at: new Date().toISOString(),
    };
    if (editing) {
      await supabase.from('page_content').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('page_content')
        .upsert(payload, { onConflict: 'page_slug,section_key' });
    }
    setSaving(false);
    setShowForm(false);
    load();
  }

  async function deleteItem(id: string) {
    await supabase.from('page_content').delete().eq('id', id);
    load();
  }

  if (loading) return <Skeleton />;

  return (
    <div>
      <SectionHeader title="Content Sections">
        <button onClick={openNew} className="btn-primary">
          <Plus className="w-4 h-4" /> Add Section
        </button>
      </SectionHeader>

      {items.length === 0 ? (
        <EmptySlate label="No content sections yet." onAdd={openNew} />
      ) : (
        <div className="space-y-3">
          {items.map(s => (
            <div key={s.id} className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3 mb-2">
                <code className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{s.section_key}</code>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => openEdit(s)}
                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteItem(s.id)}
                    className="p-1.5 hover:bg-red-50 rounded-lg text-slate-300 hover:text-red-400 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {s.title && <p className="font-semibold text-slate-800 text-sm">{s.title}</p>}
              {s.subtitle && <p className="text-xs text-slate-500 mt-0.5">{s.subtitle}</p>}
              {s.body_text && <p className="text-xs text-slate-400 mt-1 line-clamp-2">{s.body_text}</p>}
              {s.link_url && (
                <a
                  href={s.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-blue-500 mt-1 hover:underline"
                >
                  {s.link_label || s.link_url} <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <Modal
          title={editing ? 'Edit Content Section' : 'Add Content Section'}
          onClose={() => setShowForm(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Section Key *">
              <input
                required
                value={form.section_key}
                onChange={e => setForm(f => ({ ...f, section_key: e.target.value }))}
                className="input font-mono"
                placeholder="hero, about, cta…"
                disabled={!!editing}
              />
              {!editing && (
                <p className="text-xs text-slate-400 mt-1">Unique identifier for this section</p>
              )}
            </Field>
            <Field label="Title">
              <input
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="input"
                placeholder="Section title"
              />
            </Field>
            <Field label="Subtitle">
              <input
                value={form.subtitle}
                onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))}
                className="input"
                placeholder="Section subtitle"
              />
            </Field>
            <Field label="Body Text">
              <textarea
                value={form.body_text}
                onChange={e => setForm(f => ({ ...f, body_text: e.target.value }))}
                className="input resize-none"
                rows={4}
                placeholder="Main content…"
              />
            </Field>
            <ImagePickerField
              label="Image"
              value={form.image_url}
              onChange={url => setForm(f => ({ ...f, image_url: url }))}
            />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Link URL">
                <input
                  value={form.link_url}
                  onChange={e => setForm(f => ({ ...f, link_url: e.target.value }))}
                  className="input"
                  placeholder="https://…"
                />
              </Field>
              <Field label="Link Label">
                <input
                  value={form.link_label}
                  onChange={e => setForm(f => ({ ...f, link_label: e.target.value }))}
                  className="input"
                  placeholder="Learn more"
                />
              </Field>
            </div>
            <ModalButtons onCancel={() => setShowForm(false)} saving={saving} isEdit={!!editing} />
          </form>
        </Modal>
      )}
    </div>
  );
}

// ─── Shared primitives ────────────────────────────────────────────────────────

function SectionHeader({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-semibold text-slate-600">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

function Modal({
  title, onClose, children,
}: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-8" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-800 text-lg">{title}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

function ModalButtons({
  onCancel, saving, isEdit,
}: { onCancel: () => void; saving: boolean; isEdit: boolean }) {
  return (
    <div className="flex gap-3 pt-2">
      <button
        type="button"
        onClick={onCancel}
        className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={saving}
        className="flex-1 px-4 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold transition disabled:opacity-60"
      >
        {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add'}
      </button>
    </div>
  );
}

function RowActions({
  id, delConfirm, onEdit, onDelete, onConfirmDelete, onCancelDelete,
}: {
  id: string;
  delConfirm: string | null;
  onEdit: () => void;
  onDelete: () => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
}) {
  if (delConfirm === id) {
    return (
      <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-lg px-3 py-1.5 flex-shrink-0">
        <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
        <span className="text-xs text-red-600 font-medium">Delete?</span>
        <button onClick={onConfirmDelete} className="text-xs text-red-600 font-bold hover:text-red-800">Yes</button>
        <button onClick={onCancelDelete} className="text-xs text-slate-500 hover:text-slate-700">No</button>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1 flex-shrink-0">
      <button
        onClick={onEdit}
        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition"
      >
        <Edit2 className="w-4 h-4" />
      </button>
      <button
        onClick={onDelete}
        className="p-1.5 hover:bg-red-50 rounded-lg text-slate-300 hover:text-red-400 transition"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-16 bg-white rounded-xl animate-pulse border border-slate-100" />
      ))}
    </div>
  );
}

function EmptySlate({ label, onAdd }: { label: string; onAdd: () => void }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-8 text-center shadow-sm">
      <p className="text-slate-400 text-sm">
        {label}{' '}
        <button onClick={onAdd} className="text-blue-600 hover:underline">Add one →</button>
      </p>
    </div>
  );
}
