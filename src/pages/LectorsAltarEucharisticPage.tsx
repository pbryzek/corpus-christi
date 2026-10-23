import { Link } from 'react-router-dom';
import { usePageData } from '../lib/usePageData';

export default function LectorsAltarEucharisticPage() {
  const { content, contacts } = usePageData('lectors-altar-eucharistic');

  const hero = content['hero'];
  const sections = [
    { key: 'lectors', fallback: { title: 'Lectors', body: 'Lectors proclaim the Word of God at Mass. It\'s one of the most visible — and most meaningful — roles in our liturgy. If you feel called to serve, we\'d love to help you find your voice.', pullquote: 'Lord God, be on my mind, on my lips, and in my heart as I humbly proclaim your Word.' } },
    { key: 'altar-servers', fallback: { title: 'Altar Servers', body: 'Open to all students in 5th grade or older, and to adults. Altar servers assist at Mass and special liturgies — a beautiful way to serve the community from the heart of the sanctuary.' } },
    { key: 'eucharistic', fallback: { title: 'Eucharistic Ministers', body: 'Eucharistic Ministers assist the presider in serving the consecrated bread and wine to our assembly. It is a profound privilege — and a tangible expression of our care for one another.' } },
  ];

  const contact = contacts[0];

  return (
    <div className="bg-white">

      <section className="bg-[#1e3a6e] text-white py-20 px-6 text-center">
        <p className="text-sm font-semibold tracking-widest uppercase text-blue-300 mb-4">Ministries</p>
        <h1 className="text-4xl md:text-5xl font-bold font-serif mb-5 leading-tight max-w-2xl mx-auto">
          {hero?.title || 'Lectors, Altar Servers & Eucharistic Ministers'}
        </h1>
        <p className="text-lg font-serif text-blue-100 leading-relaxed max-w-xl mx-auto">
          {hero?.body_text || 'The hands, voice, and presence that bring our liturgy to life. Training is always available — no experience required.'}
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-16 space-y-14">
        {sections.map((section) => {
          const dbSection = content[section.key];
          const bodyLines = (dbSection?.body_text || section.fallback.body).split('\n\n');
          const mainBody = bodyLines[0];
          const pullquote = bodyLines.length > 1 ? bodyLines[1] : section.fallback.pullquote;
          return (
            <div key={section.key} className="border-b border-blue-100 pb-14 last:border-0 last:pb-0">
              <h2 className="text-2xl font-bold text-[#1e3a6e] mb-4">
                {dbSection?.title || section.fallback.title}
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-5">{mainBody}</p>
              {pullquote && (
                <blockquote className="border-l-4 border-[#1e3a6e] pl-5 italic text-[#1e3a6e]/80 text-lg leading-relaxed mb-5">
                  {pullquote}
                </blockquote>
              )}
              {contact && (
                <p className="text-base text-gray-500">
                  Contact:{' '}
                  <a href={`mailto:${contact.email}`} className="text-[#1e3a6e] border-b border-[#1e3a6e]/40 hover:border-[#1e3a6e] transition">
                    {contact.email}
                  </a>
                </p>
              )}
            </div>
          );
        })}
      </section>

      <section className="bg-blue-50 border-y border-blue-100 py-12 px-6 text-center">
        <p className="text-base text-gray-500 mb-5">View the current ministry schedule and sign up for upcoming Masses.</p>
        <a
          href="https://secure.rotundasoftware.com/30/web-terminal/login/Corpus"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-[#1e3a6e] text-white text-base font-semibold px-6 py-3 rounded-lg hover:bg-[#162d57] transition"
        >
          View the Ministry Schedule →
        </a>
      </section>

      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl font-bold text-[#1e3a6e] mb-3">Ready to Serve?</h2>
        <p className="text-base text-gray-500 mb-6 max-w-md mx-auto">
          All three ministries offer training. Reach out and we'll help you find the right fit.
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
