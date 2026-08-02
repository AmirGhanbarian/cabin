import { useEffect, useState } from 'react';
import { Heart, ArrowRight } from 'lucide-react';
import { Reveal } from './Reveal';
import { Section, SectionHeading } from './Section';
import { useLang } from '@/lib/lang-context';
import { navigate } from '@/lib/router';
import { supabase, type Idea } from '@/lib/supabase';
import { useLikedIdeas } from '@/hooks/useLikedIdeas';

export function IdeasSection() {
  const { t, lang } = useLang();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const { likedIds, toggleLike, isLiked } = useLikedIdeas();

  useEffect(() => {
    supabase
      .from('ideas')
      .select('*')
      .order('sort_order', { ascending: true })
      .limit(6)
      .then(({ data }) => {
        if (data) setIdeas(data as Idea[]);
      });
  }, []);

  return (
    <Section id="ideas">
      <SectionHeading
        eyebrow={t.ideas.eyebrow}
        title={t.ideas.title}
        description={t.ideas.description}
      />

      <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-6">
        {ideas.map((idea, i) => {
          const liked = isLiked(idea.id);
          return (
            <Reveal key={idea.id} delay={i * 80}>
              <div className="group relative overflow-hidden rounded-2xl">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={idea.image_url}
                    alt={lang === 'en' ? idea.title_en : idea.title_fa}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
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
                  <h3 className="font-serif text-base font-bold text-cream-50 lg:text-lg">
                    {lang === 'en' ? idea.title_en : idea.title_fa}
                  </h3>
                  <p className="mt-1 text-xs text-cream-300 lg:text-sm line-clamp-1">
                    {lang === 'en' ? idea.caption_en : idea.caption_fa}
                  </p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      {likedIds.length > 0 && (
        <div className="mt-8 flex items-center justify-center gap-3 rounded-2xl border border-brass-200 bg-brass-50 px-6 py-4">
          <Heart className="h-5 w-5 fill-brass-500 text-brass-500" />
          <span className="text-sm font-medium text-brass-700">
            {t.ideas.liked} {likedIds.length} · {t.ideas.likedHint}
          </span>
        </div>
      )}

      <div className="mt-12 text-center">
        <button
          onClick={() => navigate({ name: 'ideas' })}
          className="group inline-flex items-center gap-2 rounded-full bg-brass-500 px-8 py-4 text-base font-medium text-ink-900 shadow-lg shadow-brass-500/20 transition-all hover:scale-[1.02] hover:bg-brass-400"
        >
          {t.ideas.viewAll}
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
        </button>
      </div>
    </Section>
  );
}
