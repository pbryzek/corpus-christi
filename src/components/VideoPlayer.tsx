import { useState } from 'react';
import { Play, X } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
  thumbnailUrl: string;
  title: string;
}

export default function VideoPlayer({ videoUrl, thumbnailUrl, title }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <>
      <div className="relative rounded-2xl aspect-video md:aspect-auto md:h-96 overflow-hidden shadow-2xl" style={{ boxShadow: '0 0 40px rgba(30, 58, 110, 0.5), 0 0 80px rgba(30, 58, 110, 0.3)' }}>
        <div
          className="absolute inset-0 cursor-pointer group"
          onClick={() => setIsPlaying(true)}
        >
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-white bg-opacity-90 flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                <Play size={28} className="text-slate-900 ml-1" fill="currentColor" />
              </div>
              <p className="text-white text-xl font-semibold drop-shadow-lg">
                {title}
              </p>
            </div>
          </div>
        </div>
      </div>

      {isPlaying && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <button
            onClick={() => setIsPlaying(false)}
            className="absolute top-4 right-4 z-10 w-14 h-14 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center transition-all shadow-lg group"
          >
            <X size={32} className="text-slate-900 group-hover:scale-110 transition-transform" />
          </button>
          <div className="w-full max-w-5xl aspect-video animate-in zoom-in-95 duration-300">
            <iframe
              src={videoUrl}
              className="w-full h-full rounded-lg"
              allow="autoplay"
              title={title}
            />
          </div>
        </div>
      )}
    </>
  );
}
