import { Link } from 'react-router-dom';
import { usePageData } from '../lib/usePageData';

const MINISTRIES = [
  {
    title: 'Music Ministry',
    body: 'Where worship comes alive. Whether you sing, play, or simply love music, our extraordinary music team would love to have you.',
    href: '/music-ministry',
    isRoute: true,
    bg: 'bg-sky-600 hover:bg-sky-700 border-sky-500',
  },
  {
    title: 'Lectors, Altar Servers & Eucharistic Ministers',
    body: 'These ministers proclaim the Word, assist at Mass, and distribute the Eucharist — a sacred privilege at the heart of our liturgy.',
    href: '/lectors-altar-eucharistic',
    isRoute: true,
    bg: 'bg-amber-600 hover:bg-amber-700 border-amber-500',
  },
  {
    title: 'Greeters & Ushers',
    body: 'The first face parishioners see when they walk through our doors. A warm welcome starts with you.',
    href: '/greeters-ushers',
    isRoute: true,
    bg: 'bg-emerald-700 hover:bg-emerald-800 border-emerald-600',
  },
  {
    title: 'Altar Guild, Hospitality & Environmental',
    body: 'The behind-the-scenes team that makes every Mass beautiful — from the altar to the coffee hour.',
    href: '/altarguild-hospitality',
    isRoute: true,
    bg: 'bg-rose-700 hover:bg-rose-800 border-rose-600',
  },
  {
    title: 'Ministry to the Homebound & Grief Support',
    body: "Bringing the love of the community to those who can't be with us. One of our most tender and important ministries.",
    href: '/homebound-grief',
    isRoute: true,
    bg: 'bg-blue-700 hover:bg-blue-800 border-blue-600',
  },
];

function MinistryCard({ title, body, href, isRoute, bg }: { title: string; body: string; href: string | null; isRoute: boolean; bg: string }) {
  const content = (
    <>
      <h3 className="text-xl font-bold text-white mb-3 leading-snug">{title}</h3>
      <p className="text-lg text-white/80 leading-relaxed flex-1">{body}</p>
    </>
  );

  const cls = `rounded-xl border p-7 flex flex-col shadow-md transition-colors duration-150 ${bg}`;

  if (href && isRoute) {
    return <Link to={href} className={cls}>{content}</Link>;
  }

  if (href && !isRoute) {
    return <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{content}</a>;
  }

  return <div className={cls}>{content}</div>;
}

export default function MinistriesLandingPage() {
  const { content } = usePageData('ministries-landing');
  const hero = content['hero'];
  return (
    <div className="min-h-screen bg-sky-50">

      <div className="bg-blue-950 text-white py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-base font-semibold tracking-widest uppercase text-sky-300 mb-5">
            {hero?.subtitle || 'Ministries'}
          </p>
          <h1 className="text-6xl md:text-7xl font-bold font-serif leading-tight mb-6">
            {hero?.title || 'Share Your Gifts.'}
          </h1>
          <p className="text-xl font-serif text-sky-200 max-w-2xl mx-auto leading-relaxed">
            {hero?.body_text || 'Our ministries are the hands and heart of the parish at work — serving God and one another in concrete, meaningful ways.'}
          </p>
        </div>
      </div>

      <section className="py-16 md:py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-base font-bold tracking-widest uppercase text-sky-500 mb-8">Ministries</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {MINISTRIES.map((m) => (
              <MinistryCard key={m.title} {...m} />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
