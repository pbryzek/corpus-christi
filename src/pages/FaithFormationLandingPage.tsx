import { Link } from 'react-router-dom';
import { usePageData } from '../lib/usePageData';

const cards = [
  {
    title: 'Family Faith Formation',
    description: 'Faith formation for the whole family — from First Communion preparation to ongoing faith development for children and parents together.',
    to: '/family-faith-formation',
    image: '/_JoyGroupShot.jpg',
  },
  {
    title: 'Confirmation & Youth Ministry',
    description: 'A two-year journey of faith, community, and service for teens — culminating in the Sacrament of Confirmation.',
    to: '/confirmation',
    image: '/Group_Confirmation.jpg',
  },
  {
    title: 'OCIA',
    description: 'The Order of Christian Initiation of Adults — a journey of no-pressure discernment for those exploring or entering the Catholic faith.',
    to: '/ocia',
    image: '/Baptism.png',
  },
  {
    title: 'Sacraments',
    description: 'Everything you need to know about the seven sacraments and how to receive them at Corpus Christi.',
    to: '/sacraments',
    image: '/GirlEucharistHandup.jpg',
  },
  {
    title: 'FORMED',
    description: 'The Catholic faith platform — films, podcasts, books, and scripture studies — available free to all Corpus Christi parishioners.',
    to: '/formed',
    image: '/ffstock.png',
  },
];

export default function FaithFormationLandingPage() {
  const { content } = usePageData('faith-formation');
  const hero = content['hero'];
  return (
    <div className="min-h-screen bg-white">

      <div className="bg-slate-900 text-white py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-semibold tracking-widest uppercase text-gray-400 mb-6">
            {hero?.subtitle || 'Faith Formation'}
          </p>
          <h1 className="text-5xl md:text-6xl font-bold font-serif">
            {hero?.title || 'Your Faith Journey Starts Here.'}
          </h1>
        </div>
      </div>

      <section className="py-16 md:py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card) => (
              <Link
                key={card.to}
                to={card.to}
                className="group relative rounded-xl overflow-hidden flex flex-col min-h-[280px] shadow-sm hover:shadow-xl transition-shadow duration-300"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${card.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/50 to-slate-900/20" />
                <div className="relative mt-auto p-7">
                  <h3 className="text-xl font-bold text-white mb-2 leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-base text-white/80 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
