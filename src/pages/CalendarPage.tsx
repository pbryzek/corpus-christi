import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X, ExternalLink, Clock, MapPin, Calendar, CalendarPlus, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { downloadEventIcs } from '../lib/generateIcs';

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

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MASS_SCHEDULE = [
  { label: 'Saturday Vigil', time: '5:00pm', days: 'Saturday' },
  { label: 'Sunday Mass', time: '8:00am & 10:30am', days: 'Sunday' },
  { label: 'Daily Mass', time: '8:00am', days: 'Mon – Fri' },
];

const TZ = 'America/Los_Angeles';

function ptParts(iso: string) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    year: 'numeric', month: '2-digit', day: '2-digit',
    weekday: 'short',
  }).formatToParts(new Date(iso));
  const get = (t: string) => parts.find(p => p.type === t)?.value ?? '';
  return {
    year: parseInt(get('year')),
    month: parseInt(get('month')) - 1,
    day: parseInt(get('day')),
    dow: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(get('weekday')),
  };
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { timeZone: TZ, hour: 'numeric', minute: '2-digit', hour12: true });
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

function isSameDayPt(iso: string, calDate: Date) {
  const p = ptParts(iso);
  return p.year === calDate.getFullYear() &&
    p.month === calDate.getMonth() &&
    p.day === calDate.getDate();
}

function isRecurringOnDate(event: Event, date: Date): boolean {
  if (!event.recurrence) return false;
  const dow = date.getDay();
  if (event.recurrence === 'weekly-sat') return dow === 6;
  if (event.recurrence === 'weekly-sun') return dow === 0;
  if (event.recurrence === 'weekday') return dow >= 1 && dow <= 5;
  return false;
}

function getEventColor(type: string) {
  if (type === 'Mass') return 'bg-blue-600 text-white';
  return 'bg-amber-500 text-white';
}

function getEventDotColor(type: string) {
  if (type === 'Mass') return 'bg-blue-600';
  return 'bg-amber-500';
}

export default function CalendarPage() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [filter, setFilter] = useState<'all' | 'events'>('all');
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  useEffect(() => {
    supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true })
      .then(({ data }) => {
        setEvents(data || []);
        setLoading(false);
      });
  }, []);

  function prevMonth() {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  }
  function nextMonth() {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  }

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const calendarCells: (Date | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(currentYear, currentMonth, i + 1))
  ];

  function getEventsForDay(date: Date): Event[] {
    return events.filter(e => {
      const matchesDirect = isSameDayPt(e.event_date, date);
      const matchesRecurring = isRecurringOnDate(e, date);
      const show = matchesDirect || matchesRecurring;
      if (!show) return false;
      if (filter === 'events') return e.event_type !== 'Mass';
      return true;
    });
  }

  const upcomingEvents = events
    .filter(e => {
      if (filter === 'events' && e.event_type === 'Mass') return false;
      if (e.recurrence) return true;
      return new Date(e.event_date) >= today;
    })
    .sort((a, b) => {
      const dateA = new Date(a.event_date);
      const dateB = new Date(b.event_date);
      return dateA.getTime() - dateB.getTime();
    });

  const dayEvents = selectedDay ? getEventsForDay(selectedDay) : [];

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Hero */}
      <div className="bg-slate-900 text-white py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-blue-300 text-sm font-semibold tracking-widest uppercase mb-2">Corpus Christi Parish</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Parish Calendar</h1>
          <p className="text-slate-300 text-lg max-w-2xl">
            Mass times, parish events, and upcoming gatherings for our community.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Weekly Mass Schedule Band */}
        <div className="bg-blue-700 rounded-2xl p-6 mb-8 shadow-sm">
          <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Weekly Mass Schedule
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {MASS_SCHEDULE.map(m => (
              <div key={m.label} className="bg-blue-800/60 rounded-xl p-4">
                <p className="text-blue-200 text-xs font-semibold uppercase tracking-wider mb-1">{m.days}</p>
                <p className="text-white font-bold text-lg">{m.time}</p>
                <p className="text-blue-200 text-sm mt-1">{m.label}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-3">
            <p className="text-blue-200 text-sm flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              322 St. James Drive, Piedmont, CA 94611
            </p>
            <a
              href="/Priest_calendar.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              <FileText className="w-4 h-4" />
              Pastor Calendar
            </a>
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-sm font-medium text-slate-600">Show:</span>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${filter === 'all' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('events')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${filter === 'events' ? 'bg-amber-500 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
          >
            Events Only
          </button>
          <div className="ml-auto hidden sm:flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" /> Mass</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Event</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Grid */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {/* Month Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-slate-100 transition text-slate-600">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="font-bold text-slate-800 text-xl">{MONTHS[currentMonth]} {currentYear}</h2>
                <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-slate-100 transition text-slate-600">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Day labels */}
              <div className="grid grid-cols-7 border-b border-slate-100">
                {DAYS.map(d => (
                  <div key={d} className="py-2 text-center text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    {d}
                  </div>
                ))}
              </div>

              {/* Calendar cells */}
              {loading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-7">
                  {calendarCells.map((date, i) => {
                    if (!date) return <div key={`empty-${i}`} className="aspect-square border-b border-r border-slate-50" />;
                    const dayEvs = getEventsForDay(date);
                    const isToday = isSameDay(date, today);
                    const isSelected = selectedDay ? isSameDay(date, selectedDay) : false;
                    return (
                      <button
                        key={date.toISOString()}
                        onClick={() => setSelectedDay(isSelected ? null : date)}
                        className={`aspect-square border-b border-r border-slate-50 p-1 flex flex-col items-start transition hover:bg-blue-50 ${isSelected ? 'bg-blue-50 ring-2 ring-inset ring-blue-400' : ''}`}
                      >
                        <span className={`text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full mb-0.5 ${isToday ? 'bg-blue-600 text-white' : 'text-slate-600'}`}>
                          {date.getDate()}
                        </span>
                        <div className="flex flex-wrap gap-0.5 mt-auto">
                          {dayEvs.slice(0, 3).map((e, idx) => (
                            <span key={idx} className={`w-1.5 h-1.5 rounded-full ${getEventDotColor(e.event_type)}`} />
                          ))}
                          {dayEvs.length > 3 && <span className="text-[9px] text-slate-400">+{dayEvs.length - 3}</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Day detail panel */}
            {selectedDay && (
              <div className="mt-4 bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
                  <h3 className="font-semibold text-slate-800">
                    {selectedDay.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </h3>
                  <button onClick={() => setSelectedDay(null)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {dayEvents.length === 0 ? (
                  <p className="px-5 py-4 text-slate-400 text-sm">No events scheduled for this day.</p>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {dayEvents.map(e => (
                      <button
                        key={e.id + selectedDay.toISOString()}
                        onClick={() => setSelectedEvent(e)}
                        className="w-full text-left px-5 py-3 hover:bg-slate-50 transition flex items-start gap-3"
                      >
                        <span className={`mt-1 px-2 py-0.5 rounded-full text-xs font-semibold ${getEventColor(e.event_type)}`}>
                          {e.event_type}
                        </span>
                        <div>
                          <p className="font-medium text-slate-800 text-sm">{e.title}</p>
                          <p className="text-slate-400 text-xs mt-0.5">{e.time_tbd ? 'Time TBD' : formatTime(e.event_date)}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Upcoming Events Sidebar */}
          <div>
            <h3 className="font-bold text-slate-700 text-base mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Upcoming Events
            </h3>
            {loading ? (
              <div className="space-y-3">
                {[1,2,3].map(i => <div key={i} className="h-16 bg-white rounded-xl animate-pulse" />)}
              </div>
            ) : (
              <div className="space-y-2">
                {upcomingEvents
                  .filter(e => e.event_type !== 'Mass' || !e.recurrence)
                  .filter(e => e.event_type !== 'Mass')
                  .slice(0, 8)
                  .map(e => (
                    <button
                      key={e.id}
                      onClick={() => setSelectedEvent(e)}
                      className="w-full text-left bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition group"
                    >
                      <div className="flex items-start gap-2">
                        <span className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${getEventDotColor(e.event_type)}`} />
                        <div className="min-w-0">
                          <p className="font-medium text-slate-800 text-sm leading-tight group-hover:text-blue-700 transition line-clamp-2">{e.title}</p>
                          <p className="text-slate-400 text-xs mt-1">
                            {new Date(e.event_date).toLocaleDateString('en-US', { timeZone: TZ, month: 'short', day: 'numeric' })}
                            {' · '}{e.time_tbd ? 'Time TBD' : formatTime(e.event_date)}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                {upcomingEvents.filter(e => e.event_type !== 'Mass').length === 0 && (
                  <p className="text-slate-400 text-sm">No upcoming events.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedEvent(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className={`px-6 py-5 ${selectedEvent.event_type === 'Mass' ? 'bg-blue-700' : 'bg-amber-500'}`}>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">{selectedEvent.event_type}</span>
                  <h2 className="text-white font-bold text-xl mt-1 leading-tight">{selectedEvent.title}</h2>
                </div>
                <button onClick={() => setSelectedEvent(null)} className="text-white/70 hover:text-white transition ml-4 flex-shrink-0">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="flex items-center gap-2 text-slate-600">
                <Clock className="w-4 h-4 flex-shrink-0 text-slate-400" />
                <span className="text-sm">
                  {new Date(selectedEvent.event_date).toLocaleDateString('en-US', { timeZone: TZ, weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  {' · '}{selectedEvent.time_tbd ? 'Time TBD' : formatTime(selectedEvent.event_date)}
                  {!selectedEvent.time_tbd && selectedEvent.end_time && ` – ${formatTime(selectedEvent.end_time)}`}
                  {selectedEvent.recurrence && <span className="ml-2 text-xs bg-slate-100 px-2 py-0.5 rounded-full text-slate-500">Recurring</span>}
                </span>
              </div>
              {selectedEvent.location && (
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="w-4 h-4 flex-shrink-0 text-slate-400" />
                  <span className="text-sm">{selectedEvent.location}</span>
                </div>
              )}
              {selectedEvent.description && (
                <p className="text-slate-600 text-sm leading-relaxed">{selectedEvent.description}</p>
              )}
              {selectedEvent.event_url && (
                <a
                  href={selectedEvent.event_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800 transition"
                >
                  Learn more <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {!selectedEvent.time_tbd && (
                <div>
                  <button
                    onClick={() => downloadEventIcs(selectedEvent)}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800 transition"
                  >
                    <CalendarPlus className="w-4 h-4" />
                    Add to calendar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
