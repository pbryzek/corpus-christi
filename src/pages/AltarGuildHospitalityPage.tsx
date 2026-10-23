import { Link } from 'react-router-dom';
import { usePageData } from '../lib/usePageData';

export default function AltarGuildHospitalityPage() {
  const { content, contacts } = usePageData('altarguild-hospitality');

  const hero = content['hero'];
  const sections = [
    { key: 'altar-guild', fallback: { title: 'Altar Guild', body: 'The Altar Guild cares for the candlesticks and sacred vessels that grace our church. It\'s detail-oriented, meditative work — about 20-30 minutes, typically every other month. A lovely way to serve quietly and faithfully.' } },
    { key: 'hospitality', fallback: { title: 'Hospitality Committee', body: 'The Hospitality Committee creates fellowship after Mass and for special occasions — the coffee, the conversation, the sense that this community is worth lingering in. Community happens around a table, and this team sets it.' } },
    { key: 'environmental', fallback: { title: 'Environmental Committee', body: 'This team plans and prepares the liturgical environment of our church — seasonal decor, sacred aesthetics, the visual language of our worship. If you have an eye for beauty and a love of liturgy, this is your ministry.' } },
  ];

  return (
    <div className="bg-white">

      <section className="bg-[#1e3a6e] text-white py-20 px-6 text-center">
        <p className="text-sm font-semibold tracking-widest uppercase text-blue-300 mb-4">Ministries</p>
        <h1 className="text-4xl md:text-4xl font-bold font-serif mb-5 leading-tight max-w-2xl mx-auto">
          {hero?.title || 'Altar Guild, Hospitality & Environmental'}
        </h1>
        <p className="text-lg font-serif text-blue-100 leading-relaxed max-w-xl mx-auto">
          {hero?.body_text || 'We belong to God and each other. These three teams make that truth visible — in the beauty of our sanctuary, the welcome at our table, and the spirit of every gathering.'}
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-16 space-y-14">
        {sections.map((section, idx) => {
          const dbSection = content[section.key];
          const contact = contacts[idx];
          return (
            <div key={section.key} className="border-b border-blue-100 pb-14 last:border-0 last:pb-0">
              <h2 className="text-2xl font-bold text-[#1e3a6e] mb-4">
                {dbSection?.title || section.fallback.title}
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-5 whitespace-pre-line">
                {dbSection?.body_text || section.fallback.body}
              </p>
              {contact && (
                <p className="text-base text-gray-500">
                  Contact {contact.name}:{' '}
                  <a
                    href={contact.phone ? `tel:${contact.phone.replace(/\./g, '')}` : `mailto:${contact.email}`}
                    className="text-[#1e3a6e] border-b border-[#1e3a6e]/40 hover:border-[#1e3a6e] transition"
                  >
                    {contact.phone || contact.email}
                  </a>
                </p>
              )}
            </div>
          );
        })}
      </section>

      <section className="bg-blue-50 border-y border-blue-100 py-14 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-[#1e3a6e] mb-6 text-center">Three Teams, One Purpose</h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="bg-white rounded-xl border border-blue-200 p-6">
              <p className="text-3xl mb-3">✦</p>
              <h3 className="text-base font-bold text-[#1e3a6e] mb-2">Sacred Beauty</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Caring for the vessels and objects that hold our holiest moments.</p>
            </div>
            <div className="bg-white rounded-xl border border-blue-200 p-6">
              <p className="text-3xl mb-3">✦</p>
              <h3 className="text-base font-bold text-[#1e3a6e] mb-2">Gathered Together</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Creating the moments of warmth and connection that bind a parish together.</p>
            </div>
            <div className="bg-white rounded-xl border border-blue-200 p-6">
              <p className="text-3xl mb-3">✦</p>
              <h3 className="text-base font-bold text-[#1e3a6e] mb-2">Living Liturgy</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Shaping the visual spirit of our worship through every season of the year.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl font-bold text-[#1e3a6e] mb-3">Find Your Place</h2>
        <p className="text-base text-gray-500 mb-6 max-w-md mx-auto">
          Three different teams, one shared purpose. Reach out and we'll help you find the right fit.
        </p>
        <Link
          to="/contact"
          className="inline-block bg-[#1e3a6e] text-white text-base font-semibold px-6 py-3 rounded-lg hover:bg-[#162d57] transition"
        >
          Contact Us →
        </Link>
      </section>

    </div>
  );
}
