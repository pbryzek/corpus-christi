import { FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { usePageData } from '../lib/usePageData';

interface Bulletin {
  id: string;
  title: string;
  published_date: string;
  file_url: string;
  kind: 'bulletin' | 'worship_aide';
}

function formatDate(date: string) {
  return new Date(date + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function BulletinsPage() {
  const { content } = usePageData('bulletins');
  const hero = content['hero'];
  const intro = content['intro'];
  const [bulletins, setBulletins] = useState<Bulletin[]>([]);
  const [worshipAide, setWorshipAide] = useState<Bulletin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('bulletins')
      .select('id, title, published_date, file_url, kind')
      .order('published_date', { ascending: false })
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        const rows = (data || []) as Bulletin[];
        setBulletins(rows.filter(b => b.kind !== 'worship_aide'));
        setWorshipAide(rows.find(b => b.kind === 'worship_aide') ?? null);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-white">
      <div className="bg-[#1e3a6e] text-white py-20 px-6 text-center">
        <p className="text-base font-semibold tracking-widest uppercase text-blue-300 mb-6">
          {hero?.subtitle || 'Parish Bulletins'}
        </p>
        <h1 className="text-5xl md:text-6xl font-light font-serif leading-tight max-w-3xl mx-auto">
          {hero?.title || 'Stay in the Loop.'}
        </h1>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16">
        {worshipAide && (
        <div className="mb-12 bg-blue-50 border border-blue-200 rounded-xl p-6 flex items-center gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-slate-900">This Week's Worship Aid</h2>
            <a
              href={worshipAide.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:text-blue-900 underline underline-offset-2 font-medium"
            >
              {worshipAide.title} — {formatDate(worshipAide.published_date)}
            </a>
          </div>
        </div>
        )}
        <p className="text-xl leading-relaxed text-gray-600 mb-10">
          {intro?.body_text || 'Our weekly bulletin covers Mass intentions, parish announcements, upcoming events, and reflections from Fr. Leo. Published each weekend.'}
        </p>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-[#1e3a6e] mb-6">Recent Bulletins</h2>
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}
            </div>
          ) : bulletins.length === 0 ? (
            <p className="text-gray-500 text-sm">No bulletins available yet.</p>
          ) : (
            <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
              {bulletins.map(b => (
                <a
                  key={b.id}
                  href={b.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-6 py-4 bg-white hover:bg-blue-50 transition group"
                >
                  <div>
                    <p className="text-base font-semibold text-slate-900 group-hover:text-[#1e3a6e] transition">{b.title}</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {formatDate(b.published_date)}
                    </p>
                  </div>
                  <span className="text-[#1e3a6e] text-sm font-medium group-hover:underline">View PDF →</span>
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="bg-sky-50 border border-sky-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Get It Delivered</h3>
          <p className="text-base text-gray-600 mb-4">
            Sign up for Flocknote and receive parish news, bulletin highlights, and Fr. Leo's updates by email or text.
          </p>
          <a
            href="https://corpuschristipiedmont.flocknote.com/everyone"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-5 py-2.5 border-2 border-[#1e3a6e] text-[#1e3a6e] text-base font-semibold rounded-lg hover:bg-blue-50 transition"
          >
            Sign Up for Flocknote
          </a>
        </div>
      </div>
    </div>
  );
}
