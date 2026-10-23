import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface CmsPage {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  body: string | null;
  hero_image_url: string | null;
  is_published: boolean;
  meta_description: string | null;
}

export default function DynamicPage() {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<CmsPage | null | false>(null); // null=loading, false=not found

  useEffect(() => {
    if (!slug) return;
    supabase
      .from('cms_pages')
      .select('id, slug, title, subtitle, body, hero_image_url, is_published, meta_description')
      .eq('slug', slug)
      .eq('is_published', true)
      .maybeSingle()
      .then(({ data }) => {
        setPage(data ?? false);
      });
  }, [slug]);

  if (page === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (page === false) {
    return <Navigate to="/" replace />;
  }

  const paragraphs = (page.body || '').split(/\n\n+/).map(p => p.trim()).filter(Boolean);

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Hero */}
      <div
        className="relative bg-[#1e3a6e] text-white"
        style={page.hero_image_url ? {
          backgroundImage: `url(${page.hero_image_url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        } : undefined}
      >
        {page.hero_image_url && (
          <div className="absolute inset-0 bg-[#1e3a6e]/70" />
        )}
        <div className="relative max-w-4xl mx-auto px-6 py-20 md:py-28">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">{page.title}</h1>
          {page.subtitle && (
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl leading-relaxed">{page.subtitle}</p>
          )}
        </div>
      </div>

      {/* Body */}
      {paragraphs.length > 0 && (
        <div className="max-w-3xl mx-auto px-6 py-14 md:py-20">
          <div className="bg-white rounded-2xl shadow-sm border border-blue-100 px-8 md:px-12 py-10 space-y-6">
            {paragraphs.map((para, i) => (
              <p key={i} className="text-slate-700 text-base leading-relaxed">
                {para}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
