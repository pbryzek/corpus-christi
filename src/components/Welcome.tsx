import { useNavigate } from 'react-router-dom';
import { PageContent } from '../lib/usePageData';

interface WelcomeProps {
  cmsContent?: PageContent;
}

export default function Welcome({ cmsContent }: WelcomeProps) {
  const navigate = useNavigate();

  const DEFAULT_BODY = `For nearly 100 years, people have been discovering something they didn't expect: real community. The kind where someone remembers your name, Fr. Leo's homily sends you back into the world a little more loving, and Sunday morning becomes something you look forward to, instead of something you endure.

Families seeking a vibrant parish and an exceptional K\u20138 education
Lifelong Catholics and those still discerning
Catholics returning after time away \u2014 including those hurt by the Church
First-time explorers of the Catholic faith
Young adults seeking community and faith that's real
Children and teens preparing for the sacraments
Couples preparing for marriage

Who Is Welcome? Everyone. Really. No asterisks.`;

  const title = cmsContent?.title || 'All Are Welcome, Especially You.';
  const subtitle = cmsContent?.subtitle || 'Married, single, divorced, partnered, parenting \u2014 you belong here:';
  const rawBody = cmsContent?.body_text || DEFAULT_BODY;

  const sections = rawBody.split('\n\n');
  const introParagraph = sections[0];
  const listSection = sections.length > 1 ? sections.slice(1, -1).join('\n').split('\n').filter(Boolean) : [];
  const closingLine = sections.length > 1 ? sections[sections.length - 1] : '';

  return (
    <section className="py-10 md:py-14 px-6 bg-blue-50 border-b border-blue-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-10 items-start">
          <div className="flex-1 min-w-0">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">{title}</h2>

            <p className="text-xl text-gray-700 mb-6 leading-relaxed">
              {introParagraph}
            </p>

            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              {subtitle}
            </p>

            {listSection.length > 0 && (
              <ul className="space-y-4 mb-8 ml-6 list-disc list-outside">
                {listSection.map((item, idx) => (
                  <li key={idx} className="text-gray-700 leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            )}

            {closingLine && (
              <p className="text-xl font-bold text-slate-900 mb-8">
                {closingLine}
              </p>
            )}

            <button
              onClick={() => navigate('/new-visitors')}
              className="px-6 py-3 bg-[#1e3a6e] text-white rounded-lg font-semibold hover:bg-[#162d57] transition shadow-md hover:shadow-xl"
            >
              New? Yes!
            </button>
          </div>

          <div className="md:w-80 lg:w-96 flex-shrink-0 self-center">
            <div className="w-full rounded-2xl shadow-lg overflow-hidden" style={{ height: '480px' }}>
              <img
                src="/Boys_tugofwar copy.jpg"
                alt="Kids playing tug of war at parish event"
                className="w-full h-full object-cover"
                style={{ objectPosition: 'center 40%' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
