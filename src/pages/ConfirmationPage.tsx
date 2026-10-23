import { Mail, Play, X } from 'lucide-react';
import { useState } from 'react';
import { usePageData } from '../lib/usePageData';
import { getStaffByEmail } from '../lib/staffData';

export default function ConfirmationPage() {
  const [videoOpen, setVideoOpen] = useState(false);
  const { content, contacts, photos } = usePageData('confirmation');
  const staffAdrian = getStaffByEmail('confirmation@cc-parish.org');

  const hero = content['hero'];
  const quote = content['quote'];
  const whatIs = content['what-is'];
  const commitment = content['commitment'];
  const contact = contacts[0];
  const heroPhoto = photos.find(p => p.is_featured);
  const cardPhotos = photos.filter(p => !p.is_featured && p.caption !== 'Adrian Mison Fulay');
  const contactPhoto = photos.find(p => p.caption?.includes('Adrian'));

  return (
    <div className="min-h-screen bg-sky-50">
      <section className="max-w-7xl mx-auto px-6 py-16 lg:py-20">
        <div className="grid lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-3">
            <p className="text-sm font-semibold tracking-wider uppercase text-sky-500 mb-3">
              Confirmation & Youth Ministry
            </p>
            <h1 className="text-5xl lg:text-6xl font-bold font-serif leading-tight mb-3 text-slate-900">
              {hero?.title || '77% of Teens Want to Know More About Jesus.'}
            </h1>
            <h2 className="text-3xl lg:text-4xl font-normal font-serif text-slate-600 leading-snug mb-3">
              {hero?.subtitle || 'Confirmation Gives Them a Safe Place to Explore.'}
            </h2>
            <p className="text-sm italic text-orange-600 mb-6">
              Source: Barna Research, The Open Generation
            </p>
            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4 mb-6">
              {(hero?.body_text || 'That number might surprise you — and it makes our job as parents a little easier, as long as we meet them where they are.\n\nConfirmation is a deeply personal sacrament — and one of the most beautiful ways a young person can say yes to a relationship with Jesus. Through it, your teen receives the gifts and fruits of the Holy Spirit: wisdom, understanding, courage, patience, kindness, goodness, and peace, to name a few.\n\nThese are the very values every parent hopes their child carries into adulthood. And they\'re exactly what young people tell us they\'re craving — they just may not know how to encounter Jesus.\n\nWe help your teen become the person God created them to be: rooted in faith, character, and the grace of the Holy Spirit.').split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="https://docs.google.com/forms/d/e/1FAIpQLSeO-DCPjETLZ8eMAC7Pfe1r9qO_V8_lvUsWQqyvlx2wKdqVvg/viewform" target="_blank" rel="noopener noreferrer" className="bg-blue-700 text-white px-6 py-3 rounded-lg text-base font-medium hover:bg-blue-800 transition-colors shadow-md hover:shadow-lg">
                Register Now
              </a>
              <a
                href={`mailto:${contact?.email || 'confirmation@cc-parish.org'}`}
                className="border border-blue-300 text-blue-800 px-6 py-3 rounded-lg text-base font-medium hover:bg-blue-50 hover:border-blue-500 transition"
              >
                Contact {contact?.name?.split(' ')[0] || 'Adrian'}
              </a>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="aspect-[3/4] rounded-xl overflow-hidden">
              <img src={heroPhoto?.image_url || '/Group_Confirmation.jpg'} alt={heroPhoto?.caption || 'Confirmation group photo'} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-8">
        <div className="border-l-4 border-blue-600 bg-blue-100 rounded-r-xl pl-8 pr-6 py-6">
          <p className="text-2xl lg:text-3xl font-semibold leading-snug mb-3 text-slate-900">
            {quote?.title || '"When a young person tries to truly understand their faith in today\'s world, I see God\'s grace at work."'}
          </p>
          <p className="text-base italic text-slate-600">{quote?.subtitle || '— Adrian Mison Fulay, Confirmation Director'}</p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-12 border-b border-sky-100">
        <h2 className="text-3xl font-semibold mb-6 text-slate-900">{whatIs?.title || 'What Is Confirmation?'}</h2>
        <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4">
          {(whatIs?.body_text || 'Confirmation is one of the three Sacraments of Initiation — alongside Baptism and Eucharist. If Baptism offers life, and the Eucharist sustains it, Confirmation strengthens it.\n\nFor teens baptized as infants, Confirmation is their moment to claim the faith their parents chose for them. It is a conscious, personal yes — sealed with the gift of the Holy Spirit. Some call it a tattoo on the heart. It\'s permanent. It changes you.\n\nThrough the laying on of hands and anointing with sacred chrism oil, what began interiorly at Baptism becomes outward and active. Your teen is not just receiving a sacrament. They are being commissioned — to carry faith, courage, kindness, and peace into the world.').split('\n\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-12 border-b border-sky-100">
        <h2 className="text-3xl font-semibold mb-4 text-slate-900">{commitment?.title || 'The Commitment'}</h2>
        <p className="text-slate-600 leading-relaxed mb-6">
          {commitment?.body_text || 'Corpus Christi and St. Theresa Parish have joined together for Confirmation — bringing two communities of teens into one. The program unfolds over two years, each with its own focus and its own director.'}
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-blue-200 rounded-xl p-6 bg-white">
            <p className="text-sm font-semibold tracking-wider uppercase text-sky-500 mb-3">
              Jr High & Year One — Grades 6-9
            </p>
            <p className="text-base text-slate-600 leading-relaxed mb-4">
              Monthly gatherings on the First Saturday and/or Third Saturday, 6-7pm. A year of exploring faith alongside peers. 9th graders need at least 8 sessions to qualify for Year Two with Confirmation Director {contact?.name || 'Adrian Mison Fulay'}.
            </p>
            <a
              href={`mailto:${contact?.email || 'confirmation@cc-parish.org'}`}
              className="text-sm text-blue-700 border-b border-blue-200 hover:border-blue-600 transition inline-flex items-center gap-1"
            >
              Contact {contact?.name || 'Adrian Mison Fulay'}
            </a>
          </div>
          <div className="border border-blue-200 rounded-xl p-6 bg-white">
            <p className="text-sm font-semibold tracking-wider uppercase text-sky-500 mb-3">
              Year Two — Grades 10-12
            </p>
            <p className="text-base text-slate-600 leading-relaxed mb-4">
              Monthly sessions, a retreat, and service in the community — culminating in the Sacrament of Confirmation celebrated by the Bishop in the spring.
            </p>
            <a
              href={`mailto:${contact?.email || 'confirmation@cc-parish.org'}`}
              className="text-sm text-blue-700 border-b border-blue-200 hover:border-blue-600 transition inline-flex items-center gap-1"
            >
              Contact {contact?.name || 'Adrian Mison Fulay'}
            </a>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-12 border-b border-sky-100">
        <h2 className="text-3xl font-semibold mb-6 text-slate-900">What to Expect</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { img: cardPhotos[0]?.image_url || '/Boy_confirmation_c.jpg', alt: cardPhotos[0]?.caption || 'Teen receiving confirmation anointing', title: 'An Accepting Space to Encounter Jesus', body: 'Teens thrive when they can talk to each other — about faith, about life, about what they actually believe. That\'s what this is.' },
            { img: cardPhotos[1]?.image_url || '/Boy_in_suit_confirmation_c.jpg', alt: cardPhotos[1]?.caption || 'Teen with sponsor and priest', title: 'Belong and Believe', body: 'Teens explore what it means to belong to a rich tradition and a community we call Church.' },
            { img: cardPhotos[2]?.image_url || '/Confirmation1_c.jpg', alt: cardPhotos[2]?.caption || 'Confirmation candidates', title: 'Community Service', body: 'Serving others is how faith becomes real. We organize everything — soup kitchens, tutoring younger kids, building homes.' },
            { img: cardPhotos[3]?.image_url || '/Confirmation_c.jpg', alt: cardPhotos[3]?.caption || 'Confirmation ceremony', title: 'Three Parishes. One Community.', body: 'Corpus Christi, Our Lady of Lourdes, and St. Theresa\'s have joined together — more teens, more voices, more community.' },
          ].map(card => (
            <div key={card.title} className="border border-blue-200 rounded-xl overflow-hidden bg-white">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={card.img} alt={card.alt} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <h3 className="text-base font-bold mb-2 text-slate-900">{card.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{card.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-12 border-b border-sky-100">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-8">
          <div className="grid md:grid-cols-2 gap-8 items-start mb-8">
            <div>
              <h2 className="text-4xl font-bold mb-2 text-slate-900">Talking to Teens About God Can Be Hard.</h2>
              <p className="text-2xl font-normal text-slate-600 italic mb-4">
                Sometimes we don't know if we're doing it right.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                Just know that most of us are already doing it right. Research from the National Study of Youth and Religion found that 82% of teens raised by parents who talked about faith at home remained religiously active as young adults.
              </p>
            </div>
            <div className="aspect-[9/8] rounded-xl overflow-hidden shadow-md relative group cursor-pointer" onClick={() => setVideoOpen(true)}>
              <img
                src="https://vumbnail.com/1188506350.jpg"
                alt="Video thumbnail"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-200" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/90 group-hover:bg-white group-hover:scale-110 transition-all duration-200 rounded-full flex items-center justify-center shadow-xl">
                  <Play size={28} className="text-slate-800 ml-1" fill="currentColor" />
                </div>
              </div>
            </div>

            {videoOpen && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                onClick={() => setVideoOpen(false)}
              >
                <div
                  className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl"
                  onClick={e => e.stopPropagation()}
                >
                  <iframe
                    src="https://player.vimeo.com/video/1188506350?autoplay=1&badge=0&autopause=0&player_id=0&app_id=58479"
                    className="w-full h-full"
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                    title="Confirmation video"
                    allowFullScreen
                  />
                  <button
                    onClick={() => setVideoOpen(false)}
                    className="absolute top-3 right-3 w-9 h-9 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="grid md:grid-cols-2 gap-5 mb-6">
            <div className="border border-blue-200 rounded-xl p-5 bg-white">
              <h3 className="text-lg font-bold mb-3 text-slate-900">Let Your Teen Take the Lead.</h3>
              <p className="text-base text-slate-600 leading-relaxed">
                Ask what they think — about God, about faith, about what matters to them. Teens form lasting faith when they feel their perspective is heard, not overridden.
              </p>
            </div>
            <div className="border border-blue-200 rounded-xl p-5 bg-blue-100">
              <h3 className="text-lg font-bold mb-3 text-slate-900">Let them know it's okay not to have it figured out.</h3>
              <p className="text-base text-slate-600 leading-relaxed">
                The single biggest barrier to teen engagement with faith is the fear of being judged for uncertainty. No one here has all the answers — including {contact?.name?.split(' ')[0] || 'Adrian'}.
              </p>
            </div>
            <div className="border border-blue-200 rounded-xl p-5 bg-blue-100">
              <h3 className="text-lg font-bold mb-3 text-slate-900">Make Space. Really Listen.</h3>
              <p className="text-base text-slate-600 leading-relaxed">
                Teens who experience faith as something imposed rather than discovered are far more likely to leave it behind. Our job isn't to drag them here. It's to open the door.
              </p>
            </div>
            <div className="border border-blue-200 rounded-xl p-5 bg-white">
              <h3 className="text-lg font-bold mb-3 text-slate-900">Show up alongside them.</h3>
              <p className="text-base text-slate-600 leading-relaxed">
                Teens whose parents positively engage — even imperfectly — with their faith formation are significantly more likely to maintain an active faith into adulthood.
              </p>
            </div>
          </div>
          <div className="border border-blue-200 rounded-xl p-5 bg-white">
            <h3 className="text-lg font-bold mb-2 text-slate-900">Not sure where to start? Talk to Fr. Leo.</h3>
            <a
              href="mailto:office@cc-parish.org"
              className="text-base text-blue-700 border-b border-blue-200 hover:border-blue-600 transition inline-flex items-center gap-1 mt-3"
            >
              <Mail size={12} />
              Contact Fr. Leo
            </a>
          </div>
        </div>
      </section>

      <section id="stats" className="max-w-5xl mx-auto px-6 py-12 border-b border-sky-100">
        <h2 className="text-3xl font-semibold mb-8 text-slate-900">The Data for Faith-Based Youth Is Undeniable.</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
          <div className="bg-teal-700 text-white rounded-xl p-6 text-center shadow-md">
            <div className="text-5xl font-bold mb-1">16%</div>
            <p className="text-sm text-teal-100 mb-4 leading-relaxed">of faith-active young adults report feeling lonely</p>
            <div className="pt-4 border-t border-white/20">
              <p className="text-sm leading-relaxed mb-2">vs. 31% without faith. Faith cuts loneliness in half.</p>
              <p className="text-[9px] text-teal-300 italic mt-2">Barna / World Vision</p>
            </div>
          </div>
          <div className="bg-sky-700 text-white rounded-xl p-6 text-center shadow-md">
            <div className="text-5xl font-bold mb-1">51%</div>
            <p className="text-sm text-sky-100 mb-4 leading-relaxed">of young adults with an active faith feel optimistic</p>
            <div className="pt-4 border-t border-white/20">
              <p className="text-sm leading-relaxed mb-2">vs. just 34% of those with no faith</p>
              <p className="text-[9px] text-sky-300 italic mt-2">Barna</p>
            </div>
          </div>
          <div className="bg-amber-700 text-white rounded-xl p-6 text-center shadow-md">
            <div className="text-4xl font-bold mb-1 tracking-tight">60%/80%</div>
            <p className="text-sm text-amber-100 mb-4 leading-relaxed">reduction in depression and suicide risk</p>
            <div className="pt-4 border-t border-white/20">
              <p className="text-sm leading-relaxed mb-2">Harvard calls faith "among the most protective factors known"</p>
              <p className="text-[9px] text-amber-300 italic mt-2">Harvard T.H. Chan School of Public Health</p>
            </div>
          </div>
          <div className="bg-blue-800 text-white rounded-xl p-6 text-center shadow-md">
            <div className="text-5xl font-bold mb-1">77%</div>
            <p className="text-sm text-blue-200 mb-4 leading-relaxed">of U.S. teens motivated to keep learning about Jesus</p>
            <div className="pt-4 border-t border-white/20">
              <p className="text-sm leading-relaxed mb-2">Confirmation is where desire becomes commitment.</p>
              <p className="text-[9px] text-blue-300 italic mt-2">Barna, The Open Generation</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-teal-600 to-sky-700 rounded-xl p-7 text-center shadow-md">
          <p className="text-base text-white/90 leading-relaxed mb-2">
            One trusted, faith-filled adult reduces your teen's risk of feeling life lacks meaning by 75%.
          </p>
          <p className="text-sm text-white/60 mb-4">Springtide Research Institute</p>
          <p className="text-2xl font-bold text-white">That's YOU.</p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-12 border-b border-sky-100">
        <h2 className="text-3xl font-semibold mb-8 text-slate-900">Meet {contact?.name?.split(' ')[0] || 'Adrian'}.</h2>
        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-1">
            <img
              src={contactPhoto?.image_url || contact?.image_url || staffAdrian?.photo || '/adrian.png'}
              alt={contact?.name || 'Adrian Mison Fulay'}
              className="aspect-[3/4] w-full object-cover rounded-xl mb-4"
            />
            <h3 className="text-lg font-bold text-slate-900">{contact?.name || staffAdrian?.name || 'Adrian Mison Fulay'}</h3>
            <p className="text-sm text-slate-500 mt-1 mb-2">{contact?.role || staffAdrian?.role || 'Confirmation & Youth Ministry Director'}</p>
            <a
              href={`mailto:${contact?.email || staffAdrian?.email || 'confirmation@cc-parish.org'}`}
              className="text-sm text-blue-700 border-b border-blue-200 hover:border-blue-700 transition"
            >
              Contact {contact?.name?.split(' ')[0] || 'Adrian'}
            </a>
          </div>
          <div className="md:col-span-4 space-y-4">
            <div className="bg-teal-700 text-white rounded-xl p-8 shadow-md">
              <p className="text-sm font-bold tracking-widest uppercase text-teal-200 mb-3">The most inspiring part of his ministry</p>
              <p className="text-lg font-semibold leading-relaxed">
                "{staffAdrian?.bio?.inspiring || "Working with young people who are trying to live their faith and make it their own. When a young person tries to truly understand their faith in today's world, I see God's grace at work."}"
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-emerald-700 rounded-xl p-6 flex flex-col justify-center shadow-md">
                <p className="text-sm font-bold tracking-widest uppercase text-emerald-200 mb-2">Prayer life in three words</p>
                <p className="text-2xl font-bold text-white leading-snug mt-2">
                  {(staffAdrian?.bio?.prayer || 'Wonder, Gratitude, Praise.').split(',').map((w, i) => <span key={i}>{w.trim()}{i < 2 ? '.' : ''}<br /></span>)}
                </p>
              </div>
              <div className="md:col-span-2 border border-amber-500 rounded-xl p-6 bg-amber-600 shadow-md">
                <p className="text-sm font-bold tracking-widest uppercase text-amber-200 mb-2">Saint he'd have to lunch</p>
                <p className="text-base text-amber-50 leading-relaxed">
                  "{staffAdrian?.bio?.saint || "St. John Bosco — patron of young people. I would ask him how he was able to draw out the best in the young people he encountered and give them hope during troubled times."}"
                </p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-rose-600 rounded-xl p-6 bg-rose-700 shadow-md">
                <p className="text-sm font-bold tracking-widest uppercase text-rose-200 mb-2">Song that feels like God</p>
                <p className="text-base text-rose-50 leading-relaxed">
                  "{staffAdrian?.bio?.song || 'These Alone Are Enough by Dan Schutte. It always reminds me to be grateful for all my blessings.'}"
                </p>
              </div>
              <div className="border border-slate-600 rounded-xl p-6 bg-slate-700 shadow-md">
                <p className="text-sm font-bold tracking-widest uppercase text-slate-300 mb-2">After Mass ritual</p>
                <p className="text-base text-slate-100 leading-relaxed">
                  {staffAdrian?.bio?.ritual || 'The Montclair Farmers Market for treats after Mass.'}
                </p>
              </div>
            </div>
            <div className="bg-sky-700 border border-sky-600 rounded-xl p-8 shadow-md">
              <p className="text-sm font-bold tracking-widest uppercase text-sky-200 mb-2">Street Cred</p>
              <p className="text-base text-sky-50 leading-relaxed">
                {staffAdrian?.bio?.credentials || contact?.bio || 'BA in Political Science, Loyola Marymount University. Masters in Theological Studies, Jesuit School of Theology, Berkeley — focusing on Liturgy, Youth, and Inculturation. Catholic school educator for 32 years in Religion and Youth Ministry.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-12 border-b border-sky-100">
        <div className="bg-blue-900 text-white rounded-xl p-8 flex flex-wrap items-center justify-between gap-6 shadow-lg">
          <div>
            <h3 className="text-2xl font-semibold mb-1">Ready to Learn More?</h3>
            <p className="text-base text-blue-200">Registration is open. Come to a first session and see for yourself.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="https://docs.google.com/forms/d/e/1FAIpQLSeO-DCPjETLZ8eMAC7Pfe1r9qO_V8_lvUsWQqyvlx2wKdqVvg/viewform" target="_blank" rel="noopener noreferrer" className="bg-white text-blue-900 px-6 py-3 rounded-lg text-base font-medium hover:bg-blue-50 transition-colors shadow-md hover:shadow-lg">
              Register Now
            </a>
            <a
              href={`mailto:${contact?.email || 'confirmation@cc-parish.org'}`}
              className="border border-white/40 text-white px-6 py-3 rounded-lg text-base font-medium hover:bg-white/10 transition"
            >
              Contact {contact?.name?.split(' ')[0] || 'Adrian'}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
