import { Link } from 'react-router-dom';

export default function PrayerRequests() {
  return (
    <section className="py-10 md:py-14 px-6 bg-blue-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 m-0">
            Prayer Requests.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <p className="text-xl text-gray-700 mb-8">
              Whatever you're carrying — bring it here. Post your intention to our parish prayer wall and our dedicated Prayer Squad — a group of parishioners committed to lifting you up — will pray over every single one.
            </p>

            <div className="border border-gray-200 rounded-sm overflow-hidden bg-[#F4F4F4] shadow-md" style={{ position: 'relative', width: '100%', boxSizing: 'border-box' }}>
              <div style={{ padding: 0, margin: 0 }}>
                <iframe
                  src="https://padlet.com/embed/g59y6lo587jgljyl"
                  frameBorder="0"
                  allow="camera;microphone;geolocation;display-capture;clipboard-write"
                  style={{ width: '100%', height: '608px', display: 'block', padding: 0, margin: 0 }}
                  title="Parish Prayer Wall"
                ></iframe>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', margin: 0, padding: '8px 8px 8px 0' }}>
                <a
                  href="https://padlet.com?ref=embed"
                  style={{ display: 'flex', alignItems: 'center', gap: '5px', flexGrow: 0, margin: 0, border: 'none', padding: 0, textDecoration: 'none' }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span style={{ color: '#9E9E9E', fontSize: '10px', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,sans-serif', lineHeight: 1 }}>
                    Made with
                  </span>
                  <img
                    src="https://padlet.net/emails/padlet_email_logo_2026_text-dark-200.png"
                    height="12"
                    style={{ padding: 0, margin: 0, background: 'transparent', border: 'none', boxShadow: 'none', display: 'block' }}
                    alt="Made with Padlet"
                  />
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Need someone to talk to?</h3>
              <div className="space-y-3">
                <Link to="/staff?member=leo" className="block p-4 bg-white border border-blue-200 rounded-lg hover:border-blue-300 transition cursor-pointer shadow-md hover:shadow-lg">
                  <p className="font-semibold text-slate-900 text-base mb-1">Fr. Leo</p>
                  <p className="text-sm text-gray-600 mb-2">Pastoral care & sacramental support</p>
                  <a href="mailto:office@cc-parish.org" onClick={e => e.stopPropagation()} className="text-sm text-blue-700 hover:underline">office@cc-parish.org</a>
                </Link>
                <div className="p-4 bg-white border border-blue-200 rounded-lg shadow-md">
                  <p className="font-semibold text-slate-900 text-base mb-1">Helen Merkle</p>
                  <p className="text-sm text-gray-600 mb-2">Grief ministry</p>
                  <a href="mailto:h17merkle@yahoo.com" className="text-sm text-blue-700 hover:underline">Contact Helen Merkle</a>
                </div>
                <Link to="/staff?member=anne" className="block p-4 bg-white border border-blue-200 rounded-lg hover:border-blue-300 transition cursor-pointer shadow-md hover:shadow-lg">
                  <p className="font-semibold text-slate-900 text-base mb-1">Anne Kallin Zehren</p>
                  <p className="text-sm text-gray-600 mb-2">Spiritual direction</p>
                  <a href="mailto:ministry@cc-parish.org" onClick={e => e.stopPropagation()} className="text-sm text-blue-700 hover:underline">Contact Anne Kallin Zehren</a>
                </Link>
              </div>
            </div>

            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                If you're in immediate crisis, dial <strong>988</strong> for the Suicide & Crisis Lifeline — available by call or text, 24/7.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
