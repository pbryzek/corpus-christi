import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, ChevronDown, Mail, User } from 'lucide-react';
import Contact from '../components/Contact';
import { usePageData } from '../lib/usePageData';
import { staffMembers, StaffMember } from '../lib/staffData';

// ── Section nav items ────────────────────────────────────────────────────────

const sections = [
  { label: 'Mission & Values', id: 'mission' },
  { label: 'Why Corpus?',      id: 'why-corpus' },
  { label: 'Meet Our Staff',   id: 'staff' },
  { label: 'Contact Us',       id: 'contact' },
];

// ── Staff bio detail ─────────────────────────────────────────────────────────

function StaffDetail({ member, onBack }: { member: StaffMember; onBack: () => void }) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-base text-[#1e3a6e]/80 hover:text-[#1e3a6e] border border-blue-200 bg-white px-4 py-2 rounded-lg mb-10 transition"
      >
        <ArrowLeft size={16} />
        Back to Team
      </button>

      {member.bio ? (
        <>
          <div className="bg-[#1e3a6e] text-white rounded-xl p-10 mb-10 text-center">
            <p className="text-3xl font-light leading-relaxed italic">{member.bio.pullquote}</p>
          </div>

          <div className="grid md:grid-cols-[180px_1fr] gap-8 items-start mb-10 pb-10 border-b border-blue-100">
            <div className="aspect-[3/4] border border-blue-200 rounded-lg bg-blue-100 flex items-center justify-center overflow-hidden">
              {member.photo ? (
                <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
              ) : (
                <User size={48} className="text-blue-400" />
              )}
            </div>
            <div>
              <h2 className="text-4xl font-bold text-[#1e3a6e] mb-1">{member.name}</h2>
              <p className="text-base text-[#1e3a6e]/80 mb-4">{member.role}</p>
              <a href={`mailto:${member.email}`} className="text-base text-[#1e3a6e] border-b border-slate-900 inline-flex items-center gap-2">
                <Mail size={14} />
                {member.email === 'office@cc-parish.org' ? member.email : `Contact ${member.name}`}
              </a>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              { label: 'The most inspiring part of their ministry', text: member.bio.inspiring, bg: 'bg-amber-50', border: 'border-amber-200', labelColor: 'text-amber-600' },
              { label: "Saint they'd have coffee with",             text: member.bio.saint, bg: 'bg-rose-50', border: 'border-rose-200', labelColor: 'text-rose-500' },
              { label: 'Song that feels like God',                  text: member.bio.song, bg: 'bg-emerald-50', border: 'border-emerald-200', labelColor: 'text-emerald-600' },
              { label: 'Prayer life in three words',                text: member.bio.prayer, bg: 'bg-sky-50', border: 'border-sky-200', labelColor: 'text-sky-600' },
            ].map(({ label, text, bg, border, labelColor }) => (
              <div key={label} className={`border ${border} rounded-lg p-6 ${bg} shadow-sm`}>
                <p className={`text-sm font-semibold tracking-wider uppercase ${labelColor} mb-3`}>{label}</p>
                <p className="text-base text-[#1e3a6e]/80 leading-relaxed">{text}</p>
              </div>
            ))}
            <div className="md:col-span-2 border border-orange-200 rounded-lg p-6 bg-orange-50">
              <p className="text-sm font-semibold tracking-wider uppercase text-orange-500 mb-3">Street Cred</p>
              <p className="text-base text-[#1e3a6e]/80 leading-relaxed">{member.bio.credentials}</p>
            </div>
            <div className="md:col-span-2 border border-teal-200 rounded-lg p-6 bg-teal-50 shadow-sm">
              <p className="text-sm font-semibold tracking-wider uppercase text-teal-600 mb-3">Favorite ritual after Mass</p>
              <p className="text-base text-[#1e3a6e]/80 leading-relaxed">{member.bio.ritual}</p>
            </div>
            {member.bio.extra && (
              <div className="md:col-span-2 border border-fuchsia-200 rounded-lg p-6 bg-fuchsia-50">
                <p className="text-sm font-semibold tracking-wider uppercase text-fuchsia-500 mb-3">{member.bio.extra.title}</p>
                <p className="text-base text-[#1e3a6e]/80 leading-relaxed">{member.bio.extra.text}</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="border-2 border-dashed border-blue-200 rounded-xl p-16 text-center text-blue-400">
          <strong className="block text-2xl text-blue-500 mb-3">{member.name} — {member.role}</strong>
          <p className="text-base">Bio coming soon. (He's working on it.)</p>
        </div>
      )}
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function AboutPage() {
  const location = useLocation();
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const { content, contacts } = usePageData('about');

  const missionRef  = useRef<HTMLElement>(null);
  const whyRef      = useRef<HTMLElement>(null);
  const staffRef    = useRef<HTMLElement>(null);
  const contactRef  = useRef<HTMLElement>(null);

  const refMap: Record<string, React.RefObject<HTMLElement | null>> = {
    mission:    missionRef,
    'why-corpus': whyRef,
    staff:      staffRef,
    contact:    contactRef,
  };

  function scrollTo(id: string) {
    refMap[id]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.replaceState(null, '', `/about#${id}`);
  }

  // On load / hash change, scroll to the right section
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash && refMap[hash]) {
      // Small delay lets the page paint first
      const timer = setTimeout(() => {
        refMap[hash]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.hash]);

  // Staff detail overlay
  if (selectedStaff) {
    return (
      <div className="bg-sky-50 min-h-screen">
        <StaffDetail member={selectedStaff} onBack={() => setSelectedStaff(null)} />
      </div>
    );
  }

  return (
    <div className="bg-sky-50">

      {/* Page hero */}
      <div
        className="relative text-white py-20 px-6 text-center bg-cover bg-center"
        style={{ backgroundImage: "url('/inner_church_compressed.jpg')" }}
      >
        <div className="absolute inset-0 bg-[#1e3a6e]/75" />
        <div className="relative z-10">
          <p className="text-base font-semibold tracking-widest uppercase text-blue-200 mb-6">About Us</p>
          <h1 className="text-5xl md:text-6xl font-light font-serif leading-tight max-w-3xl mx-auto">
            {content['hero']?.title || 'Nearly 100 years of showing up for each other.'}
          </h1>
        </div>
      </div>

      {/* Sticky section nav */}
      <div className="sticky top-[72px] z-40 bg-white border-b border-blue-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 flex overflow-x-auto">
          {sections.map(({ label, id }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="px-5 py-4 text-sm font-semibold text-[#1e3a6e]/60 hover:text-[#1e3a6e] hover:bg-blue-50 whitespace-nowrap border-b-2 border-transparent hover:border-[#1e3a6e] transition flex-shrink-0"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Mission & Values ───────────────────────────────────────────── */}
      <section ref={missionRef} id="mission" className="scroll-mt-28 border-b border-blue-100">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <p className="text-sm font-semibold tracking-widest uppercase text-[#1e3a6e]/60 mb-4">Our Mission</p>
          <h2 className="text-4xl md:text-5xl font-light leading-tight text-[#1e3a6e] mb-10">
            {content['mission']?.title || "We're a Parish Shaped by a Community Who Loves It"}
          </h2>
          {(() => {
            const bodyText = content['mission']?.body_text || "For nearly 100 years, Corpus Christi has been shaped by the people who show up \u2014 who serve, who welcome the stranger, and who keep returning because something here is real.\n\nFr. Leo means every word of that. And he'll be the first to tell you: he doesn't define this parish. You do.\n\nYour joy.\nYour challenges.\nYour openness.\nYour gifts.\nYour contributions.\n\nThat's what makes Corpus Christi alive.";
            const quoteText = content['mission']?.subtitle || "One of the greatest joys of my life is telling others about Corpus Christi. And the fact that I call it a family tells you just about everything you need to know. We're not a perfect community \u2014 we're a real one. Big hopes, full hearts, and a hunger for something meaningful. And somehow, every Sunday, something happens.\n\nStrangers become neighbors. Neighbors become friends. Friends become family. Some people walk in a little weary and walk out lighter. It always moves me when I see and feel it. Everyone belongs here \u2014 all we ask is that you give us a chance to prove it.";
            const bodyParagraphs = bodyText.split('\n\n');
            const quoteParagraphs = quoteText.split('\n\n');
            return (
              <>
                <p className="text-xl leading-relaxed text-[#1e3a6e]/80 mb-10">
                  {bodyParagraphs[0]}
                </p>
                <div className="bg-white border-l-4 border-[#1e3a6e] rounded-r-lg p-8 mb-12">
                  {quoteParagraphs.map((qp, i) => (
                    <p key={i} className={`text-2xl font-medium text-[#1e3a6e] italic leading-relaxed ${i > 0 ? 'mt-4' : ''}`}>
                      {i === 0 ? `\u201C${qp}` : qp}{i === quoteParagraphs.length - 1 ? '\u201D' : ''}
                    </p>
                  ))}
                  <p className="text-base font-semibold text-[#1e3a6e]/70 mt-4">— Fr. Leo, Pastor</p>
                </div>

                <div className="grid md:grid-cols-2 gap-10 items-center mb-12">
                  <div className="space-y-2">
                    {bodyParagraphs.slice(1).map((bp, i) => {
                      const lines = bp.split('\n');
                      return lines.map((line, j) => (
                        <p key={`${i}-${j}`} className={`text-xl leading-relaxed text-[#1e3a6e]/80 ${i === bodyParagraphs.length - 2 && j === lines.length - 1 ? 'font-bold pt-2' : ''}`}>
                          {line}
                        </p>
                      ));
                    })}
                  </div>
                  <div className="rounded-xl overflow-hidden shadow-md">
                    <img src="/Gallery_c.jpg" alt="Family at Mass" className="w-full h-full object-cover" />
                  </div>
                </div>
              </>
            );
          })()}

          <div className="flex flex-wrap gap-4">
            <Link to="/mass" className="px-6 py-3 bg-[#1e3a6e] text-white text-base font-semibold rounded-lg hover:bg-[#162d57] transition">
              Join Us This Sunday
            </Link>
            <Link to="/new-visitors" className="px-6 py-3 bg-white text-[#1e3a6e] text-base font-semibold rounded-lg border-2 border-[#1e3a6e] hover:bg-blue-50 transition">
              New? Yes!
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why Corpus? ────────────────────────────────────────────────── */}
      <section ref={whyRef} id="why-corpus" className="scroll-mt-28 border-b border-blue-100 bg-white">
        <div className="bg-[#1e3a6e] text-white py-16 px-6 text-center">
          <p className="text-sm font-semibold tracking-widest uppercase text-blue-200 mb-4">Why Corpus?</p>
          <h2 className="text-4xl md:text-5xl font-light leading-tight max-w-3xl mx-auto">
            {content['why-corpus']?.title || 'Some Things You Just Have to Experience.'}
          </h2>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="text-center mb-14">
            <p className="text-2xl leading-relaxed text-[#1e3a6e]/80 mb-4">
              {content['why-corpus']?.subtitle || 'The music. The welcome. The school. Fr. Leo... and a community that shows up for each other in ways that still surprise us.'}
            </p>
            <p className="text-2xl leading-relaxed text-[#1e3a6e]/80">But don't take our word for it.</p>
          </div>

          <div className="aspect-video rounded-lg overflow-hidden shadow-lg mb-14">
            <iframe
              src={content['why-corpus']?.link_url || 'https://player.vimeo.com/video/1188520482?badge=0&autopause=0&player_id=0&app_id=58479'}
              className="w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
              title="Why Corpus Christi"
            />
          </div>

          <p className="text-2xl leading-relaxed text-[#1e3a6e]/80 text-center mb-12">
            We continue to evolve — and we're 100 years young. Some things, though, have never changed:
          </p>

          <div className="space-y-6 mb-10">
            {(() => {
              const DEFAULT_VALUES = [
                { h: 'We take faith seriously \u2014 and ourselves lightly.', p: 'Expect substance, humor, and homilies worth talking about at brunch.' },
                { h: 'Our community found us as much as we found them.', p: "Across generations, backgrounds, and life stories \u2014 the diversity here just happened naturally. And it's one of our greatest gifts." },
                { h: 'We wrestle with faith openly.', p: "We're a community that sits with complexity, not one that pretends it's simple." },
                { h: "We don't just welcome you \u2014 we accept you.", p: 'Not despite who you are, but because of who you are.' },
              ];
              const whyBody = content['why-corpus']?.body_text;
              const values = whyBody
                ? whyBody.split('\n\n').map(block => {
                    const lines = block.split('\n');
                    return { h: lines[0] || '', p: lines.slice(1).join(' ') };
                  })
                : DEFAULT_VALUES;
              return values.map(({ h, p }) => (
                <div key={h} className="bg-sky-50 border border-blue-100 rounded-lg p-10">
                  <h3 className="text-3xl font-bold text-[#1e3a6e] mb-4">{h}</h3>
                  <p className="text-xl leading-relaxed text-[#1e3a6e]/80">{p}</p>
                </div>
              ));
            })()}
          </div>

          <div className="rounded-xl overflow-hidden shadow-md mb-14">
            <img src="/New_Photo_Gallery_c.jpg" alt="Kids at parish event" className="w-full object-cover max-h-80" />
          </div>

          <div className="border-t border-blue-100 pt-12 text-center">
            <p className="text-3xl font-light text-[#1e3a6e] italic mb-6">Come see what keeps people coming back.</p>
            <p className="text-xl leading-relaxed text-[#1e3a6e]/80 mb-8 max-w-2xl mx-auto">
              The best way to understand why Corpus Christi is special is to experience it yourself. Join us for Mass this Sunday and see what makes this community so unique.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/mass" className="px-6 py-3 bg-[#1e3a6e] text-white text-base font-semibold rounded-lg hover:bg-[#162d57] transition">
                Join Us This Sunday
              </Link>
              <Link to="/new-visitors" className="px-6 py-3 bg-white text-[#1e3a6e] text-base font-semibold rounded-lg border-2 border-[#1e3a6e] hover:bg-blue-50 transition">
                New? YES!
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Meet Our Staff ─────────────────────────────────────────────── */}
      <section ref={staffRef} id="staff" className="scroll-mt-28 border-b border-blue-100">
        <div className="bg-[#1e3a6e] text-white py-16 px-6 text-center">
          <p className="text-sm font-semibold tracking-widest uppercase text-blue-200 mb-4">{content['staff-intro']?.title || 'Meet Our Pastoral Staff'}</p>
          <h2 className="text-3xl md:text-4xl font-light leading-relaxed max-w-4xl mx-auto">
            {content['staff-intro']?.subtitle || "Educators, musicians, ministers, and theologians \u2014 with decades of experience and numerous advanced degrees between them. They love what they do \u2014 and it shows."}
          </h2>
        </div>

        <div className="py-16 px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {(contacts.length > 0
              ? contacts.map(c => {
                  const matched = staffMembers.find(s => s.email === c.email || s.name === c.name);
                  return matched
                    ? { ...matched, name: c.name, role: c.role || matched.role, photo: c.image_url || matched.photo, teaser: c.bio || matched.teaser }
                    : { id: c.id, name: c.name, role: c.role || '', email: c.email || '', teaser: c.bio || '', photo: c.image_url || undefined } as StaffMember;
                })
              : staffMembers
            ).map((member) => (
              <button
                key={member.id}
                onClick={() => {
                  setSelectedStaff(member);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-center cursor-pointer transition hover:-translate-y-1 group flex flex-col"
              >
                <div className="aspect-[3/4] w-full border-2 border-blue-200 rounded-lg bg-blue-50 flex items-center justify-center mb-4 group-hover:border-[#1e3a6e] transition overflow-hidden">
                  {member.photo ? (
                    <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <User size={40} className="text-blue-400" />
                  )}
                </div>
                <h3 className="text-base font-bold text-[#1e3a6e] mb-1">{member.name}</h3>
                <p className="text-sm text-[#1e3a6e]/80 mb-3 leading-tight min-h-[2.5rem] flex items-start justify-center">{member.role}</p>
                <p className="text-sm text-[#1e3a6e]/70 italic leading-snug pt-3 border-t border-blue-100 flex-1">{member.teaser}</p>
                <p className="text-sm text-blue-400 mt-3">Click to meet</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ────────────────────────────────────────────────────── */}
      <section ref={contactRef} id="contact" className="scroll-mt-28">
        <div className="bg-white">
          <Contact />
        </div>

        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white border border-blue-100 rounded-xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-[#1e3a6e] mb-4">Parish Office Hours</h3>
              <div className="space-y-2 text-base text-[#1e3a6e]/80">
                <p>Monday – Thursday: 9:00 AM – 3:00 PM</p>
                <p>Friday: 9:00 AM – 12:00 PM</p>
                <p>Saturday & Sunday: Closed</p>
              </div>
            </div>
            <div className="bg-white border border-blue-100 rounded-xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-[#1e3a6e] mb-4">Quick Links</h3>
              <div className="space-y-3">
                <Link to="/mass"             className="block text-[#1e3a6e] hover:underline transition">Mass Times</Link>
                <Link to="/faith-formation"  className="block text-[#1e3a6e] hover:underline transition">Faith Formation</Link>
                <Link to="/ministries"       className="block text-[#1e3a6e] hover:underline transition">Ministries</Link>
                <Link to="/give"             className="block text-[#1e3a6e] hover:underline transition">Give</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

// Keep the FAQ accordion available for future use — not currently rendered
// but exported so nothing breaks if imported elsewhere
export function FaqAccordion() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const faqs = [
    { q: 'Do I have to be Catholic to attend Mass?', a: "Not at all. Mass is open to everyone — curious seekers, longtime Catholics, people who are \"spiritual but complicated,\" and anyone a parishioner dragged along who wasn't sure they wanted to come. You're welcome here exactly as you are." },
  ];
  return (
    <div className="space-y-2">
      {faqs.map((faq, idx) => (
        <div key={idx} className="border-b border-blue-100">
          <button onClick={() => setExpanded(expanded === idx ? null : idx)} className="w-full text-left py-4 flex items-center justify-between gap-4 hover:bg-blue-50 px-2 rounded transition">
            <span className="font-semibold text-base text-[#1e3a6e]">{faq.q}</span>
            <ChevronDown size={16} className={`text-gray-400 flex-shrink-0 transition-transform ${expanded === idx ? 'rotate-180' : ''}`} />
          </button>
          {expanded === idx && <div className="pb-4 px-2"><p className="text-base text-gray-700 leading-relaxed">{faq.a}</p></div>}
        </div>
      ))}
    </div>
  );
}
