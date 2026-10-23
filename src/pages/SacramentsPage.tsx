import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Droplets, Utensils, Flame, Heart, HandHeart, Link2, Crown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { usePageData } from '../lib/usePageData';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

interface Sacrament {
  name: string;
  icon: React.ReactNode;
  summary: string;
  body: React.ReactNode;
}

const INITIATION: Sacrament[] = [
  {
    name: 'Baptism',
    icon: <Droplets size={18} />,
    summary: 'Entry into the family of God, original sin wiped away.',
    body: (
      <div className="space-y-3">
        <p className="text-sm text-slate-600 leading-relaxed">
          The sacrament that wipes away original sin and welcomes you into the family of God. The moment everything begins.
        </p>
        <div className="flex flex-wrap gap-4">
          <a href="mailto:office@cc-parish.org" className="text-sm text-blue-700 border-b border-blue-200 hover:border-blue-700 transition">
            Baptism for Infants &amp; Children →
          </a>
          <Link to="/ocia" className="text-sm text-blue-700 border-b border-blue-200 hover:border-blue-700 transition">
            Baptism for Adults (OCIA) →
          </Link>
        </div>
      </div>
    ),
  },
  {
    name: 'Eucharist',
    icon: <Utensils size={18} />,
    summary: 'The Real Presence of Christ — not symbol, but truth.',
    body: (
      <div className="space-y-3">
        <p className="text-sm text-slate-600 leading-relaxed">
          The central sacrament of Catholic faith. The bread and wine truly become Jesus himself — not symbol, but Real Presence. Through the Eucharist, we are united to Christ, nourished by his love, and drawn into the sacrifice he made for us.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link to="/family-faith-formation" className="text-sm text-blue-700 border-b border-blue-200 hover:border-blue-700 transition">
            First Communion (Family Faith Formation) →
          </Link>
          <Link to="/ocia" className="text-sm text-blue-700 border-b border-blue-200 hover:border-blue-700 transition">
            First Communion for Adults (OCIA) →
          </Link>
        </div>
      </div>
    ),
  },
  {
    name: 'Confirmation',
    icon: <Flame size={18} />,
    summary: "A personal yes to the faith — sealed with the Holy Spirit.",
    body: (
      <div className="space-y-3">
        <p className="text-sm text-slate-600 leading-relaxed">
          Confirmation is the sacrament of mature Christian commitment where the Holy Spirit is poured out and we are sealed with the Gifts and Fruits of the Spirit. It's a conscious, personal yes to the faith — and a commissioning to live it outside of our Church.
        </p>
        <div className="grid sm:grid-cols-2 gap-2 mb-3">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
            <p className="text-[10px] font-bold tracking-wider uppercase text-sky-500 mb-1">Gifts of the Holy Spirit</p>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Wisdom · Understanding · Counsel · Fortitude · Knowledge · Piety · Fear of the Lord
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
            <p className="text-[10px] font-bold tracking-wider uppercase text-sky-500 mb-1">Fruits of the Holy Spirit</p>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Charity · Joy · Peace · Patience · Kindness · Goodness · Generosity · Gentleness · Faithfulness · Modesty · Self-Control · Chastity
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link to="/confirmation" className="text-sm text-blue-700 border-b border-blue-200 hover:border-blue-700 transition">
            Confirmation for Teens →
          </Link>
          <Link to="/ocia" className="text-sm text-blue-700 border-b border-blue-200 hover:border-blue-700 transition">
            Confirmation for Adults (OCIA) →
          </Link>
        </div>
      </div>
    ),
  },
];

const HEALING: Sacrament[] = [
  {
    name: 'Reconciliation',
    icon: <Heart size={18} />,
    summary: "God's boundless mercy — forgiveness and a fresh start.",
    body: (
      <div className="space-y-3">
        <p className="text-sm text-slate-600 leading-relaxed">
          Reconciliation is the sacrament of God's boundless mercy and a fresh start. Through it, we are forgiven, healed, and welcomed back into full communion with God and the Church. God's love is always greater than our sins — no matter how big.
        </p>
        <div className="inline-flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 mb-1">
          <div>
            <p className="text-sm font-semibold text-blue-900 mb-0.5">Schedule a time with Fr. Leo</p>
            <a href="mailto:office@cc-parish.org" className="text-sm text-blue-700 border-b border-blue-200 hover:border-blue-700 transition">
              office@cc-parish.org
            </a>
          </div>
        </div>
        <div>
          <a href="mailto:familyfaith@cc-parish.org" className="text-sm text-blue-700 border-b border-blue-200 hover:border-blue-700 transition">
            First Reconciliation for Children →
          </a>
        </div>
      </div>
    ),
  },
  {
    name: 'Anointing of the Sick',
    icon: <HandHeart size={18} />,
    summary: 'Healing, comfort, and courage for the ill and aging.',
    body: (
      <div className="space-y-3">
        <p className="text-sm text-slate-600 leading-relaxed">
          For anyone facing illness, surgery, or the challenges of aging — can be received multiple times. Through anointing with Oil and the laying on of hands, the Holy Spirit strengthens body, mind and spirit. Last Rites — offered only at the time of death — is a sacred subset of this sacrament.
        </p>
        <div className="inline-flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 mb-1">
          <div>
            <p className="text-sm font-semibold text-blue-900 mb-0.5">Please don't wait. Schedule this sacrament.</p>
            <a href="mailto:office@cc-parish.org" className="text-sm text-blue-700 border-b border-blue-200 hover:border-blue-700 transition">
              office@cc-parish.org
            </a>
          </div>
        </div>
        <div>
          <Link to="/prayer-requests" className="text-sm text-blue-700 border-b border-blue-200 hover:border-blue-700 transition">
            Prayer Wall →
          </Link>
        </div>
      </div>
    ),
  },
];

const VOCATION: Sacrament[] = [
  {
    name: 'Matrimony',
    icon: <Link2 size={18} />,
    summary: "A sacred, lifelong bond mirroring Christ's love for the Church.",
    body: (
      <div className="space-y-3">
        <p className="text-sm text-slate-600 leading-relaxed">
          Marriage is a sacred, lifelong bond that mirrors Christ's love for the Church. In a Catholic wedding, the couple are the ministers of the sacrament — their mutual "I do" is the very heart of it. The priest is there as the Church's witness.
        </p>
        <p className="text-sm text-slate-600 leading-relaxed">
          Couples should contact Fr. Leo six months prior to their wedding date to allow for proper sacramental preparation.
        </p>
        <div className="inline-flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 mb-1">
          <div>
            <p className="text-sm font-semibold text-blue-900 mb-0.5">Contact the front desk to begin</p>
            <a href="mailto:office@cc-parish.org" className="text-sm text-blue-700 border-b border-blue-200 hover:border-blue-700 transition">
              office@cc-parish.org
            </a>
          </div>
        </div>
        <div className="border-l-4 border-blue-600 bg-blue-50 rounded-r-lg px-4 py-3">
          <p className="text-sm font-medium text-slate-800 leading-relaxed italic">
            "Catholics have the lowest divorce rate of any major faith tradition — 28% of Catholics, compared to the national average of over 40%."
          </p>
          <p className="text-xs text-slate-500 mt-1">— Center for Applied Research in the Apostolate (CARA), Georgetown University</p>
        </div>
      </div>
    ),
  },
  {
    name: 'Holy Orders',
    icon: <Crown size={18} />,
    summary: 'Ordination as deacons, priests, or bishops to serve the Church.',
    body: (
      <div className="space-y-3">
        <p className="text-sm text-slate-600 leading-relaxed">
          Like Marriage, Holy Orders is a lifelong sacrament of vocation and service. Through it, men are ordained as deacons, priests, or bishops — set apart to serve the Church in the person of Christ. Holy Orders is celebrated at the Diocesan level.
        </p>
        <a
          href="https://oakdiocese.org/vocations"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-700 border-b border-blue-200 hover:border-blue-700 transition"
        >
          Diocese of Oakland Vocations →
        </a>
      </div>
    ),
  },
];

const CATEGORIES = [
  { label: 'Sacraments of Initiation', sacraments: INITIATION },
  { label: 'Sacraments of Healing', sacraments: HEALING },
  { label: 'Sacraments of Vocation', sacraments: VOCATION },
];

const INQUIRY_SACRAMENTS = [
  'Baptism',
  'Eucharist',
  'Confirmation',
  'Reconciliation',
  'Anointing of the Sick',
  'Matrimony',
];

function AccordionCard({ sacrament, isOpen, onToggle }: {
  sacrament: Sacrament;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={`bg-white rounded-xl border transition-shadow duration-200 ${isOpen ? 'border-blue-200 shadow-md' : 'border-slate-100 hover:border-blue-100 hover:shadow-sm'}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-5 py-4 text-left"
        aria-expanded={isOpen}
      >
        <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-blue-900 text-white' : 'bg-sky-50 text-blue-700'}`}>
          {sacrament.icon}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-base font-bold text-slate-900">{sacrament.name}</p>
          <p className="text-sm text-slate-500 leading-snug">{sacrament.summary}</p>
        </div>
        <ChevronDown
          size={18}
          className={`flex-shrink-0 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-5 pb-5 pt-1 border-t border-slate-100">
          {sacrament.body}
        </div>
      </div>
    </div>
  );
}

export default function SacramentsPage() {
  const { content } = usePageData('sacraments');
  const hero = content['hero'];
  const [openKey, setOpenKey] = useState<string | null>(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [sacramentInterest, setSacramentInterest] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState('');
  const [formStatus, setFormStatus] = useState<FormState>('idle');

  function handleToggle(key: string) {
    setOpenKey(prev => (prev === key ? null : key));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !sacramentInterest) return;
    if (!/\S+@\S+\.\S+/.test(email)) return;

    if (website) {
      setFormStatus('success');
      setFirstName(''); setLastName(''); setEmail('');
      setPhone(''); setSacramentInterest(''); setMessage('');
      return;
    }

    setFormStatus('submitting');
    try {
      const { error } = await supabase.from('sacrament_inquiries').insert({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
        sacrament_interest: sacramentInterest,
        message: message.trim() || null,
      });
      if (error) throw error;

      await supabase.functions.invoke('send-sacrament-inquiry', {
        body: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phone: phone.trim() || null,
          sacramentInterest,
          message: message.trim() || null,
        },
      });

      setFormStatus('success');
      setFirstName(''); setLastName(''); setEmail('');
      setPhone(''); setSacramentInterest(''); setMessage('');
    } catch {
      setFormStatus('error');
    }
  }

  const inputClass = "w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition";
  const labelClass = "block text-xs font-semibold tracking-wide uppercase text-slate-500 mb-1.5";

  return (
    <div className="min-h-screen bg-sky-50">

      {/* Hero */}
      <section className="px-6 md:px-10 py-12 md:py-16 border-b border-sky-100">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-semibold tracking-widest uppercase text-sky-500 mb-4">
            {hero?.subtitle || 'The Seven Sacraments'}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-slate-900 mb-5 leading-tight">
            {hero?.title || "Where God's Invisible Grace Becomes Visible."}
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            {hero?.body_text || "The seven sacraments are visible, tangible rites — instituted by Christ and powered by the Holy Spirit — to signify and communicate God's grace. Each one actually brings about the grace it signifies: healing, forgiveness, nourishment, transformation. This is one of the top reasons people are Catholic."}
          </p>
        </div>
      </section>

      {/* Accordion */}
      <section className="px-6 md:px-10 py-10 md:py-14">
        <div className="max-w-3xl mx-auto space-y-10">
          {CATEGORIES.map(({ label, sacraments }) => (
            <div key={label}>
              <div className="inline-block bg-blue-900 text-white text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full mb-4">
                {label}
              </div>
              <div className="space-y-3">
                {sacraments.map(s => (
                  <AccordionCard
                    key={s.name}
                    sacrament={s}
                    isOpen={openKey === s.name}
                    onToggle={() => handleToggle(s.name)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Vocations Prayer */}
      <section className="bg-blue-900 text-white px-6 md:px-10 py-10 md:py-14">
        <div className="max-w-3xl mx-auto">
          <p className="text-[11px] font-bold tracking-widest uppercase text-blue-300 mb-2">A Prayer for Vocations</p>
          <h2 className="text-2xl font-bold mb-4">We Need More Leos.</h2>
          <p className="text-sm text-blue-100 leading-relaxed italic mb-5">
            Lord Jesus, we thank you for calling men and women to serve in love as priests, deacons, and consecrated persons. Give us more priests and religious sisters — but most especially, give us holy ones. Send your Holy Spirit to help others respond generously and courageously to your call. May our community of faith support vocations of service in our youth and young adults. We pray for the Catholic priesthood — give us more priests, but most especially, give us holy priests. Amen.
          </p>
          <div className="flex flex-wrap gap-5">
            <a href="https://oakdiocese.org/vocations" target="_blank" rel="noopener noreferrer"
              className="text-sm text-white border-b border-white/40 hover:border-white transition">
              Discern a Vocation →
            </a>
            <a href="https://cmswr.org/" target="_blank" rel="noopener noreferrer"
              className="text-sm text-white border-b border-white/40 hover:border-white transition">
              Religious Sisters →
            </a>
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section id="inquiry" className="px-6 md:px-10 py-12 md:py-16 bg-sky-50">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-semibold tracking-widest uppercase text-sky-500 mb-3">Get in Touch</p>
          <h2 className="text-3xl font-bold font-serif text-slate-900 mb-2 leading-tight">
            Interested in a Sacrament?
          </h2>
          <p className="text-sm text-slate-500 mb-8">
            Let us know which sacrament you or your family are interested in and we'll reach out to guide you through the next steps.
          </p>

          {formStatus === 'success' ? (
            <div className="bg-white rounded-xl border border-green-200 px-6 py-10 text-center shadow-sm">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">We received your message!</h3>
              <p className="text-sm text-slate-500 mb-5">Someone from our team will be in touch with you soon.</p>
              <button
                onClick={() => setFormStatus('idle')}
                className="text-sm text-blue-700 border-b border-blue-200 hover:border-blue-700 transition"
              >
                Submit another inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-sky-100 shadow-sm px-6 py-8 space-y-5">
              {/* Anti-spam honeypot */}
              <div aria-hidden="true" className="absolute -left-[9999px] -top-[9999px] opacity-0 h-0 overflow-hidden">
                <label htmlFor="sac-website">Website</label>
                <input id="sac-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={e => setWebsite(e.target.value)} />
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>First Name <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    placeholder="Jane"
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Last Name <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    placeholder="Smith"
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Email <span className="text-red-400">*</span></label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Phone <span className="text-slate-300">(optional)</span></label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="(510) 555-0100"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Sacrament of Interest <span className="text-red-400">*</span></label>
                <select
                  value={sacramentInterest}
                  onChange={e => setSacramentInterest(e.target.value)}
                  required
                  className={`${inputClass} appearance-none`}
                >
                  <option value="">Select a sacrament...</option>
                  {INQUIRY_SACRAMENTS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Message <span className="text-slate-300">(optional)</span></label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Any questions or details you'd like to share..."
                  rows={4}
                  className={`${inputClass} resize-none`}
                />
              </div>

              {formStatus === 'error' && (
                <p className="text-sm text-red-600">
                  Something went wrong. Please try again or email us at{' '}
                  <a href="mailto:office@cc-parish.org" className="underline">office@cc-parish.org</a>.
                </p>
              )}

              <button
                type="submit"
                disabled={formStatus === 'submitting'}
                className="w-full sm:w-auto bg-blue-900 text-white text-sm font-semibold px-8 py-3 rounded-lg hover:bg-blue-800 active:bg-blue-950 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {formStatus === 'submitting' ? 'Sending...' : 'Send Inquiry'}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
