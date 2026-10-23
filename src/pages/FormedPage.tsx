import { usePageData } from '../lib/usePageData';

export default function FormedPage() {
  const { content } = usePageData('formed');

  const hero = content['hero'];
  const about = content['about'];
  const signup = content['signup'];

  return (
    <div className="min-h-screen bg-sky-50">

      <div className="bg-blue-900 text-white py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-semibold tracking-widest uppercase text-blue-300 mb-6">
            Faith Formation
          </p>
          <h1 className="text-5xl md:text-6xl font-bold font-serif leading-tight">
            {hero?.title || 'Everything You Want to Know About Your Faith. On Your Own Time. For Free.'}
          </h1>
        </div>
      </div>

      <section className="py-16 md:py-20 px-6 border-b border-sky-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div>
              <p className="text-lg text-slate-600 leading-relaxed mb-4 whitespace-pre-line">
                {about?.body_text || 'FORMED is the Catholic faith platform — films, documentaries, books, podcasts, scripture studies, and daily reflections for every age and stage of faith.\n\nCurious about the Eucharist? Want to go deeper on the Gospels? Looking for something to watch with your family on a Friday night? It\'s all here.\n\nAs a Corpus Christi parishioner, it\'s yours at no cost.'}
              </p>
              <a
                href={about?.link_url || 'https://formed.org'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 transition shadow-md hover:shadow-xl"
              >
                {about?.link_label || 'Start Exploring at formed.org →'}
              </a>
            </div>
            <div className="relative rounded-2xl aspect-video md:aspect-auto md:h-96 overflow-hidden shadow-2xl">
              <iframe
                src="https://www.youtube.com/embed/dFgWtuBOz90"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Fr. Leo — Message About FORMED"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 px-6 bg-blue-50 border-b border-sky-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-10">{signup?.title || 'Signing Up is Easy.'}</h2>

              <div className="space-y-6 mb-8">
                <div className="flex gap-4 items-start">
                  <div className="w-9 h-9 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-base flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-lg">Go to formed.org/signup</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-9 h-9 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-base flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-lg mb-1">Enter our parish name</p>
                    <p className="text-slate-600 text-base">Corpus Christi Church, Piedmont, CA 94611</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-9 h-9 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-base flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-lg">Enter your name and email — and start exploring.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-blue-200 rounded-xl p-5 text-base text-slate-600 leading-relaxed">
                Can't get in? Your email may not be on file. Contact us at{' '}
                <a
                  href="mailto:office@cc-parish.org"
                  className="text-blue-700 font-semibold hover:underline"
                >
                  office@cc-parish.org
                </a>{' '}
                and we'll add you.
              </div>
            </div>

            <div>
              <div className="relative rounded-2xl aspect-video md:aspect-auto md:h-96 overflow-hidden shadow-2xl">
                <iframe
                  src="https://player.vimeo.com/video/358383023"
                  className="w-full h-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title="How to Register with a Parish Subscription"
                />
              </div>
              <p className="text-sm text-slate-400 mt-3 text-center">How to Register with a Parish Subscription — FORMED</p>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-6 pb-16 md:pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-blue-900 text-white rounded-2xl px-8 py-10 md:px-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-1">Ready to Explore?</h3>
              <p className="text-blue-200 text-base">Your faith. Your pace. Your parish subscription.</p>
            </div>
            <a
              href={signup?.link_url || 'https://formed.org'}
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-nowrap px-6 py-3 bg-white text-blue-900 rounded-lg font-semibold hover:bg-blue-50 transition shadow-md hover:shadow-xl"
            >
              {signup?.link_label || 'Go to FORMED →'}
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
