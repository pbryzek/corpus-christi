import { Link } from 'react-router-dom';
import { usePageData } from '../lib/usePageData';

export default function HomeboundGriefPage() {
  const { content, contacts, events } = usePageData('homebound-grief');

  const hero = content['hero'];
  const homebound = content['homebound'];
  const grief = content['grief'];
  const homeboundContact = contacts.find(c => c.role?.includes('Homebound'));
  const griefContact = contacts.find(c => c.role?.includes('Grief'));

  return (
    <div className="bg-white">

      <section className="bg-[#1e3a6e] text-white py-20 px-6 text-center">
        <p className="text-sm font-semibold tracking-widest uppercase text-blue-300 mb-4">Ministries</p>
        <h1 className="text-4xl md:text-5xl font-bold font-serif mb-5 leading-tight max-w-2xl mx-auto">
          {hero?.title || 'Ministry to the Homebound & Grief Support'}
        </h1>
        <p className="text-lg font-serif text-blue-100 leading-relaxed max-w-xl mx-auto">
          {hero?.body_text || 'We are here for you. When life makes it hard to be with us, we come to you. And when loss makes everything heavy, we walk alongside you.'}
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-16 space-y-14">
        <div className="border-b border-blue-100 pb-14">
          <h2 className="text-2xl font-bold text-[#1e3a6e] mb-4">{homebound?.title || 'Ministry to the Homebound'}</h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-6 whitespace-pre-line">
            {homebound?.body_text || 'Our Eucharistic Ministers to the Homebound visit parishioners who are sick, homebound, or in assisted living — bringing the Eucharist and the presence of this community directly to them. No one should feel alone or forgotten.\n\nIf you or a loved one would like a visit, please reach out. We would be honored to come.'}
          </p>
          {(homeboundContact || true) && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <p className="text-base font-semibold text-[#1e3a6e] mb-1">
                Contact {homeboundContact?.name || 'Helen Merkle'}
              </p>
              <p className="text-base text-gray-500 mb-4">
                <a href={`tel:${(homeboundContact?.phone || '510.459.0690').replace(/\./g, '')}`} className="hover:text-[#1e3a6e] transition">{homeboundContact?.phone || '510.459.0690'}</a> &nbsp;&middot;&nbsp;{' '}
                <a href={`mailto:${homeboundContact?.email || 'h17merkle@yahoo.com'}`} className="text-[#1e3a6e] border-b border-[#1e3a6e]/40 hover:border-[#1e3a6e] transition">
                  {homeboundContact?.email || 'h17merkle@yahoo.com'}
                </a>
              </p>
              <p className="text-sm font-semibold text-[#1e3a6e] mb-1">Want to Volunteer?</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                If you're interested in bringing the Eucharist to homebound parishioners, or to one of our assisted living facilities in Oakland, you'll bring and find much joy in becoming a Eucharistic outreach minister.
              </p>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-[#1e3a6e] mb-4">{grief?.title || 'Grief Support'}</h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-5 whitespace-pre-line">
            {grief?.body_text || 'Our Grief Support Ministers offer a compassionate presence during loss and companionship on the long road back to renewal. We hold an annual Evening of Remembrance and a Coping with the Holidays Workshop — and we\'re available year-round for those who need a caring ear.\n\n"Blessed are those who mourn, for they will be comforted." — Matthew 5:4'}
          </p>
          {(griefContact || true) && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <p className="text-base font-semibold text-[#1e3a6e] mb-1">
                Contact {griefContact?.name || 'the Parish Office'}
              </p>
              <p className="text-base text-gray-500">
                <a href={`tel:${(griefContact?.phone || '510.530.4343').replace(/\./g, '')}`} className="hover:text-[#1e3a6e] transition">{griefContact?.phone || '510.530.4343'}</a> &nbsp;&middot;&nbsp;{' '}
                <a href={`mailto:${griefContact?.email || 'office@cc-parish.org'}`} className="text-[#1e3a6e] border-b border-[#1e3a6e]/40 hover:border-[#1e3a6e] transition">
                  {griefContact?.email || 'office@cc-parish.org'}
                </a>
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="bg-blue-50 border-y border-blue-100 py-14 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl border border-blue-200 p-6">
            <h3 className="text-base font-bold text-[#1e3a6e] mb-3">Annual Events</h3>
            <ul className="space-y-3 text-base text-gray-600">
              {events.length > 0 ? events.map(event => (
                <li key={event.id} className="flex gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1e3a6e] mt-2 flex-shrink-0"></span>
                  <span>{event.title} — {event.description}</span>
                </li>
              )) : (
                <>
                  <li className="flex gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1e3a6e] mt-2 flex-shrink-0"></span>
                    <span>Evening of Remembrance — A prayerful gathering to honor those we have lost</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1e3a6e] mt-2 flex-shrink-0"></span>
                    <span>Coping with the Holidays Workshop — Practical support for a tender time of year</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1e3a6e] mt-2 flex-shrink-0"></span>
                    <span>Three annual support group meetings</span>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl font-bold text-[#1e3a6e] mb-3">You Don't Have to Go Through This Alone</h2>
        <p className="text-base text-gray-500 mb-6 max-w-md mx-auto">
          Whether you need a visit or want to volunteer your time, we'd love to hear from you.
        </p>
        <Link
          to="/contact"
          className="inline-block bg-[#1e3a6e] text-white text-base font-semibold px-6 py-3 rounded-lg hover:bg-[#162d57] transition"
        >
          Reach Out →
        </Link>
      </section>

    </div>
  );
}
