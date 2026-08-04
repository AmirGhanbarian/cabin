import { useEffect, useState } from 'react';
import { ArrowLeft, Heart } from 'lucide-react';
import { useLang } from '@/lib/lang-context';
import { navigate } from '@/lib/router';
import { Reveal } from './Reveal';
import { useLikedIdeas } from '@/hooks/useLikedIdeas';
import { db } from '@/lib/db';
import type { Idea } from '@/lib/db';

export function IdeasPage() {
  const { t, dir, lang } = useLang();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const { isLiked, toggleLike } = useLikedIdeas();

  useEffect(() => {
    db.listIdeas().then((i) => { setIdeas(i); setLoading(false); });
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
            {t.ideas.backToHome}
          </button>
          <h1 className="font-serif text-display text-cream-50 text-balance">{t.ideas.title}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-cream-300">{t.ideas.subtitle}</p>
        </div>
      </div>

      <div className="section-pad">
        <div className="container-px">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-brass-300 border-t-brass-600" />
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {ideas.map((idea, i) => (
                <Reveal key={idea.id} delay={i * 60} className="break-inside-avoid">
                  <div className="group relative overflow-hidden rounded-2xl border border-ink-100 bg-cream-50">
                    <div className="overflow-hidden">
                      <img
                        src={idea.image_url}
                        alt={lang === 'en' ? idea.title_en : idea.title_fa}
                        className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-serif font-bold text-ink-900">{lang === 'en' ? idea.title_en : idea.title_fa}</h3>
                          <p className="mt-1 text-sm text-ink-500">{lang === 'en' ? idea.caption_en : idea.caption_fa}</p>
                        </div>
                        <button
                          onClick={() => toggleLike(idea.id)}
                          className={`shrink-0 rounded-full p-2 transition-colors ${
                            isLiked(idea.id)
                              ? 'bg-brass-100 text-brass-600'
                              : 'bg-ink-100 text-ink-400 hover:bg-brass-50 hover:text-brass-500'
                          }`}
                          title={isLiked(idea.id) ? t.ideas.unlike : t.ideas.like}
                        >
                          <Heart className={`h-4 w-4 transition-all ${isLiked(idea.id) ? 'fill-brass-500' : ''}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
