import { Mail, Phone, Banknote, Smartphone, Building2, Heart, MapPin } from 'lucide-react';
import { usePageData } from '../lib/usePageData';

export default function GivePage() {
  const { content } = usePageData('give');
  const hero = content['hero'];

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero — collection baskets photo as full-bleed background */}
      <div className="relative overflow-hidden" style={{ minHeight: '72vh' }}>
        <img
          src={hero?.image_url || '/give copy.jpg'}
          alt="Collection baskets at Corpus Christi"
          className="absolute inset-0 w-full h-full object-cover object-bottom"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-900/20" />
        <div className="absolute bottom-0 left-0 z-10 p-8 md:p-14 max-w-3xl">
          <p className="text-sm font-semibold tracking-widest uppercase text-blue-300 mb-4">
            {hero?.subtitle || 'Support Our Parish'}
          </p>
          <h1 className="text-5xl md:text-7xl font-bold font-serif text-white leading-tight mb-4">
            {hero?.title || 'Give.'}
          </h1>
          <p className="text-xl font-serif text-slate-200 leading-relaxed max-w-xl">
            {hero?.body_text || 'Your generosity sustains our community, our mission, and the people who depend on us.'}
          </p>
        </div>
      </div>

      {/* Intro */}
      <section className="bg-white border-b border-slate-100 py-14 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg text-slate-600 leading-relaxed">
            Every gift — large or small — makes a difference. We're grateful for your trust and generosity as we continue our mission of service and faith together.
          </p>
        </div>
      </section>

      {/* Motivational message */}
      <section className="py-10 md:py-14 px-6 bg-blue-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto">
          <div className="bg-blue-200 border border-gray-200 rounded-2xl p-8">
            <blockquote className="text-xl italic text-gray-700 mb-8 pl-6 border-l-4 border-gray-400">
              {"\u201CIt is more blessed to give than to receive.\u201D \u2014 Acts 20:35"}
            </blockquote>
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>This is the extraordinary home we{"\u2019"}re fortifying together:</p>
              <p>The smile from the Sign of Peace that stays with you all day. The music that moves you to tears. The children gathered at the altar before they slip away for their own liturgy. The laughter after Mass over mediocre coffee and good donuts. The hand on your shoulder during a hard moment. The quiet prayer. The holy nudge.</p>
              <p>This is a joyful refuge {"\u2014"} a real home where the Holy Spirit shows up, where we count on each other in good times and bad. We are where the simple desire to love like God, act like God, be like God keeps drawing us back.</p>
              <p>It costs real money to keep this special family alive and thriving. Fr. Leo will never ask. So we will.</p>
              <p className="font-semibold text-slate-900">Please give. As generously as you{"\u2019"}re able.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Giving methods */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto space-y-8">

          {/* Digital Giving */}
          <div className="bg-[#1e3a6e] rounded-2xl p-8 md:p-10 shadow-lg">
            <div className="flex items-center gap-3 mb-7">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Smartphone size={20} className="text-blue-200" />
              </div>
              <h2 className="text-2xl font-bold font-serif text-white">Digital Giving</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2">Zelle</h3>
                <p className="text-blue-200 text-sm mb-5 leading-relaxed">
                  Quick and easy mobile payments — no fees, direct to the parish.
                </p>
                <a
                  href="https://enroll.zellepay.com/qr-codes/?data=eyJuYW1lIjoiQ09SUFVTIENIUklTVEkgQ0hVUkNIIiwidG9rZW4iOiJqdWR5aGlsZ2VydEB5YWhvby5jb20iLCJhY3Rpb24iOiJwYXltZW50In0="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-36 h-28 bg-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-150 shadow px-4"
                >
                  <svg viewBox="0 0 120 40" className="w-24 h-auto" aria-label="Zelle" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="18" fill="#6D1ED4"/>
                    <text x="20" y="25" textAnchor="middle" fontSize="16" fontWeight="bold" fill="white" fontFamily="Arial, sans-serif">Z</text>
                    <text x="70" y="27" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#6D1ED4" fontFamily="Arial, sans-serif">zelle</text>
                  </svg>
                </a>
              </div>

              <div className="bg-white/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2">PayPal</h3>
                <p className="text-blue-200 text-sm mb-5 leading-relaxed">
                  Donate securely online using your PayPal account or any credit card.
                </p>
                <a
                  href="https://www.paypal.com/donate/?hosted_button_id=JTPMBXZMHJU84"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-48 h-28 bg-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-150 shadow px-4"
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/PayPal_Logo2014.svg/960px-PayPal_Logo2014.svg.png"
                    alt="PayPal"
                    className="w-28 h-auto"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Two-column: Bank + Traditional */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Building2 size={20} className="text-[#1e3a6e]" />
                </div>
                <h2 className="text-xl font-bold font-serif text-slate-900">Bank Transfer</h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-5">
                Contact your bank to set up a secure recurring or one-time transfer directly to the parish.
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-1">
                <p className="font-semibold text-slate-900">Corpus Christi Church</p>
                <p className="text-sm text-slate-500">322 St. James Drive</p>
                <p className="text-sm text-slate-500">Piedmont, CA 94611</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Banknote size={20} className="text-[#1e3a6e]" />
                </div>
                <h2 className="text-xl font-bold font-serif text-slate-900">Traditional Methods</h2>
              </div>
              <ul className="space-y-3">
                {[
                  'Contribution envelopes distributed during Mass',
                  'Mail a check to the church address',
                  'Drop payments in the rectory mail slot',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 bg-[#1e3a6e] rounded-full mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Employer Matching */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8 flex gap-5 items-start">
            <div className="w-10 h-10 bg-[#1e3a6e] rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
              <Heart size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">Employer Matching</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Many employers will match charitable donations — doubling your impact at no extra cost to you. Check with your HR department to see if your company participates.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <h2 className="text-xl font-bold font-serif text-slate-900 mb-2">Questions?</h2>
            <p className="text-sm text-slate-500 mb-6">
              To enroll in contribution envelopes or for any giving-related questions, reach out to the parish office.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="tel:510.530.4343"
                className="inline-flex items-center gap-3 bg-[#1e3a6e] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#162d57] transition-all duration-150 shadow-md hover:shadow-lg hover:scale-105 text-sm"
              >
                <Phone size={16} />
                510.530.4343
              </a>
              <a
                href="mailto:office@cc-parish.org"
                className="inline-flex items-center gap-3 bg-slate-50 border border-slate-200 px-6 py-3 rounded-lg text-sm text-slate-600 hover:border-[#1e3a6e] hover:text-[#1e3a6e] transition-all duration-150"
              >
                <Mail size={16} className="flex-shrink-0" />
                office@cc-parish.org
              </a>
              <div className="inline-flex items-start gap-3 bg-slate-50 border border-slate-200 px-6 py-3 rounded-lg text-sm text-slate-600">
                <MapPin size={16} className="mt-0.5 flex-shrink-0 text-slate-400" />
                <span>322 St. James Drive, Piedmont, CA 94611</span>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
