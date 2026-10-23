import { useEffect, useState } from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';

const STATIC_TEAM = [
  { name: 'Lisa Gros', bio: 'Empty nester and finding my way', photo: '/Lisa.jpg' },
  { name: 'Aileen Throne', bio: 'Mom of two: one off to college, one in high school, both reminding me that snacks solve most problems', photo: null as string | null },
  { name: 'Dave Kevane', bio: 'Proud dad, four amazing girls!', photo: '/Dave_K.jpg' },
  { name: 'David Rolefson', bio: 'Dad of twins in college', photo: '/David_R.jpg' },
  { name: 'Francisco Dominguez', bio: null as string | null, photo: '/Francisco.jpg' },
  { name: 'Kit Soo', bio: 'Mum of one finding his way', photo: '/Kit.jpg' },
  { name: 'Sophia Bucheli', bio: 'Mom of four, two in college and two off the payroll', photo: '/Sophia.jpg' },
  { name: 'Stannye Nelson', bio: 'Empty nest mom of three', photo: '/Stannye.jpg' },
];

const STATIC_EVENTS = [
  {
    emoji: '🎤',
    title: 'Guest Speaker Event: Where is the Good News in Christianity Today?',
    description: "Join us with Santa Clara University's Paul Schutz to explore a fresh lens on ancient faith for a changing world.",
    event_date: 'Thursday, September 24  ·  7:00 – 8:30 PM',
    location: 'Gibson Center',
    rsvp_open: true,
    rsvp_url: null as string | null,
  },
  {
    emoji: '🍕',
    title: 'FallFest Pizza Patio Social',
    description: 'Join us for outdoor oven pizzas, homemade beer, and great company.',
    event_date: 'Saturday, October 18  ·  4:00 – 7:00 PM',
    location: 'Parishioner home',
    rsvp_open: false,
    rsvp_url: null as string | null,
  },
  {
    emoji: '🎤',
    title: 'Guest Speaker Event: AI is Changing Everything. How Can We Become More Human?',
    description: 'A conversation with Santa Clara Ethicist Brian Patrick Green about AI, human flourishing, faith, and the future.',
    event_date: 'Thursday, November 12  ·  7:00 – 8:30 PM [to be confirmed]',
    location: 'Gibson Center',
    rsvp_open: false,
    rsvp_url: null as string | null,
  },
];

interface DbEvent {
  id: string;
  emoji: string | null;
  title: string;
  description: string | null;
  event_date: string;
  location: string | null;
  rsvp_open: boolean;
  rsvp_url: string | null;
  button_label: string | null;
}

interface DbContact {
  id: string;
  name: string;
  bio: string | null;
  image_url: string | null;
}

const JOIN_URL = 'https://forms.gle/2RDUSXznfu5UP9P49';

export default function GenXishPage() {
  const [events, setEvents] = useState(STATIC_EVENTS as (typeof STATIC_EVENTS[0] | DbEvent)[]);
  const [team, setTeam] = useState(STATIC_TEAM as (typeof STATIC_TEAM[0] | DbContact)[]);

  useEffect(() => {
    supabase
      .from('page_events')
      .select('id, emoji, title, description, event_date, location, rsvp_open, rsvp_url, button_label')
      .eq('page_slug', 'genxish')
      .order('sort_order', { ascending: true })
      .then(({ data }) => { if (data && data.length > 0) setEvents(data); });

    supabase
      .from('page_contacts')
      .select('id, name, bio, image_url')
      .eq('page_slug', 'genxish')
      .order('sort_order', { ascending: true })
      .then(({ data }) => { if (data && data.length > 0) setTeam(data); });
  }, []);

  return (
    <div className="min-h-screen bg-stone-50">

      {/* Hero — full-width banner */}
      <div className="relative overflow-hidden">
        {/* Background photo */}
        <img
          src="/GenXish_Fellowship_banner.png"
          alt="GenX-ish Fellowship friends"
          className="w-full h-auto block"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent" />

        {/* Hero content — pinned to bottom-left */}
        <div className="absolute bottom-0 left-0 z-10 p-8 md:p-14 max-w-3xl">
          <div className="flex flex-wrap gap-3">
            <a
              href={JOIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-stone-900 font-semibold px-7 py-3 rounded-lg hover:bg-stone-100 transition-all duration-150 shadow-lg hover:shadow-xl hover:scale-105"
            >
              Get Connected! →
            </a>
          </div>
        </div>
      </div>

      {/* Who We Are — two-column with second photo */}
      <section className="py-20 px-6 bg-white border-b border-stone-100">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <div>
            <p className="section-label mb-5">Who We Are</p>
            <h2 className="text-4xl font-bold font-serif text-stone-900 mb-5 leading-snug">
              A community for navigating midlife with faith, friendship, and purpose.
            </h2>
            <p className="text-lg text-stone-600 leading-relaxed mb-5">
              We are GenX (and GenX-adjacent) parishioners seeking meaningful connection in a season that is often full — and changing.
            </p>
            <p className="text-base font-semibold text-stone-800 mb-3">Are you navigating:</p>
            <ul className="space-y-2 mb-6">
              {['Parenting teens or young adults?', 'Career or life transitions?', 'Questions about what\'s next?'].map((item) => (
                <li key={item} className="flex items-start gap-3 text-base text-stone-600">
                  <span className="text-amber-500 font-bold mt-0.5">▸</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-lg font-bold text-stone-900">You belong here.</p>
          </div>
          <div className="relative">
            <img
              src="/GenXish_image.png"
              alt="GenX-ish friends enjoying fellowship"
              className="w-full h-auto object-contain rounded-2xl shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-20 px-6 bg-stone-100 border-b border-stone-200">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl">
            <p className="section-label mb-5">What We Do</p>
            <h2 className="text-4xl font-bold font-serif text-stone-900 mb-5 leading-snug">
              Real gatherings. Real conversations.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {[
              {
                icon: '🥂',
                title: 'Social Events',
                body: 'Cocktail socials, backyard BBQs, and pizza patios — the stuff that turns strangers into friends.',
              },
              {
                icon: '🤝',
                title: 'Service',
                body: 'Opportunities to make a difference alongside people who share your values.',
              },
              {
                icon: '💬',
                title: 'Faith & Life',
                body: "Formational discussions about the big questions — faith, meaning, family, and what's next.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="bg-white rounded-2xl border border-stone-200 p-7 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="text-3xl mb-4">{card.icon}</div>
                <h3 className="text-lg font-bold text-stone-900 mb-2">{card.title}</h3>
                <p className="text-sm text-stone-600 leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-stone-500 italic mt-8">
            Several more social, service, and discussion events are in the works. Watch this space!
          </p>
        </div>
      </section>

      {/* Upcoming Gatherings */}
      <section className="py-20 px-6 bg-white border-b border-stone-100">
        <div className="max-w-4xl mx-auto">
          <p className="section-label mb-5">Upcoming Gatherings</p>
          <h2 className="text-4xl font-bold font-serif text-stone-900 mb-10 leading-snug">
            Mark your calendar.
          </h2>
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.title}
                className={`rounded-2xl border p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 transition-shadow duration-150 ${
                  event.rsvp_open
                    ? 'border-amber-400 bg-amber-50 shadow-md'
                    : 'border-stone-200 bg-stone-50'
                }`}
              >
                <div className="text-3xl flex-shrink-0">{event.emoji || '📅'}</div>
                <div className="flex-1">
                  {event.rsvp_open && (
                    <span className="inline-block text-xs font-bold tracking-widest uppercase px-2.5 py-1 rounded mb-2 bg-amber-400 text-stone-900">
                      RSVP Open
                    </span>
                  )}
                  {!event.rsvp_open && event.event_date.toLowerCase().startsWith('postponed') && (
                    <span className="inline-block text-xs font-bold tracking-widest uppercase px-2.5 py-1 rounded mb-2 bg-stone-400 text-white">
                      Postponed
                    </span>
                  )}
                  <h3 className="text-base font-bold text-stone-900 mb-1">{event.title}</h3>
                  <p className="text-sm text-stone-600 leading-relaxed mb-2">{event.description}</p>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-sm text-stone-500">
                      <Calendar size={13} className="flex-shrink-0" />
                      {event.event_date}
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2 text-sm text-stone-500">
                        <MapPin size={13} className="flex-shrink-0" />
                        {event.location}
                      </div>
                    )}
                    {(event as typeof STATIC_EVENTS[0]).cost && (
                      <div className="flex items-center gap-2 text-sm text-stone-500">
                        <span className="text-xs font-bold text-stone-400">$</span>
                        {(event as typeof STATIC_EVENTS[0]).cost}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {event.rsvp_open && event.rsvp_url ? (
                    <a
                      href={event.rsvp_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-stone-900 text-white font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-stone-800 transition-colors duration-150 shadow hover:shadow-md"
                    >
                      Learn More & RSVP →
                    </a>
                  ) : (
                    <span className="inline-block bg-stone-200 text-stone-500 font-semibold text-sm px-5 py-2.5 rounded-lg cursor-default">
                      {(event as DbEvent).button_label ?? 'Save the Date'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="py-20 px-6 bg-stone-100 border-b border-stone-200">
        <div className="max-w-4xl mx-auto">
          <p className="section-label mb-5">Meet the Team</p>
          <h2 className="text-4xl font-bold font-serif text-stone-900 mb-10 leading-snug">
            The people behind it all.
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {team.map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-xl border border-stone-200 p-5 flex items-start gap-4 shadow-sm"
              >
                <div className="w-12 h-12 rounded-full flex-shrink-0 overflow-hidden bg-stone-200 flex items-center justify-center">
                  {((member as DbContact).image_url || (member as typeof STATIC_TEAM[0]).photo) ? (
                    <img
                      src={((member as DbContact).image_url || (member as typeof STATIC_TEAM[0]).photo)!}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Users size={16} className="text-stone-500" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-stone-900">{member.name}</p>
                  {member.bio && (
                    <p className="text-sm text-stone-500 italic leading-snug mt-0.5">{member.bio}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          <a
            href={JOIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-stone-900 text-white font-semibold px-7 py-3 rounded-lg hover:bg-stone-800 transition-all duration-150 shadow-md hover:shadow-lg hover:scale-105"
          >
            Get Connected! →
          </a>
        </div>
      </section>

      {/* CTA Band */}
      <div className="mx-6 md:mx-10 my-12 bg-[#1e3a6e] text-white rounded-2xl px-8 py-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
        <div>
          <h3 className="text-2xl font-bold font-serif mb-1">Ready to find your people?</h3>
          <p className="text-blue-200 text-base">Come once. See for yourself.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href={JOIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-[#1e3a6e] font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-all duration-150 shadow-md hover:shadow-lg hover:scale-105 text-sm"
          >
            Get Connected! →
          </a>
        </div>
      </div>

    </div>
  );
}
