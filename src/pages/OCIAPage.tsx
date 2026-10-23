import { Sprout, Cross, Bird, Flame, Play, X, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePageData } from '../lib/usePageData';
import { getStaffByEmail } from '../lib/staffData';

const VIDEOS = [
  { id: '1190645351', label: "David's Story" },
  { id: '1188526054', label: 'OCIA Journey' },
];

function VideoEmbed({ id, label }: { id: string; label: string }) {
  const [playing, setPlaying] = useState(false);
  const thumb = `https://vumbnail.com/${id}.jpg`;

  return (
    <div className="relative rounded-xl overflow-hidden shadow-lg aspect-video bg-slate-900">
      {playing ? (
        <iframe
          src={`https://player.vimeo.com/video/${id}?autoplay=1`}
          className="w-full h-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title={label}
        />
      ) : (
        <>
          <img src={thumb} alt={label} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-blue-950/40" />
          <button
            onClick={() => setPlaying(true)}
            className="absolute inset-0 flex items-center justify-center group z-10"
            aria-label={`Play ${label}`}
          >
            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-200">
              <Play size={28} className="text-blue-900 ml-1" fill="currentColor" />
            </div>
          </button>
          <div className="absolute bottom-3 left-4 z-10">
            <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">{label}</span>
          </div>
        </>
      )}
    </div>
  );
}

const REGISTER_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfxWO3gekieYkncJAeurmP7Vb42LGK8r1mFdhcU5cj9gzz3hg/viewform';
const POSTER_URL = '/events/01_Poster_for_OCIA_v4_(0925)_(1).pdf';

export default function OCIAPage() {
  const { content, contacts, photos } = usePageData('ocia');
  const staffAnne = getStaffByEmail('ministry@cc-parish.org');
  const [posterOpen, setPosterOpen] = useState(true);

  useEffect(() => {
    if (!posterOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setPosterOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [posterOpen]);

  const hero = content['hero'];
  const intro = content['intro'];
  const quote = content['quote'];
  const sessionFormat = content['session-format'];
  const specifics = content['specifics'];
  const contact = contacts[0];

  const sessionPhotos = photos.filter(p => !p.caption?.includes('Anne') && !p.caption?.includes('Confirmation'));
  const specificsPhoto = photos.find(p => p.caption?.includes('Confirmation rite'));
  const contactPhoto = photos.find(p => p.caption?.includes('Anne'));

  const sessionCards = [
    { eyebrow: 'We open with', title: 'God Moments & Check-Ins', body: "We share what's on our hearts — and where we've experienced God in everyday life." },
    { eyebrow: 'We explore', title: 'Core Teaching + Real Conversation', body: "Scripture, Church teaching, the big questions — tackled together." },
    { eyebrow: 'We practice', title: 'Prayer Experiments', body: "Each week we try a different form of prayer — Ignatian imagination, Visio Divina, the Rosary, Taize, and more." },
    { eyebrow: "We Don't Stop", title: 'Prayer Group', body: 'OCIA alumni wanted to continue journeying together — so they formed their own monthly prayer group.' },
  ];

  return (
    <div className="min-h-screen bg-sky-50">
      <section className="relative overflow-hidden" style={{ height: '100vh' }}>
        <div className="absolute inset-0">
          <iframe
            src="https://player.vimeo.com/video/1190612989?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[56.25vw] min-h-[100%] min-w-[177.78vh]"
            frameBorder="0"
            allow="autoplay; fullscreen"
            title="OCIA background video"
          />
        </div>
        <div className="absolute bottom-0 left-0 z-10">
          <div className="bg-blue-100 rounded-tr-2xl p-8 md:p-12">
            <p className="text-sm font-semibold tracking-widest uppercase text-blue-600 mb-3">
              {hero?.subtitle || 'Order of Christian Initiation of Adults'}
            </p>
            <h1 className="text-5xl md:text-7xl font-bold font-serif text-slate-950 leading-tight">
              {hero?.title || 'Something brought you here.'}
            </h1>
            <a
              href={REGISTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-6 inline-flex items-center gap-2 bg-blue-900 text-white text-base font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-blue-800 hover:shadow-lg active:bg-blue-950 transition"
            >
              Register for OCIA
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 py-12 md:py-16 border-b border-sky-100 bg-sky-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-xl md:text-2xl text-slate-800 mb-6 leading-relaxed">
              Maybe you're interested in becoming Catholic, or completing your sacraments. Or maybe it's a yearning for more meaning... Whatever it is — that's God.
            </h2>
            <div className="text-base text-slate-700 leading-relaxed mb-8 space-y-4">
              {(intro?.body_text || 'OCIA is a journey of no-pressure discernment and transformation. You walk in carrying your questions, your history, your longing. Through prayer, instruction, and a community that genuinely cares, something shifts.\n\nYou learn to find God in ordinary life. You discover how to pray in a way that feels like a real conversation. And you find that God has been calling you by name all along — loving you completely, no matter what.\n\nThe end of this process is a new beginning. You walk out different — with the desire to love like Jesus.').split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
            <a
              href="mailto:ministry@cc-parish.org"
              className="inline-block bg-white text-blue-900 text-base font-medium px-6 py-3 rounded-lg hover:bg-blue-50 transition border border-blue-200"
            >
              {intro?.link_label || 'Contact Anne →'}
            </a>
          </div>
          <div className="flex flex-col gap-4">
            {VIDEOS.map(v => <VideoEmbed key={v.id} id={v.id} label={v.label} />)}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 py-12 border-b border-sky-100">
        <div className="max-w-4xl mx-auto">
          <div className="border-l-4 border-blue-600 bg-blue-100 rounded-r-xl px-8 py-7">
            <p className="text-xl md:text-2xl font-semibold text-slate-900 mb-3 leading-relaxed">
              {quote?.title || '"The Spiritual Transformation: When someone realizes they don\'t have to check their doubts at the door and they start having \'God Moments.\' That\'s when the real learning begins."'}
            </p>
            <p className="text-base text-slate-600 italic">
              {quote?.subtitle || '— Anne Kallin Zehren, Pastoral Director and OCIA'}
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 py-12 md:py-16 border-b border-sky-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-slate-900 mb-6">Join OCIA if:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl p-6 bg-teal-700 text-center shadow-md border border-teal-600">
              <Sprout className="w-8 h-8 mx-auto mb-4 text-teal-200" />
              <h3 className="text-base font-bold text-white mb-2 leading-snug">Never been baptized and exploring faith for the first time</h3>
              <p className="text-sm text-teal-100 leading-relaxed">We welcome you, questions and all.</p>
            </div>
            <div className="rounded-xl p-6 bg-amber-600 text-center shadow-md border border-amber-500">
              <Cross className="w-8 h-8 mx-auto mb-4 text-amber-200" />
              <h3 className="text-base font-bold text-white mb-2 leading-snug">Baptized in another faith and drawn to Catholicism</h3>
              <p className="text-sm text-amber-100 leading-relaxed">Your faith history is an asset, not an obstacle.</p>
            </div>
            <div className="rounded-xl p-6 bg-rose-700 text-center shadow-md border border-rose-600">
              <Bird className="w-8 h-8 mx-auto mb-4 text-rose-200" />
              <h3 className="text-base font-bold text-white mb-2 leading-snug">Baptized Catholic but never received Communion or Confirmation</h3>
              <p className="text-sm text-rose-100 leading-relaxed">This is your moment to finish what your Baptism began.</p>
            </div>
            <div className="rounded-xl p-6 bg-emerald-700 text-center shadow-md border border-emerald-600">
              <Flame className="w-8 h-8 mx-auto mb-4 text-emerald-200" />
              <h3 className="text-base font-bold text-white mb-2 leading-snug">Catholic wanting to deepen and reinvigorate your faith</h3>
              <p className="text-sm text-emerald-100 leading-relaxed">Many of our most engaged participants are already Catholic.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 py-12 md:py-16 border-b border-sky-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-slate-900 mb-3">
            {sessionFormat?.title || "This Isn't a Lecture. It's a Conversation."}
          </h2>
          <p className="text-base text-slate-600 mb-6 leading-relaxed">
            {sessionFormat?.body_text || "Each session is interactive, personal, and grounded in real questions. Here's what a typical gathering looks like."}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sessionCards.map((card, idx) => (
              <div
                key={card.title}
                className="group relative rounded-xl overflow-hidden shadow-md h-64"
                style={{ backgroundImage: `url(${sessionPhotos[idx]?.image_url || ''})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              >
                <div className="absolute inset-0 bg-blue-950/50 transition-opacity duration-300 group-hover:bg-blue-950/70" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <p className="text-sm font-bold tracking-wider uppercase text-blue-200 mb-1 transition-all duration-300">
                    {card.eyebrow}
                  </p>
                  <h3 className="text-xl font-bold text-white leading-snug">{card.title}</h3>
                  <p className="text-sm text-blue-100 leading-relaxed mt-2 max-h-0 overflow-hidden opacity-0 group-hover:max-h-40 group-hover:opacity-100 transition-all duration-500">
                    {card.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 py-12 md:py-16 border-b border-sky-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-slate-900 mb-8">{specifics?.title || 'The Specifics'}</h2>
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div>
              <div className="border-l-2 border-blue-600 pl-5 mb-8">
                <p className="text-sm font-bold tracking-widest uppercase text-sky-500 mb-2">When</p>
                <p className="text-base text-slate-700 leading-relaxed">Wednesday evenings, 5:45 - 7:30pm</p>
              </div>
              <div className="border-l-2 border-blue-600 pl-5 mb-8">
                <p className="text-sm font-bold tracking-widest uppercase text-sky-500 mb-2">Dates</p>
                <p className="text-base text-slate-700 leading-relaxed">October 15, 2025 - April 14, 2026 — intentionally condensed into six months so it fits into real life.</p>
              </div>
              <div className="border-l-2 border-blue-600 pl-5 mb-8">
                <p className="text-sm font-bold tracking-widest uppercase text-sky-500 mb-2">Where</p>
                <p className="text-base text-slate-700 leading-relaxed">Gibson Center<br />322 St. James Drive, Piedmont</p>
              </div>
              <div className="border-l-2 border-blue-600 pl-5 mb-8">
                <p className="text-sm font-bold tracking-widest uppercase text-sky-500 mb-2">Bonus</p>
                <p className="text-base text-slate-700 leading-relaxed">A light dinner is served. Because community happens around a table.</p>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden h-96">
              <img src={specificsPhoto?.image_url || specifics?.image_url || '/EliConfirmation.jpg'} alt="Confirmation rite" className="w-full h-full object-cover object-top" />
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 py-12 border-b border-sky-100">
        <div className="max-w-6xl mx-auto">
          <div className="bg-blue-900 text-white rounded-xl px-8 py-9 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
            <div>
              <h3 className="text-2xl font-semibold mb-1">Join Us.</h3>
              <p className="text-base text-blue-200">Come to a session. No commitment. Just curiosity.</p>
            </div>
            <a
              href="mailto:ministry@cc-parish.org"
              className="bg-white text-blue-900 text-base font-medium px-6 py-3 rounded-lg hover:bg-blue-50 transition whitespace-nowrap"
            >
              Contact {contact?.name?.split(' ')[0] || 'Anne'} →
            </a>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-slate-900 mb-8">Meet {contact?.name?.split(' ')[0] || 'Anne'}.</h2>
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-1">
              <img
                src={contactPhoto?.image_url || contact?.image_url || '/Screenshot_2026-05-12_114024.png'}
                alt={contact?.name || 'Anne Kallin Zehren'}
                className="aspect-[3/4] w-full object-cover rounded-xl mb-4"
              />
              <h3 className="text-lg font-bold text-slate-900">{contact?.name || 'Anne Kallin Zehren'}</h3>
              <p className="text-sm text-slate-500 mt-1 mb-2">{contact?.role || 'Pastoral Director and OCIA'}</p>
              <a
                href="mailto:ministry@cc-parish.org"
                className="text-sm text-blue-700 border-b border-blue-200 hover:border-blue-700 transition"
              >
                ministry@cc-parish.org
              </a>
            </div>
            <div className="md:col-span-4 space-y-4">
              <div className="bg-teal-700 text-white rounded-xl p-8 shadow-md">
                <p className="text-sm font-bold tracking-widest uppercase text-teal-200 mb-3">The most inspiring part of her ministry</p>
                <p className="text-lg font-semibold leading-relaxed">
                  "{staffAnne?.bio?.inspiring || "The Spiritual Transformation: When someone realizes they don't have to check their doubts at the door and they start having 'God Moments.' That's when the real learning begins."}"
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-emerald-700 rounded-xl p-6 flex flex-col justify-center shadow-md">
                  <p className="text-sm font-bold tracking-widest uppercase text-emerald-200 mb-2">Prayer life in three words</p>
                  <p className="text-3xl font-bold text-white leading-snug mt-2">{(staffAnne?.bio?.prayer || 'Non-stop. Raw. Awe.').split('. ').slice(0, 3).map((w, i) => <span key={i}>{w}{i < 2 ? '.' : ''}<br /></span>)}</p>
                  <p className="text-sm text-emerald-100 italic mt-3">{(staffAnne?.bio?.prayer || '').includes('Psalms') ? 'Kind of like the Psalms.' : ''}</p>
                </div>
                <div className="md:col-span-2 border border-amber-500 rounded-xl p-6 bg-amber-600 shadow-md">
                  <p className="text-sm font-bold tracking-widest uppercase text-amber-200 mb-2">Saints she'd have to lunch</p>
                  <p className="text-base text-amber-50 leading-relaxed">
                    "{staffAnne?.bio?.saint || "I'd invite Saint Phoebe and Mary Magdalene — the only deacon named in the Bible, and the first witness to the Resurrection. I'd ask what it's like to never have their stories read at Sunday Mass."}"
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-rose-600 rounded-xl p-6 bg-rose-700 shadow-md">
                  <p className="text-sm font-bold tracking-widest uppercase text-rose-200 mb-2">Song that feels like God</p>
                  <p className="text-base text-rose-50 leading-relaxed mb-3">
                    "{staffAnne?.bio?.song || '"Heal My Wounds" — a song I wrote inspired by Saint Bernadette and the healing waters at Lourdes.'}"
                  </p>
                </div>
                <div className="border border-slate-600 rounded-xl p-6 bg-slate-700 shadow-md">
                  <p className="text-sm font-bold tracking-widest uppercase text-slate-300 mb-2">After Mass ritual</p>
                  <p className="text-base text-slate-100 leading-relaxed">
                    {staffAnne?.bio?.ritual || 'Coffee or brunch with my "Church Ladies" — Mersea if it\'s sunny, Grand Lake Kitchen, or Fentons.'}
                  </p>
                </div>
              </div>
              <div className="bg-sky-700 border border-sky-600 rounded-xl p-8 shadow-md">
                <p className="text-sm font-bold tracking-widest uppercase text-sky-200 mb-2">Street Cred</p>
                <p className="text-base text-sky-50 leading-relaxed">
                  {staffAnne?.bio?.credentials || contact?.bio || 'Graduate degree in Theological Studies, Jesuit School of Theology; BA, Marquette University. Trained Spiritual Director. Supposedly retired from 30 years of launching companies in Silicon Valley and NYC — including Publisher of Teen People and Glamour magazines. God had other plans.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {posterOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setPosterOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="OCIA opening night poster"
        >
          <div
            className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setPosterOpen(false)}
              className="absolute top-3 right-3 z-10 bg-white rounded-full p-1.5 shadow hover:bg-gray-100 transition"
              aria-label="Close poster"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
            <iframe
              src={POSTER_URL}
              className="w-full flex-1"
              style={{ minHeight: '65vh' }}
              title="OCIA Opening Night Poster"
            />
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-slate-100 bg-white">
              <p className="text-sm text-slate-600 text-center sm:text-left">
                Opening Night: Wednesday, October 7, 6:00 - 7:00pm
              </p>
              <a
                href={REGISTER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 bg-blue-900 text-white text-sm font-semibold px-6 py-3 rounded-lg hover:bg-blue-800 active:bg-blue-950 transition w-full sm:w-auto justify-center"
              >
                Register
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
