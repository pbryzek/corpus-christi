import { Link } from 'react-router-dom';
import { usePageData } from '../lib/usePageData';

const GROUPS = [
  {
    title: 'GenX-ish Fellowship',
    body: 'Friendship, faith, and the questions of midlife. For GenX (and GenX-adjacent) parishioners seeking meaningful connection.',
    href: '/genxish',
    isRoute: true,
    bg: 'bg-stone-700 hover:bg-stone-800 border-stone-600',
  },
  {
    title: 'Family Circle',
    body: 'Connecting young families at Corpus Christi through Juicebox Mixers, playdates, and faith-based gatherings.',
    href: '/family-circle',
    isRoute: true,
    bg: 'bg-orange-600 hover:bg-orange-700 border-orange-500',
  },
  {
    title: 'Living Our Faith',
    body: 'Faith in action — serving the poor, advocating for justice, and showing up for those who need it most.',
    href: '/living-our-faith',
    isRoute: true,
    bg: 'bg-amber-600 hover:bg-amber-700 border-amber-500',
  },
  {
    title: "Men's Club",
    body: 'The team behind the fun — hosting events that bring our community together and financially support the parish we love.',
    href: 'https://www.ccmensclub.org/',
    isRoute: false,
    bg: 'bg-slate-700 hover:bg-slate-800 border-slate-600',
  },
  {
    title: 'Centering Prayer',
    body: 'A contemplative community rooted in silent prayer and the presence of God.',
    href: null,
    isRoute: false,
    bg: 'bg-teal-700 border-teal-600',
    contactOffice: true,
  },
  {
    title: "WINGS (Women in God's Spirit)",
    body: 'A community of women from many parishes seeking to deepen their faith and grow in their relationship with God and one another.',
    href: null,
    isRoute: false,
    bg: 'bg-rose-700 border-rose-600',
    contactOffice: true,
  },
  {
    title: 'Genesis',
    body: 'Community organizing for justice — immigrants, public transit, and the vulnerable.',
    href: null,
    isRoute: false,
    bg: 'bg-emerald-700 border-emerald-600',
    contactOffice: true,
  },
];

function GroupCard({ title, body, href, isRoute, bg, contactOffice }: { title: string; body: string; href: string | null; isRoute: boolean; bg: string; contactOffice?: boolean }) {
  const content = (
    <>
      <h3 className="text-xl font-bold text-white mb-3 leading-snug">{title}</h3>
      <p className="text-lg text-white/80 leading-relaxed flex-1">{body}</p>
      {contactOffice && (
        <p className="mt-4 text-sm text-white/70">
          For more information,{' '}
          <a href="mailto:office@cc-parish.org" className="text-white underline underline-offset-2 hover:text-white/90 transition">
            please contact the office
          </a>
          .
        </p>
      )}
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

export default function GroupsLandingPage() {
  const { content } = usePageData('groups-landing');
  const hero = content['hero'];
  return (
    <div className="min-h-screen bg-teal-50">

      <div className="bg-teal-950 text-white py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-base font-semibold tracking-widest uppercase text-teal-300 mb-5">
            {hero?.subtitle || 'Parish Groups'}
          </p>
          <h1 className="text-6xl md:text-7xl font-bold font-serif leading-tight mb-6">
            {hero?.title || 'Find Your People.'}
          </h1>
          <p className="text-xl font-serif text-teal-200 max-w-2xl mx-auto leading-relaxed">
            {hero?.body_text || 'Our parish groups bring together people with shared passions — from faith and justice to fellowship and prayer.'}
          </p>
        </div>
      </div>

      <section className="py-16 md:py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-base font-bold tracking-widest uppercase text-teal-600 mb-8">Groups</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {GROUPS.map((g) => (
              <GroupCard key={g.title} {...g} contactOffice={g.contactOffice ?? false} />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
