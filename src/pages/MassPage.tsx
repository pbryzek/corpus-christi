import { usePageData } from '../lib/usePageData';

export default function MassPage() {
  const { content } = usePageData('mass');
  const hero = content['hero'];
  const intro = content['intro'];

  const massTimes = [
    'Saturday Vigil 5:00pm',
    'Sunday 8:00am',
    'Sunday 10:30am',
    'Daily Mass Mon–Fri 8:00am'
  ];

  return (
    <div className="bg-white">
      <div className="bg-[#1e3a6e] text-white py-20 px-6 text-center">
        <p className="text-base font-semibold tracking-widest uppercase text-blue-300 mb-6">
          {hero?.subtitle || 'Mass Times'}
        </p>
        <h1 className="text-5xl md:text-6xl font-light font-serif leading-tight max-w-3xl mx-auto">
          {hero?.title || 'Worship With Us.'}
        </h1>
      </div>

      {/* Hero photo strip */}
      <div className="grid grid-cols-3 h-56 md:h-72 overflow-hidden">
        <div className="overflow-hidden">
          <img src="/inner_church_compressed.jpg" alt="Interior of Corpus Christi Church" className="w-full h-full object-cover" />
        </div>
        <div className="overflow-hidden">
          <img src="/Who_We_Are.jpg" alt="Corpus Christi congregation" className="w-full h-full object-cover object-top" />
        </div>
        <div className="overflow-hidden">
          <img src="/Gallery_c.jpg" alt="Family at Mass" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-16">
          <p className="text-xl leading-relaxed text-gray-600 mb-8">
            {intro?.body_text || 'Prayerful, intentional, and alive. Masses rarely exceed an hour — but you\'ll leave wanting more.'}
          </p>

          <div className="flex flex-wrap gap-3 mb-12">
            {massTimes.map((time, idx) => (
              <span key={idx} className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg text-base font-medium text-[#1e3a6e]">
                {time}
              </span>
            ))}
          </div>

          <div className="bg-blue-50 border-l-4 border-[#1e3a6e] rounded-r-lg p-8 mb-12">
            <h3 className="text-2xl font-semibold text-[#1e3a6e] mb-4">Where to Find Us</h3>
            <p className="text-xl text-gray-700 mb-2">
              322 St. James Drive, Piedmont, CA
            </p>
            <p className="text-xl text-gray-700 mb-4">
              <a href="tel:5105304343" className="hover:underline">510.530.4343</a>
            </p>
            <a
              href="https://www.google.com/maps/place/Corpus+Christi+Church/@37.81302739999999,-122.2148142,17z/data=!3m1!4b1!4m6!3m5!1s0x808f87a178176f07:0xe7ed743cf4f460af!8m2!3d37.8130274!4d-122.2148142!16s%2Fg%2F1tdw1x79"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-base font-semibold text-[#1e3a6e] hover:text-[#162d57] transition border-b-2 border-[#1e3a6e]"
            >
              → Open in Google Maps
            </a>
          </div>

          <div className="grid md:grid-cols-2 gap-10 mb-12">
            <div>
              <h3 className="text-3xl font-semibold text-[#1e3a6e] mb-4">What to Expect</h3>
              <p className="text-xl leading-relaxed text-gray-600 mb-4">
                Our Masses are reverent, engaging, and welcoming to all. Whether you're a lifelong Catholic or exploring faith for the first time, you'll find a community that's genuinely glad you're here.
              </p>
              <p className="text-xl leading-relaxed text-gray-600">
                Music, homilies, and hospitality — everything is done with intention. We take liturgy seriously, but we don't take ourselves too seriously. Come as you are.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-md">
              <img src="/CU_Family_sing.jpeg" alt="Families singing at Mass" className="w-full h-full object-cover" />
            </div>
          </div>

          <div>
            <h3 className="text-3xl font-semibold text-[#1e3a6e] mb-4">Stay Connected</h3>
            <p className="text-xl leading-relaxed text-gray-600 mb-6">
              Get parish news, event reminders, and Fr. Leo's updates — by text or email.
            </p>
            <a
              href="https://corpuschristipiedmont.flocknote.com/everyone"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-[#1e3a6e] text-white text-base font-semibold rounded-lg hover:bg-[#162d57] transition"
            >
              Sign Up for Flocknote
            </a>
          </div>
        </div>

        <div className="mt-12 bg-sky-50 border border-sky-200 rounded-xl p-6 flex items-start gap-3">
          <span className="text-sky-600 text-xl leading-none mt-0.5">&#9753;</span>
          <p className="text-base text-slate-700 leading-relaxed">
            If you'd like to request a mass for someone who is deceased or in need of prayer, please contact{' '}
            <a href="mailto:office@cc-parish.org" className="font-semibold text-[#1e3a6e] border-b border-blue-300 hover:border-[#1e3a6e] transition">
              Ann Endress
            </a>.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="/calendar"
            className="px-6 py-3 bg-[#1e3a6e] text-white text-base font-semibold rounded-lg hover:bg-[#162d57] transition"
          >
            View Full Calendar
          </a>
          <a
            href="/new-visitors"
            className="px-6 py-3 text-[#1e3a6e] text-base font-semibold rounded-lg border-2 border-[#1e3a6e] hover:bg-blue-50 transition"
          >
            New? Yes!
          </a>
        </div>
      </div>
    </div>
  );
}
