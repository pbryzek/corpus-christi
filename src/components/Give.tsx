import { Link } from 'react-router-dom';
import { PageContent } from '../lib/usePageData';

interface GiveProps {
  cmsContent?: PageContent;
}

export default function Give({ cmsContent }: GiveProps) {
  const title = cmsContent?.title || 'Help Us Build A Home You Love.';
  const quote = cmsContent?.subtitle || '\u201CIt is more blessed to give than to receive.\u201D \u2014 Acts 20:35';

  const DEFAULT_BODY = `This is the extraordinary home we\u2019re fortifying together:

The smile from the Sign of Peace that stays with you all day. The music that moves you to tears. The children gathered at the altar before they slip away for their own liturgy. The laughter after Mass over mediocre coffee and good donuts. The hand on your shoulder during a hard moment. The quiet prayer. The holy nudge.

This is a joyful refuge \u2014 a real home where the Holy Spirit shows up, where we count on each other in good times and bad. We are where the simple desire to love like God, act like God, be like God keeps drawing us back.

It costs real money to keep this special family alive and thriving. Fr. Leo will never ask. So we will.

Please give. As generously as you\u2019re able.`;

  const rawBody = cmsContent?.body_text || DEFAULT_BODY;
  const paragraphs = rawBody.split('\n\n');

  return (
    <section className="py-10 md:py-14 px-6 bg-blue-50 border-b border-gray-200">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 m-0">
            {title}
          </h2>
          <Link to="/give" className="px-6 py-3 bg-[#1e3a6e] text-white rounded-lg font-semibold hover:bg-[#162d57] transition whitespace-nowrap shadow-md hover:shadow-xl">
            Give
          </Link>
        </div>

        <div className="bg-blue-200 border border-gray-200 rounded-2xl p-8">
          <blockquote className="text-xl italic text-gray-700 mb-8 pl-6 border-l-4 border-gray-400">
            {quote}
          </blockquote>

          <div className="space-y-6 text-gray-700 leading-relaxed">
            {paragraphs.map((p, idx) => (
              <p key={idx} className={idx === paragraphs.length - 1 ? 'font-semibold text-slate-900' : undefined}>
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
