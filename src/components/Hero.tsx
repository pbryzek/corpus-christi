import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VideoPlayer from './VideoPlayer';
import { PageContent } from '../lib/usePageData';

interface HeroProps {
  cmsContent?: PageContent;
}

export default function Hero({ cmsContent }: HeroProps) {
  const navigate = useNavigate();
  const [videoLoaded, setVideoLoaded] = useState(false);

  const headline = cmsContent?.title || 'You Belong Here.';
  const subheadline = cmsContent?.subtitle || 'Help Us Build a Home You Love.';
  const bodyLines = (cmsContent?.body_text || "God is love. That's not just a motto \u2014 it's how we show up, how we gather, and how we try to live.\n\nCome as you are. All are welcome. All belong.").split('\n\n');
  const bgVideoId = cmsContent?.link_url || 'https://player.vimeo.com/video/1179345570';

  return (
    <>
      <section className="relative overflow-hidden" style={{ height: '100vh' }}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/thumb.jpg)' }}
        >
          <iframe
            src={`${bgVideoId}?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1`}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[56.25vw] min-h-[100%] min-w-[177.78vh] transition-opacity duration-1000 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
            frameBorder="0"
            allow="autoplay; fullscreen"
            title="Background video"
            onLoad={() => setVideoLoaded(true)}
          ></iframe>
        </div>
        <div className="absolute bottom-0 left-0 z-10">
          <div className="bg-blue-100 rounded-tr-2xl p-8 md:p-12">
            <h1 className="text-6xl md:text-7xl font-bold font-serif text-slate-950 mb-4 leading-tight">
              {headline}
            </h1>
            <p className="text-3xl text-slate-800 mb-6 font-serif font-semibold">
              {subheadline}
            </p>
          </div>
        </div>
      </section>

      <section className="py-10 px-6 bg-blue-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-12">
            <div>
              <VideoPlayer
                videoUrl="https://player.vimeo.com/video/1179347938"
                thumbnailUrl="/fr-leo-welcome.png"
                title="Welcome from Fr. Leo"
              />
            </div>
            <div className="space-y-6">
              <div className="bg-slate-50 border border-gray-200 rounded-xl p-6">
                <p className="text-xl text-slate-800 mb-6 leading-relaxed">
                  {bodyLines.map((line, i) => (
                    <span key={i}>
                      {i === 0 ? <><strong><em>{line.split('.')[0]}.</em></strong>{line.slice(line.indexOf('.') + 1)}</> : line}
                      {i < bodyLines.length - 1 && <><br /><br /></>}
                    </span>
                  ))}
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => navigate('/new-visitors')}
                    className="px-6 py-3 bg-[#1e3a6e] text-white rounded-lg font-semibold hover:bg-[#162d57] transition shadow-md hover:shadow-xl"
                  >
                    New? Yes!
                  </button>
                  <button
                    onClick={() => navigate('/mass')}
                    className="px-6 py-3 border-2 border-[#1e3a6e] text-[#1e3a6e] rounded-lg font-semibold hover:bg-blue-50 transition shadow-md hover:shadow-xl"
                  >
                    Join Us This Sunday
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a
              href="/registration"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl p-6 bg-[#1e3a6e] hover:bg-[#162d57] transition shadow-md hover:shadow-xl hover:scale-105 transition-all"
            >
              <h3 className="font-semibold text-white mb-3">Already Catholic?</h3>
              <p className="text-base text-blue-200">Existing Catholics who want to join our family.</p>
            </a>

            <button
              onClick={() => navigate('/ocia')}
              className="rounded-xl p-6 bg-[#1e3a6e] hover:bg-[#162d57] transition text-left w-full flex flex-col justify-start shadow-md hover:shadow-xl hover:scale-105 transition-all"
            >
              <h3 className="font-semibold text-white mb-3">New to Catholicism (Adults)</h3>
              <p className="text-base text-blue-200">Interested in becoming Catholic or completing your sacraments as an adult?</p>
            </button>

            <button
              onClick={() => navigate('/sacraments')}
              className="rounded-xl p-6 bg-[#1e3a6e] hover:bg-[#162d57] transition text-left w-full flex flex-col justify-start shadow-md hover:shadow-xl hover:scale-105 transition-all"
            >
              <h3 className="font-semibold text-white mb-3">Interested in Sacraments?</h3>
              <p className="text-base text-blue-200">Missing a sacrament?</p>
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
