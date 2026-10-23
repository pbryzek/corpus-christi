import { useEffect, useState } from 'react';
import { Megaphone, X } from 'lucide-react';
import { usePageData } from '../lib/usePageData';
import { supabase } from '../lib/supabase';

interface AnnouncementPopupData {
  id: string;
  title: string;
  body: string;
}

const DISMISS_STORAGE_KEY = 'cc_living_faith_announcement_dismissed';

function AnnouncementPopup() {
  const [announcement, setAnnouncement] = useState<AnnouncementPopupData | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function loadAnnouncement() {
      const { data, error } = await supabase
        .from('announcements')
        .select('id, title, body')
        .eq('show_on_living_faith', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (cancelled || error || !data) return;
      const dismissedId = sessionStorage.getItem(DISMISS_STORAGE_KEY);
      if (dismissedId === data.id) return;
      setAnnouncement(data);
      setVisible(true);
    }
    loadAnnouncement();
    return () => { cancelled = true; };
  }, []);

  function dismiss() {
    if (announcement) sessionStorage.setItem(DISMISS_STORAGE_KEY, announcement.id);
    setVisible(false);
  }

  if (!visible || !announcement) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={dismiss}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border border-amber-300 bg-gradient-to-br from-amber-50 to-white shadow-2xl p-8 md:p-10"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white shadow flex items-center justify-center hover:bg-slate-100 transition"
          aria-label="Close announcement"
        >
          <X className="w-5 h-5 text-slate-700" />
        </button>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold uppercase tracking-wide mb-4">
          <Megaphone className="w-3.5 h-3.5" />
          Announcement
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight mb-4">
          {announcement.title}
        </h2>
        <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-6">
          {announcement.body}
        </p>
        <button
          onClick={dismiss}
          className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold transition"
        >
          Thank you!
        </button>
      </div>
    </div>
  );
}

export default function LivingOurFaithPage() {
  const { content, contacts, events } = usePageData('living-our-faith');

  const hero = content['hero'];
  const howWeLive = content['how-we-live'];
  const join = content['join'];

  return (
    <div className="bg-white">
      <AnnouncementPopup />
      <div className="bg-[#1e3a6e] text-white py-20 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-5xl md:text-6xl font-bold font-serif mb-6">
              {hero?.title || "We're Called to Act."}
            </h1>
            <p className="text-2xl italic font-serif text-blue-200 mb-8 max-w-3xl">
              {hero?.subtitle || '"If faith does not have works, it is dead." — James 2:17'}
            </p>
            <p className="text-lg leading-relaxed max-w-3xl text-blue-100">
              {hero?.body_text || 'Catholic Social Teaching calls us to a preferential option for the poor, the marginalized, and the vulnerable — something we believe is a way of life. In partnership with St. Theresa\'s Social Justice Committee, Living Our Faith is how we answer that call — showing up, speaking up, and serving those who need it most. All parishioners are welcome.'}
            </p>
          </div>
          <div className="flex-shrink-0 w-full md:w-2/5 lg:w-1/2">
            <img
              src="/Image.png"
              alt="Faithful Witness"
              className="w-full h-auto rounded-xl object-cover shadow-2xl"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-2/3">
            <h2 className="text-4xl font-bold text-[#1e3a6e] mb-10">
              {howWeLive?.title || 'How We Live It.'}
            </h2>
            <div className="space-y-6">
              {(howWeLive?.body_text || 'We gather — for faith-sharing, mutual support, and to keep our ministries thriving.\nWe pray — because every act of justice begins with God.\nWe study — because understanding our world makes us better advocates for change.\nWe serve — because faith without action isn\'t enough.').split('\n').filter(Boolean).map((line, idx) => {
                const dashIdx = line.indexOf('—');
                const boldPart = dashIdx > 0 ? line.slice(0, dashIdx).trim() : line;
                const restPart = dashIdx > 0 ? line.slice(dashIdx) : '';
                return (
                  <div key={idx} className="pl-6 border-l-4 border-[#1e3a6e]">
                    <p className="text-xl text-gray-700 leading-relaxed">
                      <strong className="text-[#1e3a6e]">{boldPart}</strong>{restPart ? ` ${restPart}` : ''}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="lg:w-1/3 flex flex-col">
            <div className="flex flex-col h-full">
              <div className="relative rounded-xl shadow-lg overflow-hidden flex-1" style={{ minHeight: '300px', maxHeight: '420px' }}>
                <iframe
                  src="https://www.youtube.com/embed/DLuWbBAvU3g"
                  title="Adam Abdul-Rahim on accompanying immigrant sisters and brothers"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
              <p className="mt-4 text-sm text-gray-600 leading-relaxed text-center italic">
                Listen as parishioner Adam Abdul-Rahim explains why Catholics have a responsibility to accompany our immigrant sisters and brothers who live at the margins. May Adam inspire us to take action!
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-[#1e3a6e] mb-12">Get Involved.</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contacts.length > 0 ? contacts.map(contact => (
              <div key={contact.id} className="bg-white border border-blue-200 rounded-lg p-6 flex flex-col">
                <h3 className="text-lg font-bold text-[#1e3a6e] mb-4">{contact.role}</h3>
                <p className="text-base text-gray-600 leading-relaxed mb-4 flex-1">
                  {contact.bio}
                </p>
                <div className="pt-4 border-t border-blue-100 text-base text-gray-700">
                  {contact.name}
                  <br />
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-[#1e3a6e] border-b border-[#1e3a6e] inline-block mt-1"
                  >
                    Contact {contact.name}
                  </a>
                  {contact.role === 'Food Bank' && (
                    <a
                      href="https://give.accfb.org/Corpus-Christi-Food-Drive"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-block px-5 py-2 bg-[#1e3a6e] text-white rounded-lg font-semibold hover:bg-[#162d57] transition text-sm"
                    >
                      Donate
                    </a>
                  )}
                </div>
              </div>
            )) : (
              <p className="text-gray-500 col-span-3 text-center">Loading initiatives...</p>
            )}
          </div>
        </div>
      </div>

      <div className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-[#1e3a6e] mb-12">Be The Difference.</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {events.length > 0 ? events.map(event => (
              <div
                key={event.id}
                className="border rounded-lg p-6 flex flex-col items-center justify-center text-center bg-white border-blue-200"
              >
                {event.title === 'Faithful Witness' ? (
                  <a href="/Faithful_Witness-7-29-26.pdf" target="_blank" rel="noopener noreferrer" className="mb-4 block">
                    <img src="/Faithful_Witness-7-29-26.pdf" alt="Faithful Witness Flyer" className="hidden" />
                    <div className="w-16 h-20 bg-gray-100 border border-gray-200 rounded flex items-center justify-center text-gray-400 hover:border-[#1e3a6e] transition">
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                    </div>
                  </a>
                ) : (
                  <div className="text-5xl mb-4">📄</div>
                )}
                <h3 className="text-lg font-bold text-[#1e3a6e] mb-3">{event.title}</h3>
                <p className="text-base text-gray-600 leading-relaxed whitespace-pre-line mb-3">
                  {event.event_date}
                  {event.location ? `\n${event.location}` : ''}
                </p>
                {event.description && <p className="text-sm text-gray-500">{event.description}</p>}
                {event.rsvp_url && (
                  <a
                    href={event.rsvp_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block px-5 py-2 bg-[#1e3a6e] text-white rounded-lg font-semibold hover:bg-[#162d57] transition text-sm"
                  >
                    {event.button_label || 'RSVP here'}
                  </a>
                )}
                {event.contact_email && (
                  <a
                    href={`mailto:${event.contact_email}`}
                    className="mt-2 inline-block px-5 py-2 border border-[#1e3a6e] text-[#1e3a6e] rounded-lg font-semibold hover:bg-blue-50 transition text-sm"
                  >
                    Email
                  </a>
                )}
              </div>
            )) : (
              <p className="text-gray-500 col-span-3 text-center">Loading events...</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-lg border border-blue-200 p-8 md:p-10 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#1e3a6e] mb-6">{join?.title || 'Join Us.'}</h2>
              <div className="text-lg text-gray-700 leading-relaxed mb-6 whitespace-pre-line">
                {join?.body_text || 'Every 2nd Thursday, 6:30-8:00pm\nGibson Center, Corpus Christi Parish\nSpring 2026: April 9, May 14, June 11'}
              </div>
              <div className="text-base text-gray-700">
                Questions? Contact Liz Harrigan
                <br />
                <a href="tel:5103877241" className="hover:text-[#1e3a6e] transition">510.387.7241</a>
                <br />
                <a
                  href="mailto:Liz@gmail.com"
                  className="text-[#1e3a6e] border-b border-[#1e3a6e] inline-block mt-1"
                >
                  Contact Liz Harrigan
                </a>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden">
              <img
                src="/Liz_Harrigan_-_Living_Our_Faith.jpeg"
                alt="Liz Harrigan"
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
