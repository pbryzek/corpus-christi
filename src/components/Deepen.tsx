import { BookOpen, Music, HandHelping, Users, School } from 'lucide-react';
import { PageContent } from '../lib/usePageData';

interface DeepenProps {
  cmsContent?: PageContent;
}

const deepenItems = [
  {
    title: 'Faith Formation',
    subtitle: 'Grow in knowledge & faith',
    link: '/faith-formation',
    external: false,
    bg: 'bg-amber-600',
    hover: 'hover:bg-amber-700',
    icon: BookOpen,
    hoverImage: '/GirlEucharistHandup.jpg',
  },
  {
    title: 'Worship & Music',
    subtitle: 'Praise through song & prayer',
    link: '/worship',
    external: false,
    bg: 'bg-sky-600',
    hover: 'hover:bg-sky-700',
    icon: Music,
    hoverImage: '/Music_compressed.jpg',
  },
  {
    title: 'Ministries',
    subtitle: 'Serve God & one another',
    link: '/ministries',
    external: false,
    bg: 'bg-blue-700',
    hover: 'hover:bg-blue-800',
    icon: HandHelping,
    hoverImage: '/Choir_1.jpg',
  },
  {
    title: 'Groups',
    subtitle: 'Find your community',
    link: '/groups',
    external: false,
    bg: 'bg-teal-700',
    hover: 'hover:bg-teal-800',
    icon: Users,
    hoverImage: '/peele_family.jpg',
  },
  {
    title: 'School',
    subtitle: 'Catholic education K–8',
    link: 'https://www.corpuschristischool.com/',
    external: true,
    bg: 'bg-red-800',
    hover: 'hover:bg-red-900',
    icon: School,
    hoverImage: '/FFF_Art.jpg',
  },
];

export default function Deepen({ cmsContent }: DeepenProps) {
  return (
    <section className="py-10 md:py-14 px-6 bg-blue-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">{cmsContent?.title || 'Deepen Your Spiritual Life.'}</h2>
        <p className="text-xl text-gray-600 mb-12">
          {cmsContent?.subtitle || "Wherever you are on your faith journey, there's something you'll love."}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {deepenItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <a
                key={idx}
                href={item.link}
                className={`group relative flex flex-col items-center justify-center text-center rounded-2xl px-6 py-10 md:py-12 transition-all duration-200 ${item.bg} shadow-md hover:shadow-xl hover:-translate-y-1 overflow-hidden`}
                {...(item.external && { target: '_blank', rel: 'noopener noreferrer' })}
              >
                {item.hoverImage && (
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ backgroundImage: `url(${item.hoverImage})` }}
                  />
                )}
                {item.hoverImage && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
                <div className="relative mb-4 bg-white/20 rounded-full p-4 group-hover:bg-white/30 transition-colors duration-200">
                  <Icon className="w-10 h-10 text-white" strokeWidth={1.5} />
                </div>
                <span className="relative text-white font-bold text-lg md:text-xl leading-snug tracking-wide uppercase">
                  {item.title}
                </span>
                <span className="relative mt-2 text-white/75 text-base hidden md:block">{item.subtitle}</span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
