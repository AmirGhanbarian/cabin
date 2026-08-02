import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { translations, type Lang } from '@/lib/translations';

type LangContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  t: typeof translations.en;
  dir: 'ltr' | 'rtl';
};

const LangContext = createContext<LangContextValue | null>(null);

const STORAGE_KEY = 'ruf-lang';

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'fa' || stored === 'en' ? (stored as Lang) : 'en';
  });

  const dir = lang === 'fa' ? 'rtl' : 'ltr';

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const setLang = (l: Lang) => setLangState(l);
  const toggleLang = () => setLangState((prev) => (prev === 'en' ? 'fa' : 'en'));

  const value: LangContextValue = {
    lang,
    setLang,
    toggleLang,
    t: translations[lang] as typeof translations.en,
    dir,
  };

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LangProvider');
  return ctx;
}
