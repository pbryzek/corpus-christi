import { Link } from 'react-router-dom';
import { usePageData } from '../lib/usePageData';

export default function GreetersUshersPage() {
  const { content, contacts } = usePageData('greeters-ushers');

  const hero = content['hero'];
  const greeters = content['greeters'];
  const ushers = content['ushers'];
  const contact = contacts[0];

  return (
    <div className="bg-white">

      <section className="bg-[#1e3a6e] text-white py-20 px-6 text-center">
        <p className="text-sm font-semibold tracking-widest uppercase text-blue-300 mb-4">Ministries</p>
        <h1 className="text-4xl md:text-5xl font-bold font-serif mb-5 leading-tight max-w-2xl mx-auto">
          {hero?.title || 'Greeters & Ushers'}
        </h1>
        <p className="text-lg font-serif text-blue-100 leading-relaxed max-w-xl mx-auto">
          {hero?.body_text || 'You are the first face someone sees when they walk through our doors. That moment — for a first-timer, for someone returning after years away — matters more than you know.'}
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-16 space-y-14">
        <div className="border-b border-blue-100 pb-14">
          <h2 className="text-2xl font-bold text-[#1e3a6e] mb-4">{greeters?.title || 'Greeters'}</h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-5 whitespace-pre-line">
            {greeters?.body_text || 'Greeters welcome parishioners and visitors before Mass with a warm smile and a genuine hello. It\'s a small gesture with an outsized impact — especially for anyone who walked in feeling uncertain about whether they belong.\n\n"The moment someone feels seen — really seen — is the moment they start to feel at home."'}
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-[#1e3a6e] mb-4">{ushers?.title || 'Ushers'}</h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-5 whitespace-pre-line">
            {ushers?.body_text || 'Ushers help guide our community through the flow of Mass — from seating to the offertory collection to anything else that comes up. It\'s a quiet, steady form of service that keeps everything running smoothly for everyone.'}
          </p>
          <p className="text-base text-gray-500 bg-blue-50 border border-blue-200 rounded-lg px-5 py-3 inline-block">
            For coordinator contact information, please reach out to{' '}
            {contact ? (
              <a href={`mailto:${contact.email}`} className="text-[#1e3a6e] border-b border-[#1e3a6e]/40 hover:border-[#1e3a6e] transition">
                {contact.name}
              </a>
            ) : (
              'the parish office'
            )}.
          </p>
        </div>
      </section>

      <section className="bg-blue-50 border-y border-blue-100 py-16 px-6">
        <div className="max-w-3xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-10 h-10 bg-[#1e3a6e] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-xl font-bold">1</span>
            </div>
            <h3 className="text-base font-bold text-[#1e3a6e] mb-2">Reach Out</h3>
            <p className="text-sm text-gray-500 leading-relaxed">Contact the parish office to express interest — no experience needed.</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-[#1e3a6e] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-xl font-bold">2</span>
            </div>
            <h3 className="text-base font-bold text-[#1e3a6e] mb-2">Brief Orientation</h3>
            <p className="text-sm text-gray-500 leading-relaxed">We'll walk you through everything you need to know in just a few minutes.</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-[#1e3a6e] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-xl font-bold">3</span>
            </div>
            <h3 className="text-base font-bold text-[#1e3a6e] mb-2">Show Up & Serve</h3>
            <p className="text-sm text-gray-500 leading-relaxed">Take your place at the door and make someone's Sunday a little brighter.</p>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl font-bold text-[#1e3a6e] mb-3">Join Us at the Door</h2>
        <p className="text-base text-gray-500 mb-6 max-w-md mx-auto">
          No experience needed — just a warm heart. Contact the parish office to get started.
        </p>
        <Link
          to="/contact"
          className="inline-block bg-[#1e3a6e] text-white text-base font-semibold px-6 py-3 rounded-lg hover:bg-[#162d57] transition"
        >
          Contact the Parish Office →
        </Link>
      </section>

    </div>
  );
}
