import { useEffect, useState } from 'react';
import { ArrowLeft, Calendar } from 'lucide-react';
import { useLang } from '@/lib/lang-context';
import { navigate } from '@/lib/router';
import { supabase, type BlogPost } from '@/lib/supabase';

function renderContent(content: string) {
  const blocks = content.split('\n\n');
  return blocks.map((block, i) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    if (trimmed.startsWith('## ')) {
      return (
        <h2 key={i} className="mt-8 mb-4 font-serif text-2xl font-bold text-ink-900">
          {trimmed.slice(3)}
        </h2>
      );
    }
    if (trimmed.startsWith('# ')) {
      return (
        <h1 key={i} className="mt-8 mb-4 font-serif text-3xl font-bold text-ink-900">
          {trimmed.slice(2)}
        </h1>
      );
    }
    return (
      <p key={i} className="mb-4 text-base leading-relaxed text-ink-700">
        {trimmed}
      </p>
    );
  });
}

export function BlogPostPage({ slug }: { slug: string }) {
  const { t, lang } = useLang();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!error && data) setPost(data as BlogPost);
        setLoading(false);
      });
  }, [slug]);

  const formatDate = (iso: string | null) => {
    if (!iso) return '';
    const locale = lang === 'fa' ? 'fa-IR' : 'en-US';
    return new Date(iso).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brass-300 border-t-brass-600" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-20 lg:pt-24">
        <div className="section-pad">
          <div className="container-px py-20 text-center">
            <p className="text-ink-400">{t.blogPage.noPosts}</p>
            <button
              onClick={() => navigate({ name: 'blog' })}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-brass-500 px-6 py-3 text-sm font-medium text-ink-900"
            >
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
              {t.blogPage.backToBlog}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 lg:pt-24">
      {/* Cover image */}
      <div className="relative h-[40vh] min-h-[280px] overflow-hidden">
        <img
          src={post.cover_image_url}
          alt={lang === 'en' ? post.title_en : post.title_fa}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/30 to-ink-950/40" />
      </div>

      {/* Article */}
      <article className="section-pad">
        <div className="container-px">
          <div className="mx-auto max-w-3xl">
            <button
              onClick={() => navigate({ name: 'blog' })}
              className="mb-6 inline-flex items-center gap-2 text-sm text-ink-500 transition-colors hover:text-brass-500"
            >
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
              {t.blogPage.backToBlog}
            </button>

            <div className="flex items-center gap-2 text-sm text-ink-400">
              <Calendar className="h-4 w-4" />
              {t.blogPage.publishedOn} {formatDate(post.published_at)}
            </div>

            <h1 className="mt-4 font-serif text-4xl font-bold text-ink-900 text-balance lg:text-5xl">
              {lang === 'en' ? post.title_en : post.title_fa}
            </h1>

            <p className="mt-4 text-lg leading-relaxed text-ink-500">
              {lang === 'en' ? post.excerpt_en : post.excerpt_fa}
            </p>

            <div className="mt-8 border-t border-ink-100 pt-8">
              {renderContent(lang === 'en' ? post.content_en : post.content_fa)}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
