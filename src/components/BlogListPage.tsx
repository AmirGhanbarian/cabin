import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Calendar } from 'lucide-react';
import { useLang } from '@/lib/lang-context';
import { navigate } from '@/lib/router';
import { supabase, type BlogPost } from '@/lib/supabase';
import { Reveal } from '@/components/Reveal';

export function BlogListPage() {
  const { t, lang } = useLang();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setPosts(data as BlogPost[]);
        setLoading(false);
      });
  }, []);

  const formatDate = (iso: string | null) => {
    if (!iso) return '';
    const locale = lang === 'fa' ? 'fa-IR' : 'en-US';
    return new Date(iso).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="pt-20 lg:pt-24">
      {/* Header */}
      <div className="bg-ink-900 section-pad">
        <div className="container-px">
          <button
            onClick={() => navigate({ name: 'home' })}
            className="mb-6 inline-flex items-center gap-2 text-sm text-cream-300 transition-colors hover:text-cream-50"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            {t.blogPage.backToHome}
          </button>
          <h1 className="font-serif text-display text-cream-50 text-balance">
            {t.blogPage.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-cream-300">
            {t.blogPage.subtitle}
          </p>
        </div>
      </div>

      {/* Posts */}
      <div className="section-pad">
        <div className="container-px">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-brass-300 border-t-brass-600" />
            </div>
          ) : posts.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-ink-400">{t.blogPage.noPosts}</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {posts.map((post, i) => (
                <Reveal key={post.id} delay={i * 80}>
                  <article
                    onClick={() => navigate({ name: 'blog-post', slug: post.slug })}
                    className="group cursor-pointer overflow-hidden rounded-2xl border border-ink-100 bg-cream-50 transition-all duration-300 hover:border-brass-300 hover:shadow-xl hover:shadow-brass-500/10"
                  >
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={post.cover_image_url}
                        alt={lang === 'en' ? post.title_en : post.title_fa}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5 lg:p-6">
                      <div className="flex items-center gap-2 text-xs text-ink-400">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(post.published_at)}
                      </div>
                      <h3 className="mt-3 font-serif text-xl font-bold text-ink-900 group-hover:text-brass-600 transition-colors">
                        {lang === 'en' ? post.title_en : post.title_fa}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-ink-500 line-clamp-3">
                        {lang === 'en' ? post.excerpt_en : post.excerpt_fa}
                      </p>
                      <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brass-600">
                        {t.blogPage.readMore}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
