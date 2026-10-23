import { useState } from 'react';
import { ChevronDown, Cross } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePageData } from '../lib/usePageData';

export default function NewVisitorsPage() {
  const { content } = usePageData('new-visitors');
  const hero = content['hero'];
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<number | null>(0);

  const pathways = [
    {
      title: 'Already Catholic?',
      note: 'Ready to make Corpus Christi home? Welcome.',
      link: '/registration',
      isExternal: true,
      bg: 'bg-purple-700',
    },
    {
      title: 'Become Catholic (Adults)',
      note: "No pressure. We'll walk with you every step.",
      link: '/ocia',
      isExternal: false,
      bg: 'bg-amber-600',
    },
    {
      title: 'Complete Your Sacraments (Adults)',
      note: "First Communion, Confirmation, Reconciliation — we've got you.",
      link: '/ocia',
      isExternal: false,
      bg: 'bg-sky-600',
    },
    {
      title: 'First Communion for My Child',
      note: 'Help your child take this beautiful next step.',
      link: '/family-faith-formation',
      isExternal: false,
      bg: 'bg-teal-600',
    },
    {
      title: 'Confirmation for My Teen',
      note: 'Meaningful preparation for a milestone that matters.',
      link: '/confirmation',
      isExternal: false,
      bg: 'bg-red-700',
    },
  ];

  const differences = [
    {
      title: 'Our Pastor, Fr. Leo.',
      description: "His homilies are rooted in the Gospel and grounded in real life — honest, interactive, and occasionally hilarious. You'll walk out inspired to be a little more loving than when you walked in. People tune in from around the country. There's a reason.",
      link: 'Watch welcome video →',
      href: '#video',
      image: '/fr-leo-welcome.png',
    },
    {
      title: 'Mass That Moves You.',
      description: "Prayerful, intentional, and alive — with professional vocalists, musicians, and lectors who bring the liturgy to life. Rarely exceeds an hour, but you'll leave wanting more.",
      link: 'View Mass schedule →',
      href: '#mass',
      image: '/CU_Choir.jpg',
    },
    {
      title: 'Meaningful Faith Formation.',
      description: "For children, teens, new Catholics, returning Catholics, and anyone still working out what they believe. Formation isn't about memorizing answers — it's about developing a real relationship with a loving God that changes who you are.",
      link: 'Learn more →',
      href: '/faith-formation',
      image: '/_JoyGroupShot.jpg',
    },
    {
      title: 'An Exceptional School.',
      description: "Corpus Christi's K–8 school educates the whole person — academic excellence inside a community that nurtures intellect, character, and belonging.",
      link: 'Visit school site →',
      href: '#school',
      image: '/2024-08-28.webp',
    },
    {
      title: 'A Community You Help Create.',
      description: "This parish has been shaped for nearly 100 years by the people who show up. Your presence matters. Your gifts matter. Come belong. Come contribute.",
      link: 'See our ministries →',
      href: '#ministries',
      image: '/Who_We_Are.jpg',
    },
  ];

  const faqs = [
    {
      q: 'Do I have to be Catholic to attend Mass?',
      a: 'Not at all. Mass is open to everyone — curious seekers, longtime Catholics, people who are "spiritual but complicated," and anyone a parishioner dragged along who wasn\'t sure they wanted to come. You\'re welcome here exactly as you are.'
    },
    {
      q: 'I haven\'t been to church in years (or ever). Can I just... show up?',
      a: "Yes. Whether it's been five years or fifty, whether you left frustrated, hurt, or just drifted — the door is open. We're genuinely glad you're back, and look forward to welcoming you."
    },
    {
      q: 'What should I wear, and what do I do when I don\'t know what to do?',
      a: "Wear whatever you'd wear to something that matters to you. We've got everything from jeans to Sunday best, and both are fine. As for the sit-stand-kneel choreography — just follow the people around you, and don't worry if you're half a beat behind. We promise no one will even notice."
    },
    {
      q: 'How do I register as a parishioner?',
      a: 'Registering makes you officially part of the family — and it helps us connect you to the right people and programs. Plus, you\'ll receive a free registration basket, packed with goodies. Either way, you\'ll hear from us within 48 hours.',
      hasLink: true
    },
    {
      q: 'How do I become Catholic — or just learn more without committing to anything?',
      a: `OCIA (Order of Christian Initiation of Adults) is a no-pressure process for anyone who is:

• Exploring the Catholic faith for the first time and considering becoming Catholic
• Baptized in another faith and drawn to Catholicism
• Baptized Catholic but never received First Communion or Confirmation
• A lifelong Catholic ready to deepen and reinvigorate their faith

It's an ancient process — rooted in the earliest days of Christianity — and at its heart, a journey of discernment and transformation.

We don't just provide lectures on Church doctrine — we explore together. We tackle the big questions: Who is God? Why am I here? How do I actually feel God's presence in everyday life? And we talk openly about your questions and doubts. We bring in renowned scholars and theologians. We pray in ways that might surprise you. We go on retreat. We laugh a lot.

And we'll teach you how to pray — how to develop a real, personal relationship with God that's genuinely your own. OCIA Alums say it becomes the most transformational part of the journey. Groups become lifelong friends who liked each other so much they formed their own monthly prayer gatherings after OCIA ended. We didn't ask them to. They just didn't want to stop.

If at any point the journey doesn't feel right for you, you can stop — no explanation needed, no judgment, only love and support. We trust the Holy Spirit to do the rest.

Something — or Someone — brought you here. We're glad you listened.`,
      contact: 'Anne Kallin Zehren'
    },
    {
      q: 'How do I arrange a baptism, wedding, or funeral here?',
      a: "We'd be honored to walk with you through the big moments. Reach out early — baptisms, weddings, and funerals each have their own timeline and prep process, and we want to make sure we get it right with you.",
      contact: 'Front Office'
    },
    {
      q: 'My life doesn\'t fit neatly into a Catholic box. Does that matter here?',
      a: 'Life is full and complicated, and so are the people who make up this community. Whatever your story — divorce, remarriage, estrangement from the Church, or just a faith that\'s still taking shape — you belong here. Come as you are.'
    },
    {
      q: 'Are LGBTQ+ people welcome here?',
      a: 'All are welcome here. Corpus Christi is a community built on love and the belief that everyone belongs in our family.'
    },
    {
      q: 'I\'m divorced. Can I still receive Communion?',
      a: "Yes — in most cases, absolutely. This is one of the most misunderstood situations in the whole of Catholic life, and we want to be clear: divorce alone does not prevent you from receiving Communion. Many divorced Catholics have stayed away from the Church believing otherwise, and it breaks our hearts. The question becomes more nuanced if you've remarried outside the Church — but even then, the answer isn't simply \"no.\" It's a conversation worth having, and Fr. Leo would be honored to have it with you."
    },
    {
      q: 'What about sacraments for my kids — First Eucharist, Confirmation, Reconciliation?',
      a: "These milestones matter, and we want them to feel that way — not like boxes to check, but like moments your family will actually remember. We also offer a Liturgy of the Word for children ages 2–8 during Mass: kids slip out with their own ministers, hear the same Gospel in their own language, and have a genuinely fun time doing it. They're back before you miss them.",
      contactLinks: [
        { name: 'Rebeccah Pelle', href: '/staff?member=rebeccah' },
        { name: 'Adrian Mison Fulay', href: '/staff?member=adrian' },
      ]
    },
    {
      q: 'Is there coffee after Mass?',
      a: 'Our hospitality team rocks! Get your caffeine jolt with some donuts after the 10:30 Mass and stay for the yummy monthly potlucks after the 5:00 Mass.'
    },
    {
      q: 'Can I bring my kids even if they\'re... a lot?',
      a: "Please do. Children belong in church — wiggles, snacks, sound effects, and all. If things get truly volcanic, there's space in the back, and parents are always welcome to step out and step back in. You will not be judged, and instead, will probably receive some smiles because most parents have been there!"
    },
    {
      q: 'I\'m going through a rough patch and need someone to talk to. Who can I reach out to?',
      a: "You don't have to be in crisis to need accompaniment — and you don't have to be a registered parishioner. Whether you're looking for pastoral care, grief support, spiritual direction, or just someone to sit with you in a hard season, we're here.",
      hasLink: true,
      contact: 'Fr. Leo, Helen Merckle, Anne Kallin Zehren'
    }
  ];

  const teamMembers = [
    { name: 'Fr. Leo', title: 'Pastor', link: 'Watch welcome video →', href: '/staff?member=leo', photo: '/Leo_headshot.png' },
    { name: 'Anne Kallin Zehren', title: 'Director, OCIA Ministry', link: 'Contact Anne Kallin Zehren', href: '/staff?member=anne', photo: '/Screenshot_2026-05-12_114024.png' },
    { name: 'Parish Office', title: 'General Inquiries', link: 'office@cc-parish.org', href: '/contact', photo: '/church.jpg' },
    { name: 'Paul Loh', title: 'Welcome Leader', link: 'Contact Paul Loh', href: 'mailto:paul@lohrealty.com', photo: '/Paul_Loh.jpg' },
    { name: 'Carol Heard', title: 'Hospitality', link: 'Contact via office', href: '/contact', photo: '/MeetTeam-Carol.jpeg' },
    { name: 'Bob Greene', title: 'Ushers Team', link: 'Contact via office', href: '/contact', photo: '/MeetTeamRobert.jpg' }
  ];

  return (
    <div className="bg-white">
      <section className="py-16 md:py-20 px-6 bg-blue-50 border-b border-blue-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-[2fr_1fr] gap-12 items-start">
            <div>
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <h1 className="text-4xl md:text-5xl font-bold font-serif text-[#1e3a6e]">
                  {hero?.title || 'God loves you — and so do we.'}
                </h1>
                <div className="flex items-center gap-3">
                  <img src="/welcome-basket-sm.jpg" alt="Welcome Basket" className="w-10 h-10 object-cover rounded-lg flex-shrink-0" />
                  <a
                    href="/registration"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2 text-base font-semibold border-2 border-[#1e3a6e] text-[#1e3a6e] rounded-lg hover:bg-blue-100 transition whitespace-nowrap"
                  >
                    Register for your free Welcome Basket →
                  </a>
                </div>
              </div>
              <div className="text-xl text-gray-700 leading-relaxed space-y-4">
                <p>Welcome. We're genuinely glad you're here.</p>
                <p>
                  Whatever brought you to this page — curiosity, a friend's invitation, a quiet nudge you can't quite explain — you're in the right place. Corpus Christi is a community where everyone belongs. Not as a slogan. As a practice.
                </p>
                <p>
                  For nearly 100 years, people have been finding their way through our doors and discovering something they didn't expect: real community. The kind where someone remembers your name, Fr. Leo's homily sends you back into the world a little more loving than when you walked in, and Sunday morning becomes something you look forward to instead of something you endure.
                </p>
                <p className="font-semibold text-[#1e3a6e]">You belong here. Come see what we mean.</p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="aspect-[9/16] max-h-[400px] w-full rounded-xl overflow-hidden shadow-md">
                <iframe
                  src="https://player.vimeo.com/video/1179347938?badge=0&autopause=0&player_id=0&app_id=58479"
                  className="w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                  title="Fr. Leo welcome video"
                />
              </div>
            </div>
          </div>
          <div className="mt-12 bg-white border-l-4 border-[#1e3a6e] rounded-r-xl p-8">
            <p className="text-2xl md:text-3xl font-semibold text-[#1e3a6e] leading-relaxed">
              We believe God is love. Not as something we say on Sundays and forget by Monday — as something we actually try to live.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 px-6 bg-blue-50 border-b border-blue-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a6e]">What makes Corpus Christi... Corpus Christi?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {differences.map((diff, idx) => (
              <a
                key={idx}
                href={diff.href}
                className="group relative rounded-2xl overflow-hidden flex flex-col min-h-[220px] shadow-sm hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${diff.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1e3d]/90 via-[#0f1e3d]/50 to-[#0f1e3d]/20 group-hover:from-[#0f1e3d]/95 group-hover:via-[#0f1e3d]/70 group-hover:to-[#0f1e3d]/40 transition-all duration-300" />
                <div className="relative mt-auto p-5">
                  <h3 className="font-bold text-base text-white leading-snug mb-0 group-hover:mb-3 transition-all duration-300">{diff.title}</h3>
                  <div className="overflow-hidden max-h-0 group-hover:max-h-40 transition-all duration-500 ease-in-out">
                    <p className="text-sm text-white/80 leading-relaxed mb-2">{diff.description}</p>
                    <span className="text-sm text-white/60 border-b border-white/40">{diff.link}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 px-6 bg-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a6e]">Who We Are</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-blue-100 border border-blue-200">
              <img src="/Who_We_Are.jpg" alt="Corpus Christi congregation" className="w-full h-full object-cover" />
            </div>
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <p>We believe God is love. Not as something we say on Sundays and forget by Monday — as something we actually try to live. It's the source of everything we do here: how we worship, how we teach, how we welcome, and how we show up for each other.</p>
              <p>Married, single, divorced, partnered, parenting solo, empty-nesting. Confident in your faith or still working out what you believe. Returning after years away — whether you drifted, or left hurt, or just got busy with life. Exploring Catholicism for the first time.</p>
              <p className="text-2xl font-bold text-[#1e3a6e]">Who belongs here? Everyone. Really. No asterisks.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 px-6 bg-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a6e]">
              Not sure where to start? We've got you.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {pathways.map((pathway, idx) =>
              pathway.isExternal ? (
                <a
                  key={idx}
                  href={pathway.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex flex-col items-center justify-center text-center rounded-2xl px-6 py-10 transition-all duration-200 ${pathway.bg} shadow-md hover:shadow-xl hover:-translate-y-1`}
                >
                  <span className="text-white font-bold text-base md:text-lg leading-snug tracking-wide uppercase mb-3">{pathway.title}</span>
                  <span className="text-white/75 text-sm leading-relaxed">{pathway.note}</span>
                </a>
              ) : (
                <Link
                  key={idx}
                  to={pathway.link}
                  className={`group flex flex-col items-center justify-center text-center rounded-2xl px-6 py-10 transition-all duration-200 ${pathway.bg} shadow-md hover:shadow-xl hover:-translate-y-1`}
                >
                  <span className="text-white font-bold text-base md:text-lg leading-snug tracking-wide uppercase mb-3">{pathway.title}</span>
                  <span className="text-white/75 text-sm leading-relaxed">{pathway.note}</span>
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 px-6 bg-blue-50 border-b border-blue-100">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a6e]">Got Questions? Good. We Love Them.</h2>
          </div>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            Seriously — questions are welcome here. Always have been. Here are the ones we hear most often, answered honestly.
          </p>
          <div className="space-y-4">
            {[
              { title: 'Just Visiting', subtitle: 'I might come Sunday', questionIndices: [0, 1, 2, 10] },
              { title: 'Becoming Part of the Parish', subtitle: 'I want to take a step', questionIndices: [3, 4, 5] },
              { title: 'Belonging Here', subtitle: 'Will I be welcome?', questionIndices: [6, 7, 8] },
              { title: 'Family & Support', subtitle: "I'm not just here for me", questionIndices: [9, 11, 12] },
            ].map((category, catIdx) => {
              const palette = [
                { card: 'bg-sky-50 border-sky-200', hover: 'hover:bg-sky-100', num: 'text-sky-600', divider: 'border-sky-100', innerHover: 'hover:bg-sky-50' },
                { card: 'bg-emerald-50 border-emerald-200', hover: 'hover:bg-emerald-100', num: 'text-emerald-600', divider: 'border-emerald-100', innerHover: 'hover:bg-emerald-50' },
                { card: 'bg-amber-50 border-amber-200', hover: 'hover:bg-amber-100', num: 'text-amber-600', divider: 'border-amber-100', innerHover: 'hover:bg-amber-50' },
                { card: 'bg-rose-50 border-rose-200', hover: 'hover:bg-rose-100', num: 'text-rose-600', divider: 'border-rose-100', innerHover: 'hover:bg-rose-50' },
              ][catIdx];
              return (
              <div key={catIdx} className={`border rounded-xl overflow-hidden ${palette.card}`}>
                <button
                  onClick={() => setExpandedCategory(expandedCategory === catIdx ? null : catIdx)}
                  className={`w-full text-left px-6 py-5 flex items-center justify-between gap-4 ${palette.hover} transition`}
                >
                  <div className="flex items-baseline gap-4">
                    <span className={`text-2xl font-bold ${palette.num}`}>{catIdx + 1}</span>
                    <div>
                      <div className="font-bold text-lg text-[#1e3a6e]">{category.title}</div>
                      <div className="text-sm text-gray-500 italic">{category.subtitle}</div>
                    </div>
                  </div>
                  <ChevronDown size={20} className={`text-gray-400 flex-shrink-0 transition-transform ${expandedCategory === catIdx ? 'rotate-180' : ''}`} />
                </button>
                {expandedCategory === catIdx && (
                  <div className={`border-t ${palette.divider} px-6 py-2`}>
                    {category.questionIndices.map((idx, qPos) => {
                      const faq = faqs[idx];
                      const key = `${catIdx}-${idx}`;
                      return (
                        <div key={idx} className={`border-b ${palette.divider} last:border-b-0`}>
                          <button
                            onClick={() => setExpandedFaq(expandedFaq === key ? null : key)}
                            className={`w-full text-left py-4 flex items-center justify-between gap-4 ${palette.innerHover} transition`}
                          >
                            <span className="font-semibold text-base text-[#1e3a6e]">{qPos + 1}. {faq.q}</span>
                            <ChevronDown size={16} className={`text-gray-400 flex-shrink-0 transition-transform ${expandedFaq === key ? 'rotate-180' : ''}`} />
                          </button>
                          {expandedFaq === key && (
                            <div className="pb-4">
                              <p className="text-base text-gray-700 leading-relaxed whitespace-pre-line">{faq.a}</p>
                              {faq.contact && <p className="text-sm text-gray-500 mt-3 italic">Contact: {faq.contact}</p>}
                              {faq.contactLinks && (
                                <p className="text-sm text-gray-500 mt-3 italic">
                                  Contact:{' '}
                                  {faq.contactLinks.map((cl, i) => (
                                    <span key={cl.href}>
                                      {i > 0 && ' & '}
                                      <Link to={cl.href} className="text-[#1e3a6e] border-b border-[#1e3a6e]/40 hover:border-[#1e3a6e] transition">{cl.name}</Link>
                                    </span>
                                  ))}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );})}
          </div>
        </div>
      </section>

      <section id="register" className="py-16 md:py-20 px-6 bg-white border-b border-blue-100">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a6e]">Ready to make it official?</h2>
          </div>
          <p className="text-lg text-gray-700 mb-8">
            Thirty seconds. Your name and contact info — that's it. Someone from our welcome team will be in touch within 48 hours. And yes, there's a basket involved.
          </p>
          <div className="border border-blue-200 rounded-xl p-6 bg-blue-50 flex flex-wrap items-center gap-6">
            <img src="/welcome-basket-sm.jpg" alt="Welcome Basket" className="w-24 h-24 object-cover rounded-xl flex-shrink-0" />
            <div className="flex-1 min-w-[200px]">
              <p className="font-bold text-xl text-[#1e3a6e] mb-1">Register for your free Welcome Basket</p>
            </div>
            <a href="/registration" target="_blank" rel="noopener noreferrer"
              className="px-5 py-2 text-base font-semibold border-2 border-[#1e3a6e] text-[#1e3a6e] rounded-lg bg-white hover:bg-blue-50 transition whitespace-nowrap">
              Join →
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 px-6 bg-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a6e]">Meet Your Welcome Team.</h2>
          </div>
          <p className="text-lg text-gray-700 mb-8">
            These are the people you'll hear from first — and the ones who'll make sure you find your place here.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {teamMembers.map((member, idx) => (
              <a key={idx} href={member.href}
                className="border border-blue-200 rounded-xl p-5 bg-white hover:border-[#1e3a6e] transition text-center">
                <div className="w-20 h-24 rounded-lg bg-blue-100 border border-blue-200 mx-auto mb-3 flex items-center justify-center overflow-hidden">
                  {member.photo === 'cross' ? (
                    <Cross className="w-8 h-8 text-blue-300" />
                  ) : member.photo ? (
                    <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm text-gray-400">Photo</span>
                  )}
                </div>
                <p className="font-semibold text-base text-[#1e3a6e] mb-1">{member.name}</p>
                <p className="text-sm text-gray-600 mb-2 leading-tight">{member.title}</p>
                <p className="text-sm text-[#1e3a6e] border-b border-[#1e3a6e] inline-block">{member.link}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
