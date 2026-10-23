import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Megaphone, X, Play } from 'lucide-react';
import { downloadEventIcs } from '../lib/generateIcs';

interface ParishEvent {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  end_time: string | null;
  event_type: string;
  recurrence: string | null;
  event_url: string | null;
  flyer_url: string | null;
  time_tbd: boolean | null;
  location: string | null;
  contact_email: string | null;
  show_on_home: boolean;
}

interface Announcement {
  id: string;
  title: string;
  body: string;
  link_url: string | null;
  link_label: string | null;
  video_url: string | null;
  image_url: string | null;
}

interface WorshipProps {
  events: ParishEvent[];
  announcements: Announcement[];
  loading: boolean;
}

function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

function AnnouncementCard({ announcement, onPlayVideo }: { announcement: Announcement; onPlayVideo: (id: string) => void }) {
  const label = announcement.link_label?.trim() || 'Learn more';
  const url = announcement.link_url?.trim() || '';
  const isInternal = url.startsWith('/');
  const videoUrl = announcement.video_url?.trim() || '';
  const youtubeId = videoUrl ? getYouTubeId(videoUrl) : null;
  const thumbnail = youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : null;
  const bgImage = announcement.image_url?.trim() || null;
  const hasImageBg = !!bgImage && !thumbnail;

  return (
    <div
      className={`relative flex flex-col rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all overflow-hidden ${
        hasImageBg ? 'border border-transparent' : 'border border-amber-300 bg-gradient-to-br from-amber-50 to-white'
      }`}
      style={hasImageBg ? {
        backgroundImage: `url("${bgImage}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      } : undefined}
    >
      {hasImageBg && <div className="absolute inset-0 bg-black/50 rounded-xl" />}
      {thumbnail && (
        <button
          onClick={() => onPlayVideo(youtubeId!)}
          className="relative w-full aspect-video overflow-hidden group focus:outline-none"
          aria-label="Play video"
        >
          <img
            src={thumbnail}
            alt="Video thumbnail"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Play className="w-6 h-6 text-amber-700 ml-1" fill="currentColor" />
            </div>
          </div>
        </button>
      )}
      <div className={`p-6 flex flex-col flex-1 ${hasImageBg ? 'relative z-10' : ''}`}>
        <div className="flex items-center gap-2 mb-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
            hasImageBg ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
          }`}>
            <Megaphone className="w-3.5 h-3.5" />
            Announcement
          </span>
        </div>
        <h3 className={`font-bold text-xl leading-tight mb-2 ${hasImageBg ? 'text-white' : 'text-slate-900'}`}>{announcement.title}</h3>
        <p className={`text-base leading-relaxed flex-1 ${hasImageBg ? 'text-gray-100' : 'text-gray-700'}`}>{announcement.body}</p>
        {url && (
          isInternal ? (
            <Link
              to={url}
              className={`mt-4 text-base font-medium transition ${hasImageBg ? 'text-blue-200 hover:text-white' : 'text-amber-700 hover:text-amber-900'}`}
            >
              {label} →
            </Link>
          ) : (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-4 text-base font-medium transition ${hasImageBg ? 'text-blue-200 hover:text-white' : 'text-amber-700 hover:text-amber-900'}`}
            >
              {label} →
            </a>
          )
        )}
      </div>
    </div>
  );
}

function formatEventDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
}

function formatEventTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

export default function Worship({ events, announcements, loading }: WorshipProps) {
  const [flyerOpen, setFlyerOpen] = useState(false);
  const [flyerSrc, setFlyerSrc] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const now = new Date();
  const activeAnnouncements = announcements;
  const eventSlots = activeAnnouncements.length > 0 ? 3 : 4;
  const upcomingEvents = events
    .filter(e => !e.recurrence && e.show_on_home && new Date(e.event_date) >= now)
    .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
    .slice(0, eventSlots);
  const totalCards = upcomingEvents.length;

  const massTimes = [
    'Saturday Vigil 5:00pm',
    'Sunday 8:00am',
    'Sunday 10:30am',
    'Daily Mass Mon–Fri 8:00am'
  ];

  return (
    <section className="py-10 md:py-14 px-6 bg-blue-50 border-b border-blue-100">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Worship With Us.</h2>
        <p className="text-xl text-gray-700 mb-8 max-w-2xl">
          Prayerful, intentional, and alive. Masses rarely exceed an hour — but you'll leave wanting more.
        </p>

        <div className="flex flex-wrap gap-3 mb-12">
          {massTimes.map((time, idx) => (
            <span key={idx} className="px-6 py-3 bg-[#1e3a6e] text-white rounded-lg text-lg font-semibold">
              {time}
            </span>
          ))}
        </div>

        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Get Involved.</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {loading ? (
            [0, 1, 2, 3].map(i => (
              <div key={i} className="border border-blue-200 rounded-xl p-6 bg-white shadow-md animate-pulse">
                <div className="h-4 bg-blue-100 rounded w-1/3 mb-3" />
                <div className="h-6 bg-slate-100 rounded w-3/4 mb-2" />
                <div className="h-4 bg-slate-100 rounded w-1/2 mb-4" />
                <div className="h-4 bg-blue-100 rounded w-1/4" />
              </div>
            ))
          ) : totalCards === 0 ? (
            <div className="border border-blue-200 rounded-xl p-6 bg-white shadow-md flex flex-col justify-center items-center text-center col-span-full">
              <p className="text-gray-500 text-base">No upcoming events scheduled.</p>
              <Link to="/calendar" className="text-base text-[#1e3a6e] hover:text-[#162d57] transition font-medium mt-2">
                → view calendar
              </Link>
            </div>
          ) : (
            <>
              {activeAnnouncements.map(a => (
                <AnnouncementCard key={a.id} announcement={a} onPlayVideo={setVideoId} />
              ))}
              {upcomingEvents.map(event => {
                const isMass = event.event_type === 'Mass';
                const flyerIsImage = !!event.flyer_url && /\.(png|jpe?g|webp|gif|avif)$/i.test(event.flyer_url);
                const flyerIsPdf = !!event.flyer_url && /\.pdf$/i.test(event.flyer_url);
                const useFlyerBackground = !isMass && (flyerIsImage || flyerIsPdf);
                const isDarkTile = isMass || useFlyerBackground;
                const backgroundImage = isMass
                  ? '/Montes+-PpizXpi.jpeg'
                  : useFlyerBackground && flyerIsImage
                    ? event.flyer_url!
                    : null;
                return (
                <div
                  key={event.id}
                  className="border rounded-xl p-6 shadow-md hover:shadow-xl hover:scale-105 transition-all flex flex-col relative overflow-hidden"
                  style={backgroundImage ? {
                    backgroundImage: `url("${backgroundImage}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: useFlyerBackground ? 'center' : 'center top',
                    borderColor: 'transparent',
                  } : useFlyerBackground && flyerIsPdf ? { backgroundColor: '#1e293b', borderColor: 'transparent' } : { backgroundColor: 'white', borderColor: '#bfdbfe' }}
                >
                  {useFlyerBackground && flyerIsPdf && (
                    <iframe
                      src={`${event.flyer_url}#toolbar=0&navpanes=0&view=FitH`}
                      title={`${event.title} flyer`}
                      className="absolute inset-0 w-full h-full pointer-events-none"
                      loading="lazy"
                    />
                  )}
                  {isDarkTile && <div className="absolute inset-0 bg-black/60 rounded-xl" />}
                  <div className={`relative z-10 text-sm font-medium mb-2 ${isDarkTile ? 'text-blue-200' : 'text-blue-700'}`}>
                    {isMass ? 'Special Mass' : 'Upcoming Event'} · {formatEventDate(event.event_date)}
                  </div>
                  <h3 className={`relative z-10 font-bold mb-1 text-xl leading-tight ${isDarkTile ? 'text-white' : 'text-slate-900'}`}>{event.title}</h3>
                  <p className={`relative z-10 text-base mb-3 ${isDarkTile ? 'text-gray-200' : 'text-gray-600'}`}>
                    {event.time_tbd ? 'Time TBD' : (
                      <>
                        {formatEventTime(event.event_date)}
                        {event.end_time && ` – ${formatEventTime(event.end_time)}`}
                      </>
                    )}
                    {event.location && (
                      <>
                        <br />
                        <span className={isDarkTile ? 'text-gray-200' : 'text-gray-600'}>{event.location}</span>
                      </>
                    )}
                  </p>
                  {event.event_url && (
                    <a
                      href={event.event_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`relative z-10 text-base font-medium ${event.contact_email ? 'mt-2' : 'mt-auto'} ${isDarkTile ? 'text-blue-200 hover:text-white' : 'text-[#1e3a6e] hover:text-[#162d57]'} transition`}
                    >{/google\.com\/maps|maps\.app\.goo\.gl/.test(event.event_url) ? '→ view on map' : '→ register'}</a>
                  )}
                  {event.contact_email && (
                    <a
                      href={`mailto:${event.contact_email}`}
                      className={`relative z-10 text-base font-medium ${event.event_url ? 'mt-2' : 'mt-auto'} ${isDarkTile ? 'text-blue-200 hover:text-white' : 'text-[#1e3a6e] hover:text-[#162d57]'} transition`}
                    >→ email contact</a>
                  )}
                  {event.flyer_url && (
                    <button
                      onClick={() => { setFlyerSrc(event.flyer_url); setFlyerOpen(true); }}
                      className={`relative z-10 text-base font-medium ${event.event_url ? 'mt-2' : 'mt-auto'} text-left ${isDarkTile ? 'text-blue-200 hover:text-white' : 'text-[#1e3a6e] hover:text-[#162d57]'} transition`}
                    >→ view flyer</button>
                  )}
                  {!event.time_tbd && (
                    <button
                      onClick={() => downloadEventIcs(event)}
                      className={`relative z-10 text-base font-medium ${event.event_url || event.flyer_url ? 'mt-2' : 'mt-auto'} text-left ${isDarkTile ? 'text-blue-200 hover:text-white' : 'text-[#1e3a6e] hover:text-[#162d57]'} transition`}
                    >→ add to calendar</button>
                  )}
                </div>
                );
              })}
              {upcomingEvents.length < eventSlots && Array.from({ length: eventSlots - upcomingEvents.length }).map((_, i) => (
                <div key={`empty-${i}`} className="border border-blue-200 rounded-xl p-6 bg-white shadow-md flex flex-col justify-center items-center text-center">
                  <p className="text-gray-500 text-base">More events coming soon.</p>
                  <Link to="/calendar" className="text-base text-[#1e3a6e] hover:text-[#162d57] transition font-medium mt-2">
                    → view calendar
                  </Link>
                </div>
              ))}
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <a
            href="https://www.google.com/maps/place/Corpus+Christi+Church/@37.81302739999999,-122.2148142,17z/data=!3m1!4b1!4m6!3m5!1s0x808f87a178176f07:0xe7ed743cf4f460af!8m2!3d37.8130274!4d-122.2148142!16s%2Fg%2F1tdw1x79"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-blue-200 rounded-xl p-6 bg-white hover:shadow-xl hover:scale-105 hover:border-blue-300 transition-all shadow-md block"
          >
            <h3 className="font-bold text-slate-900 mb-2 text-xl">Where to Find Us</h3>
            <p className="text-base text-gray-600 mb-3">
              322 St. James Drive, Piedmont, CA
              <br />
              510.530.4343
            </p>
            <span className="text-base text-[#1e3a6e] hover:text-[#162d57] transition font-medium">
              → Open in Google Maps
            </span>
          </a>

          <Link
            to="/calendar"
            className="border border-[#1e3a6e] rounded-xl p-6 bg-[#1e3a6e] shadow-md hover:shadow-xl hover:scale-105 hover:bg-[#162d57] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="text-sm text-blue-200 font-medium mb-2">Parish Calendar</div>
              <h3 className="font-bold text-white mb-2 text-xl">View Full Calendar</h3>
              <p className="text-base text-blue-100 mb-3">Browse all upcoming Masses, events, and parish activities.</p>
            </div>
            <span className="text-base text-blue-200 font-medium">→ open calendar</span>
          </Link>
        </div>

        <div className="glow-pulse flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white border border-blue-300 rounded-xl p-7 mt-12">
          <span className="text-3xl flex-shrink-0">📩</span>
          <p className="flex-1 text-base text-gray-700">
            Get parish news, event reminders, and Fr. Leo's updates — by text or email.
          </p>
          <a
            href="https://corpuschristipiedmont.flocknote.com/everyone"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#1e3a6e] text-white rounded-lg font-semibold hover:bg-[#162d57] transition text-base whitespace-nowrap"
          >
            Sign Up for Flocknote
          </a>
        </div>
      </div>
      {videoId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setVideoId(null)}
        >
          <div
            className="relative w-full max-w-3xl"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setVideoId(null)}
              className="absolute -top-4 -right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition"
              aria-label="Close video"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
            <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                className="absolute inset-0 w-full h-full"
                title="Announcement video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
      {flyerOpen && flyerSrc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setFlyerOpen(false)}
        >
          <div
            className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setFlyerOpen(false)}
              className="absolute top-3 right-3 z-10 bg-white rounded-full p-1.5 shadow hover:bg-gray-100 transition"
              aria-label="Close flyer"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
            <iframe
              src={flyerSrc}
              className="w-full flex-1 rounded-xl"
              style={{ minHeight: '75vh' }}
              title="Event Flyer"
            />
          </div>
        </div>
      )}
    </section>
  );
}
