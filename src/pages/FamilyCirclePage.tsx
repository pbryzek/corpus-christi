import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { usePageData } from '../lib/usePageData';

const FLYERS = [
  { src: '/Juice_Box_Mixer_(2)3.png', alt: 'Juice Box Mixer flyer' },
  { src: '/Littles_Playdate_(2)4.png', alt: 'Littles Playdate flyer' },
];

const FLYER_DISMISS_KEY = 'cc_family_circle_flyers_dismissed_v1';

function FlyerPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem(FLYER_DISMISS_KEY)) {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    sessionStorage.setItem(FLYER_DISMISS_KEY, '1');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={dismiss}
    >
      <div
        className="relative w-full max-w-4xl my-8"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={dismiss}
          className="absolute -top-3 -right-3 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-slate-100 transition"
          aria-label="Close flyers"
        >
          <X className="w-5 h-5 text-slate-700" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FLYERS.map(flyer => (
            <div key={flyer.src} className="rounded-2xl overflow-hidden shadow-2xl bg-white">
              <img
                src={flyer.src}
                alt={flyer.alt}
                className="w-full h-auto block"
              />
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-center">
          <button
            onClick={dismiss}
            className="px-6 py-2.5 rounded-full bg-white text-slate-800 text-sm font-semibold shadow hover:bg-slate-100 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FamilyCirclePage() {
  const { content, contacts, photos } = usePageData('family-circle');

  const hero = content['hero'];
  const about = content['about'];
  const signup = content['signup'];
  const contact = contacts[0];
  const logoPhoto = photos.find(p => p.is_featured);
  const bodyPhoto = photos.find(p => !p.is_featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50">
      <FlyerPopup />

      <div className="bg-gradient-to-r from-orange-600 via-rose-600 to-pink-600 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <img
            src={logoPhoto?.image_url || hero?.image_url || '/files_9546889-2026-05-01T01-11-33-634Z-familycircle.png'}
            alt={logoPhoto?.caption || 'Family Circle logo'}
            className="w-36 h-36 md:w-44 md:h-44 object-contain flex-shrink-0 drop-shadow-lg"
          />
          <div>
            <p className="text-base font-semibold tracking-widest uppercase text-orange-200 mb-3">
              Parish Group
            </p>
            <h1 className="text-5xl md:text-6xl font-bold font-serif leading-tight mb-4">
              {hero?.title || 'Family Circle'}
            </h1>
            <p className="text-xl font-serif text-orange-100 leading-relaxed">
              {hero?.subtitle || 'Connecting young families within our faith community.'}
            </p>
          </div>
        </div>
      </div>

      <section className="py-16 md:py-24 px-6">
        <div className="max-w-4xl mx-auto">

          <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-8 md:p-10 mb-8 flex flex-col md:flex-row gap-8 items-start">
            <img
              src={bodyPhoto?.image_url || about?.image_url || '/ffstock.png'}
              alt={bodyPhoto?.caption || 'Families together'}
              className="w-full md:w-56 rounded-xl object-cover flex-shrink-0 shadow-md"
            />
            <div>
              <p className="text-lg text-slate-700 leading-relaxed whitespace-pre-line">
                {about?.body_text || 'We are Family Circle, a new group at Corpus Christi, looking to connect young families within our faith community.\n\nWe\'ll start with quarterly Juicebox Mixers after the 10:30 mass to create space for families to get to know each other. Depending on what our community wants, we\'ll host other gatherings such as playdates, social gatherings, and faith-based events. Stay tuned for details on these upcoming events!\n\nWe\'re so excited to build this community with you!'}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-gradient-to-br from-orange-500 to-rose-600 rounded-2xl p-8 text-white shadow-md">
              <h2 className="text-xl font-bold mb-3">{signup?.title || 'Join Our Contact List'}</h2>
              <p className="text-orange-100 leading-relaxed mb-5">
                {signup?.body_text || 'Want to stay in the loop on upcoming events? Fill out our short form and we\'ll keep you posted.'}
              </p>
              <a
                href={signup?.link_url || 'https://forms.gle/iWa9B5VBR1TWG4to9'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-orange-600 font-bold px-6 py-3 rounded-lg hover:bg-orange-50 transition-colors duration-150 shadow"
              >
                {signup?.link_label || 'Sign Up'}
              </a>
            </div>

            <div className="bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl p-8 shadow-md">
              <h2 className="text-xl font-bold text-amber-900 mb-3">Get in Touch</h2>
              <p className="text-amber-800 leading-relaxed mb-5">
                Have questions or ideas to share? We'd love to hear from you.
              </p>
              <a
                href={`mailto:${contact?.email || 'ccfamilycircle@gmail.com'}`}
                className="inline-block text-amber-900 font-semibold border-b-2 border-amber-700 hover:border-amber-900 transition-colors duration-150"
              >
                Contact {contact?.name || 'Family Circle'}
              </a>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
