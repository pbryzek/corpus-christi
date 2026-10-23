import { useState, useEffect, useRef } from 'react';
import { Play, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageContent } from '../lib/usePageData';

interface DifferenceProps {
  cmsContent?: PageContent;
}

export default function Difference({ cmsContent }: DifferenceProps) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<{ url: string; title: string; posterUrl?: string } | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const differences = [
    {
      title: 'Our Pastor, Fr. Leo.',
      description: 'His homilies are rooted in the Gospel and grounded in real life — honest, interactive, and occasionally hilarious. You\'ll walk out inspired to be a little more loving than when you walked in.',
      link: 'Watch welcome video →',
      href: null,
      videoUrl: 'https://player.vimeo.com/video/1179430745'
    },
    {
      title: 'Mass That Moves You.',
      description: 'Prayerful, intentional, and alive — with professional vocalists, musicians, and lectors who bring the liturgy to life. Rarely exceeds an hour, but you\'ll leave wanting more.',
      link: 'View Mass schedule →',
      href: '/mass',
      videoUrl: 'https://player.vimeo.com/video/1178991692'
    },
    {
      title: 'Meaningful Faith Formation.',
      description: 'For children, teens, new Catholics, returning Catholics, and anyone still working out what they believe. Formation isn\'t about memorizing answers — it\'s about developing a real relationship with a loving God.',
      link: 'Learn more →',
      href: '/faith-formation',
      videoUrl: 'https://player.vimeo.com/video/1179409758'
    },
    {
      title: 'An Exceptional School.',
      description: 'Corpus Christi\'s K–8 school educates the whole person — academic excellence inside a community that nurtures intellect, character, and belonging.',
      link: 'Visit school site →',
      href: 'https://www.corpuschristischool.com/',
      videoUrl: 'https://d3id26kdqbehod.cloudfront.net/CORPUS/2024/03/04/Hub23oHdhnG9ReSj7E8zEP1GWd9TRetqgASMVUl3LUcEwVZcmgTgf84HyS0B/We+%C3%B0%C2%9F%C2%92%C2%99+Corpus+Christi%21_revised-480p.mp4',
      posterUrl: '/ccsthumb.jpg'
    },
  ];

  useEffect(() => {
    if (isInteracting) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % differences.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isInteracting, differences.length]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.scrollWidth / differences.length;
      scrollContainerRef.current.scrollTo({
        left: currentIndex * cardWidth,
        behavior: 'smooth'
      });
    }
  }, [currentIndex, differences.length]);

  const handlePrevious = () => {
    setIsInteracting(true);
    setCurrentIndex((prev) => (prev - 1 + differences.length) % differences.length);
    setTimeout(() => setIsInteracting(false), 8000);
  };

  const handleNext = () => {
    setIsInteracting(true);
    setCurrentIndex((prev) => (prev + 1) % differences.length);
    setTimeout(() => setIsInteracting(false), 8000);
  };

  const handleMouseEnter = () => {
    setIsInteracting(true);
  };

  const handleMouseLeave = () => {
    setTimeout(() => setIsInteracting(false), 2000);
  };

  const handleVideoClick = (videoUrl: string, title: string, e: React.MouseEvent, posterUrl?: string) => {
    e.stopPropagation();
    setSelectedVideo({ url: videoUrl, title, posterUrl });
    setVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    setVideoModalOpen(false);
    setSelectedVideo(null);
  };

  return (
    <section className="py-10 md:py-14 px-6 bg-blue-100 border-b border-blue-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
            {cmsContent?.title || "We're Different. And Real. Come See What We Mean."}
          </h2>
        </div>

        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto scrollbar-hide scroll-smooth"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex gap-4 pb-4" style={{ width: 'max-content' }}>
              {differences.map((diff, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-xl p-6 bg-white cursor-pointer hover:border-gray-400 transition w-[280px] md:w-[300px] flex-shrink-0"
                  onClick={() => setExpanded(expanded === idx ? null : idx)}
                >
                  {diff.videoUrl ? (
                    <div
                      className="bg-slate-200 rounded-lg aspect-video mb-4 overflow-hidden relative group cursor-pointer"
                      onClick={(e) => handleVideoClick(diff.videoUrl!, diff.title, e, (diff as { videoUrl: string; posterUrl?: string }).posterUrl)}
                    >
                      {diff.videoUrl.includes('vimeo.com') ? (
                        <>
                          <iframe
                            src={`${diff.videoUrl}?background=1`}
                            className="w-full h-full pointer-events-none"
                            frameBorder="0"
                            allow="autoplay; fullscreen; picture-in-picture"
                            title={diff.title}
                          ></iframe>
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                              <Play size={20} className="text-slate-900 ml-0.5" fill="currentColor" />
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <video
                            src={diff.videoUrl}
                            className="w-full h-full object-cover pointer-events-none"
                            muted
                            playsInline
                            poster={(diff as { videoUrl: string; posterUrl?: string }).posterUrl}
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                              <Play size={20} className="text-slate-900 ml-0.5" fill="currentColor" />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="bg-slate-200 rounded-lg aspect-video mb-4 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full border-2 border-gray-500 flex items-center justify-center">
                        <Play size={18} className="text-gray-500 ml-0.5" fill="currentColor" />
                      </div>
                    </div>
                  )}

                  <h3 className="font-semibold text-slate-900 mb-3 leading-tight">{diff.title}</h3>

                  <button className="text-sm text-gray-400 mb-3 flex items-center gap-1">
                    {expanded === idx ? (
                      <>
                        <ChevronUp size={14} /> click to collapse
                      </>
                    ) : (
                      <>
                        <ChevronDown size={14} /> click to expand
                      </>
                    )}
                  </button>

                  {expanded === idx && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-base text-gray-600 mb-3 leading-relaxed">{diff.description}</p>
                      {diff.href ? (
                        diff.href.startsWith('http') ? (
                          <a href={diff.href} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-slate-900 transition block" onClick={e => e.stopPropagation()}>
                            {diff.link}
                          </a>
                        ) : (
                          <button onClick={(e) => { e.stopPropagation(); navigate(diff.href!); }} className="text-sm text-gray-500 hover:text-slate-900 transition block text-left">
                            {diff.link}
                          </button>
                        )
                      ) : (
                        <button onClick={(e) => { e.stopPropagation(); handleVideoClick(diff.videoUrl!, diff.title, e, (diff as { videoUrl: string; posterUrl?: string }).posterUrl); }} className="text-sm text-gray-500 hover:text-slate-900 transition block text-left">
                          {diff.link}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handlePrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center hover:bg-slate-50 transition shadow-lg z-10"
            aria-label="Previous"
          >
            <ChevronLeft size={20} className="text-slate-900" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center hover:bg-slate-50 transition shadow-lg z-10"
            aria-label="Next"
          >
            <ChevronRight size={20} className="text-slate-900" />
          </button>

          <div className="flex justify-center gap-2 mt-6">
            {[0, 1].map((pageIdx) => (
              <button
                key={pageIdx}
                onClick={() => {
                  setIsInteracting(true);
                  setCurrentIndex(pageIdx * 2);
                  setTimeout(() => setIsInteracting(false), 8000);
                }}
                className={`h-2 rounded-full transition-all ${
                  Math.floor(currentIndex / 2) === pageIdx ? 'bg-slate-900 w-8' : 'bg-gray-300 w-2'
                }`}
                aria-label={`Go to page ${pageIdx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {videoModalOpen && selectedVideo && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={closeVideoModal}
        >
          <div
            className="relative w-full max-w-5xl bg-black rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeVideoModal}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition"
              aria-label="Close video"
            >
              <X size={20} className="text-slate-900" />
            </button>
            <div className="aspect-video">
              {selectedVideo.url.includes('vimeo.com') ? (
                <iframe
                  src={selectedVideo.url}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title={selectedVideo.title}
                ></iframe>
              ) : (
                <video
                  src={selectedVideo.url}
                  className="w-full h-full"
                  controls
                  autoPlay
                  poster={selectedVideo.posterUrl}
                  title={selectedVideo.title}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
