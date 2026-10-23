import { Link } from 'react-router-dom';
import { usePageData } from '../lib/usePageData';
import { getStaffByEmail } from '../lib/staffData';

export default function MusicMinistryPage() {
  const { content, contacts, photos } = usePageData('music-ministry');
  const staffJoe = getStaffByEmail('ccmusic322@gmail.com');

  const hero = content['hero'];
  const quote = content['quote'];
  const joinChoir = content['join-choir'];
  const choirSat = content['choir-sat5pm'];
  const choirSun8 = content['choir-sun8am'];
  const choirSun10 = content['choir-sun1030am'];
  const choirCantor = content['choir-cantor'];
  const contact = contacts[0];

  const heroPhoto = photos.find(p => p.is_featured);
  const fullWidthPhoto = photos.find(p => p.caption?.includes('Sunday Mass'));

  const choirCards = [
    { section: choirSat, fallback: { mass: 'Saturday 5pm', what: 'A smaller, intimate choir. Rehearsal at 4pm, right before Mass.', ability: 'Basic singing ability', img: '/Choir_-_vertical_c.jpg' } },
    { section: choirSun8, fallback: { mass: 'Sunday 8am', what: 'Cantors and seasoned singers. Rehearsal Tuesday evenings 7-8:30pm.', ability: 'More seasoned singers or current ministry members', img: '/Choir_1.jpg' } },
    { section: choirSun10, fallback: { mass: 'Sunday 10:30am', what: 'Our largest choir — live streamed. Rehearsal Tuesday evenings 7-8:30pm.', ability: 'Carry a tune. We\'ll help with the rest.', img: '/CU_violinist_c.jpg' } },
    { section: choirCantor, fallback: { mass: 'Cantor', what: 'Lead the music at any of our Masses. Schedule flexible.', ability: 'Confident musical leadership — supported through our ministry.', img: '', video: 'https://player.vimeo.com/video/1191367148?badge=0&autopause=0&player_id=0&app_id=58479' } },
  ];

  return (
    <div className="min-h-screen bg-sky-50">

      <section className="py-16 md:py-20 px-6 bg-sky-50 border-b border-blue-100">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-5 gap-12 items-center">
            <div className="md:col-span-3">
              <p className="text-sm font-semibold text-blue-400 uppercase tracking-widest mb-4">
                Where Music Becomes Prayer
              </p>
              <h1 className="text-4xl md:text-5xl font-bold font-serif text-[#1e3a6e] mb-5 leading-tight">
                {hero?.title || 'Music at Corpus Christi Doesn\'t Just Fill the Space. It Awakens Something in You.'}
              </h1>
              <p className="text-xl italic font-serif text-[#1e3a6e]/70 mb-5">
                {hero?.subtitle || 'Come share our joyful sacred moments with us.'}
              </p>
              <p className="text-base text-[#1e3a6e]/80 leading-relaxed mb-8 whitespace-pre-line">
                {hero?.body_text || 'Our Sunday liturgy is alive, with a distinct experience of music and prayer joining beautifully.\n\nWe\'re blessed to have Joseph Hebert — a gifted artist and dedicated music director who has led our music ministry since 2011.\n\nOur choir doesn\'t just inspire us on Sundays — they\'ve shared their music around the world.\n\nCome hear the spirit of Corpus! And if you sing or play — keep reading.'}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to={hero?.link_url || '/mass'}
                  className="px-5 py-2.5 bg-[#1e3a6e] text-white rounded-lg text-base font-semibold hover:bg-[#162d57] transition"
                >
                  {hero?.link_label || 'Join Us This Sunday'}
                </Link>
                <a
                  href="#choir"
                  className="px-5 py-2.5 border border-[#1e3a6e] text-[#1e3a6e] rounded-lg text-base font-semibold hover:bg-blue-50 transition"
                >
                  Join the Choir
                </a>
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="aspect-[3/4] rounded-xl overflow-hidden border border-blue-200 bg-blue-100">
                <img src={heroPhoto?.image_url || hero?.image_url || '/Choir_1.jpg'} alt={heroPhoto?.caption || 'Corpus Christi Choir'} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 px-6 bg-sky-50 border-b border-blue-100">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm font-semibold text-blue-400 uppercase tracking-widest mb-3">Our Choir in Action</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-[#1e3a6e] mb-8">
            Hear Our Choir in Action.
          </h2>
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{ boxShadow: '0 0 60px 20px rgba(30, 58, 110, 0.45), 0 0 120px 40px rgba(30, 58, 110, 0.2)' }}
          >
            <div className="aspect-video w-full">
              <iframe
                src="https://player.vimeo.com/video/1178991692?badge=0&autopause=0&player_id=0&app_id=58479"
                style={{ width: '100%', height: '100%' }}
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
                title="Corpus Christi Choir at Mass"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 px-6 bg-[#1e3a6e] text-white">
        <div className="max-w-3xl mx-auto text-center">
          <blockquote className="text-3xl md:text-4xl font-light italic mb-4 leading-relaxed">
            {quote?.title || '"When we trust our voices to say yes to God, miracles happen."'}
          </blockquote>
          <p className="text-base text-blue-300 tracking-wide">{quote?.subtitle || '— Joe Hebert'}</p>
        </div>
      </section>

      <section className="w-full h-80 bg-blue-950 border-y border-[#1e3a6e] flex items-center justify-center overflow-hidden">
        <img
          src={fullWidthPhoto?.image_url || '/CU_Choir.jpg'}
          alt={fullWidthPhoto?.caption || 'Corpus Christi choir at Sunday Mass'}
          className="w-full h-full object-cover"
        />
      </section>

      <section id="choir" className="py-14 md:py-20 px-6 bg-white border-b border-blue-100">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm font-semibold text-blue-400 uppercase tracking-widest mb-3">Join the Choir</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-[#1e3a6e] mb-5">
            {joinChoir?.title || 'There\'s a Place for Every Voice.'}
          </h2>
          <p className="text-base text-[#1e3a6e]/80 leading-relaxed mb-10 max-w-3xl">
            {joinChoir?.body_text || 'Our choirs are one of the most beautiful expressions of who we are — a community where everyone truly belongs. You don\'t need choir experience, just carry a melody and be curious how rewarding singing in a choir can be under Joe\'s leadership. Choir here is come as you are — the Holy Spirit will guide the rest.'}
          </p>

          <div className="grid md:grid-cols-2 gap-5 mb-10">
            {choirCards.map((card) => {
              const s = card.section;
              const f = card.fallback;
              const mass = s?.title || f.mass;
              const what = s?.subtitle || f.what;
              const ability = s?.body_text || f.ability;
              const img = s?.image_url || f.img;
              const video = s?.link_url?.includes('vimeo') ? s.link_url : f.video;
              return (
                <div key={mass} className="border border-blue-100 rounded-xl overflow-hidden bg-sky-50">
                  <div className="aspect-video bg-blue-100 border-b border-blue-100 overflow-hidden">
                    {video ? (
                      <iframe
                        src={video}
                        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                        style={{ width: '100%', height: '100%' }}
                        title={mass}
                      />
                    ) : img ? (
                      <img src={img} alt={mass} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-blue-400">
                        <div className="text-center text-sm">{mass}</div>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-[#1e3a6e] mb-4">{mass}</h3>
                    <div className="space-y-3 text-base">
                      <div className="flex gap-3">
                        <span className="font-semibold text-[#1e3a6e] min-w-[60px] flex-shrink-0">What:</span>
                        <span className="text-[#1e3a6e]/80 leading-relaxed">{what}</span>
                      </div>
                      <div className="flex gap-3">
                        <span className="font-semibold text-[#1e3a6e] min-w-[60px] flex-shrink-0">Ability:</span>
                        <span className="text-[#1e3a6e]/80 leading-relaxed">{ability}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-3">
            <a
              href={`mailto:${contact?.email || 'ccmusic322@gmail.com'}`}
              className="inline-block px-6 py-3 bg-[#1e3a6e] text-white rounded-lg text-base font-semibold hover:bg-[#162d57] transition text-center"
            >
              Contact {contact?.name || 'Joe'} to Join →
            </a>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 px-6 bg-sky-50 border-b border-blue-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-semibold text-slate-900 mb-8">Meet {contact?.name?.split(' ')[0] || 'Joe'}.</h2>
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-1">
              <img
                src={contact?.image_url || staffJoe?.photo || '/joe.png'}
                alt={contact?.name || 'Joe Hebert'}
                className="aspect-[3/4] w-full object-cover rounded-xl mb-4"
              />
              <h3 className="text-lg font-bold text-slate-900">{contact?.name || staffJoe?.name || 'Joe Hebert'}</h3>
              <p className="text-sm text-slate-500 mt-1 mb-2">{contact?.role || staffJoe?.role || 'Music Director'} — since 2011</p>
              <a
                href={`mailto:${contact?.email || staffJoe?.email || 'ccmusic322@gmail.com'}`}
                className="text-sm text-blue-700 border-b border-blue-200 hover:border-blue-700 transition"
              >
                Contact {contact?.name || 'Joe Hebert'}
              </a>
              <br />
              <a
                href="https://www.josephhebert.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#1e3a6e] border-b border-[#1e3a6e] hover:text-[#1e3a6e]/70 transition mt-2 inline-block"
              >
                josephhebert.com
              </a>
            </div>
            <div className="md:col-span-4 space-y-4">
              <div className="bg-teal-700 text-white rounded-xl p-8 shadow-md">
                <p className="text-sm font-bold tracking-widest uppercase text-teal-200 mb-3">The most inspiring part of his ministry</p>
                <p className="text-lg font-semibold leading-relaxed">
                  "{staffJoe?.bio?.inspiring || "I'm deeply moved by the courage it takes to sing through fear. When we trust our voices and say yes to the moment, we make room for God to work miracles, big and small."}"
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-emerald-700 rounded-xl p-6 flex flex-col justify-center shadow-md">
                  <p className="text-sm font-bold tracking-widest uppercase text-emerald-200 mb-2">Prayer life in three words</p>
                  <p className="text-2xl font-bold text-white leading-snug mt-2">
                    {(staffJoe?.bio?.prayer || 'Vulnerability, Gratitude, Trust.').split(',').map((w, i) => <span key={i}>{w.trim()}{i < 2 ? '.' : ''}<br /></span>)}
                  </p>
                </div>
                <div className="md:col-span-2 border border-amber-500 rounded-xl p-6 bg-amber-600 shadow-md">
                  <p className="text-sm font-bold tracking-widest uppercase text-amber-200 mb-2">Saint he'd have to lunch</p>
                  <p className="text-base text-amber-50 leading-relaxed">
                    "{staffJoe?.bio?.saint || "Mother Teresa of Calcutta. I'd ask her how we move beyond our fears to trust in the love and mercy of God."}"
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-rose-600 rounded-xl p-6 bg-rose-700 shadow-md">
                  <p className="text-sm font-bold tracking-widest uppercase text-rose-200 mb-2">Song that feels like God</p>
                  <p className="text-base text-rose-50 leading-relaxed">
                    "{staffJoe?.bio?.song || "Challenging question for a songwriter and musician. I'll start with the classical piece Nimrod by Edward Elgar."}"
                  </p>
                </div>
                <div className="border border-slate-600 rounded-xl p-6 bg-slate-700 shadow-md">
                  <p className="text-sm font-bold tracking-widest uppercase text-slate-300 mb-2">After Mass ritual</p>
                  <p className="text-base text-slate-100 leading-relaxed">
                    {staffJoe?.bio?.ritual || 'Starbucks — a comfortable atmosphere where I can count on parishioners coming through for a quick hello or cup of coffee.'}
                  </p>
                </div>
              </div>
              <div className="bg-[#1e3a6e] border border-sky-600 rounded-xl p-8 shadow-md">
                <p className="text-sm font-bold tracking-widest uppercase text-blue-400 mb-2">Street Cred</p>
                <p className="text-base text-blue-100 leading-relaxed">
                  {staffJoe?.bio?.credentials || contact?.bio || 'Classically trained musician. Symphony, orchestral conducting, choral directing, studio recordings, and performance tours throughout the US and beyond.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
