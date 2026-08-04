import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useLang } from '@/lib/lang-context';
import { navigate } from '@/lib/router';
import { Reveal } from './Reveal';
import { db } from '@/lib/db';
import type { BlogPost } from '@/lib/db';

export function BlogListPage() {
  const { t, dir, lang } = useLang();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.listPublishedPosts().then((p) => { setPosts(p); setLoading(false); });
  }, []);

  return (
    <div className="pt-20 lg:pt-24">
      <div className="bg-ink-900 section-pad">
        <div className="container-px" dir={dir}>
          <button
            onClick={() => navigate({ name: 'home' })}
            className="mb-6 inline-flex items-center gap-2 text-sm text-cream-300 transition-colors hover:text-cream-50"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            {t.blog.backToHome}
          </button>
          <h1 className="font-serif text-display text-cream-50 text-balance">{t.blog.title}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-cream-300">{t.blog.subtitle}</p>
        </div>
      </div>

      <div className="section-pad">
        <div className="container-px">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-brass-300 border-t-brass-600" />
            </div>
          ) : posts.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-ink-400">No posts yet.</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <Reveal key={post.id} delay={i * 80}>
                  <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink-100 bg-cream-50 transition-all hover:border-brass-300 hover:shadow-xl hover:shadow-brass-500/10">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={post.cover_image_url}
                        alt={lang === 'en' ? post.title_en : post.title_fa}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex-1">
                        <h2 className="font-serif text-xl font-bold text-ink-900 text-balance">
                          {lang === 'en' ? post.title_en : post.title_fa}
                        </h2>
                        <p className="mt-2 text-sm leading-relaxed text-ink-500 line-clamp-3">
                          {lang === 'en' ? post.excerpt_en : post.excerpt_fa}
                        </p>
                      </div>
                      <button
                        onClick={() => navigate({ name: 'blog-post', params: { slug: post.slug } })}
                        className="mt-5 flex items-center gap-2 text-sm font-medium text-brass-600 transition-colors hover:text-brass-500"
                      >
                        {t.blog.readMore} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                      </button>
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

function parseContent(content: string): string {
  return content
    .split('\n\n')
    .map((para) => {
      if (para.startsWith('## ')) return `<h2 class="mt-8 mb-3 font-serif text-2xl font-bold text-ink-900">${para.slice(3)}</h2>`;
      if (para.startsWith('# ')) return `<h1 class="mt-8 mb-3 font-serif text-3xl font-bold text-ink-900">${para.slice(2)}</h1>`;
      return `<p class="mb-4 leading-relaxed text-ink-600">${para}</p>`;
    })
    .join('');
}

export function BlogPostPage({ slug }: { slug: string }) {
  const { t, dir, lang } = useLang();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.getPostBySlug(slug).then((p) => { setPost(p); setLoading(false); });
  }, [slug]);

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-brass-300 border-t-brass-600" />
    </div>
  );

  if (!post) return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-ink-400">Post not found.</p>
        <button onClick={() => navigate({ name: 'blog' })} className="mt-4 text-brass-600 hover:text-brass-500">{t.blog.backToBlog}</button>
      </div>
    </div>
  );

  return (
    <div dir={dir} className="pt-20 lg:pt-24">
      <div className="relative overflow-hidden">
        <img src={post.cover_image_url} alt={lang === 'en' ? post.title_en : post.title_fa} className="h-64 w-full object-cover lg:h-96" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 to-transparent" />
        <div className="absolute bottom-8 container-px w-full">
          <h1 className="font-serif text-display text-cream-50 max-w-3xl text-balance">
            {lang === 'en' ? post.title_en : post.title_fa}
          </h1>
        </div>
      </div>

      <div className="container-px py-12 max-w-3xl">
        <button
          onClick={() => navigate({ name: 'blog' })}
          className="mb-8 inline-flex items-center gap-2 text-sm text-ink-400 transition-colors hover:text-ink-700"
        >
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          {t.blog.backToBlog}
        </button>
        <div
          className="prose-content"
          dangerouslySetInnerHTML={{ __html: parseContent(lang === 'en' ? post.content_en : post.content_fa) }}
        />
      </div>
    </div>
  );
}
