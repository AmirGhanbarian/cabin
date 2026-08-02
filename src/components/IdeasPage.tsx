import { useEffect, useState } from 'react';
import { Heart, ArrowLeft, X } from 'lucide-react';
import { useLang } from '@/lib/lang-context';
import { navigate } from '@/lib/router';
import { supabase, type Idea } from '@/lib/supabase';
import { useLikedIdeas } from '@/hooks/useLikedIdeas';
import { Reveal } from '@/components/Reveal';

export function IdeasPage() {
  const { t, lang } = useLang();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const { likedIds, toggleLike, isLiked, clearAll } = useLikedIdeas();

  useEffect(() => {
    supabase
      .from('ideas')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setIdeas(data as Idea[]);
        setLoading(false);
      });
  }, []);

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
            {t.ideasPage.backToHome}
          </button>
          <h1 className="font-serif text-display text-cream-50 text-balance">
            {t.ideasPage.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-cream-300">
            {t.ideasPage.subtitle}
          </p>
        </div>
      </div>

      {/* Favorites bar */}
      {likedIds.length > 0 && (
        <div className="border-b border-brass-200 bg-brass-50">
          <div className="container-px flex items-center justify-between gap-4 py-3">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 fill-brass-500 text-brass-500" />
              <span className="text-sm font-medium text-brass-700">
                {t.ideas.yourFavorites}: {likedIds.length}
              </span>
            </div>
            <button
              onClick={clearAll}
              className="flex items-center gap-1 text-xs text-brass-600 transition-colors hover:text-brass-800"
            >
              <X className="h-3.5 w-3.5" />
              {t.ideas.clearAll}
            </button>
          </div>
        </div>
      )}

      {/* Gallery */}
      <div className="section-pad">
        <div className="container-px">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-brass-300 border-t-brass-600" />
            </div>
          ) : (
            <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:gap-6">
              {ideas.map((idea, i) => {
                const liked = isLiked(idea.id);
                return (
                  <Reveal key={idea.id} delay={i * 50} className="mb-4 break-inside-avoid xl:mb-6">
                    <div className="group relative overflow-hidden rounded-2xl">
                      <img
                        src={idea.image_url}
                        alt={lang === 'en' ? idea.title_en : idea.title_fa}
                        className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />
                      <button
                        onClick={() => toggleLike(idea.id)}
                        className={`absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md transition-all ${
                          liked
                            ? 'bg-brass-500 text-ink-900 scale-110'
                            : 'bg-ink-950/40 text-cream-100 hover:bg-ink-950/60'
                        }`}
                        aria-label="Like"
                      >
                        <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-5">
                        <h3 className="font-serif text-lg font-bold text-cream-50">
                          {lang === 'en' ? idea.title_en : idea.title_fa}
                        </h3>
                        <p className="mt-1 text-sm text-cream-300 line-clamp-2">
                          {lang === 'en' ? idea.caption_en : idea.caption_fa}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
