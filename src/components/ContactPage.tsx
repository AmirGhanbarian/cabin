import { useState } from 'react';
import { Phone, Mail, MapPin, CheckCircle2, Loader2, AlertCircle, Heart } from 'lucide-react';
import { useLang } from '@/lib/lang-context';
import { Reveal } from './Reveal';
import { useLikedIdeas } from '@/hooks/useLikedIdeas';
import { db } from '@/lib/db';
import type { LeadInsert } from '@/lib/db';

type Status = 'idle' | 'loading' | 'success' | 'error';

export function ContactPage() {
  const { t, dir } = useLang();
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { likedIds } = useLikedIdeas();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = t.contact.nameError;
    if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 7) e.phone = t.contact.phoneError;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setStatus('loading');
    try {
      const lead: LeadInsert = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
        message: form.message.trim() || undefined,
        liked_ideas: likedIds.length > 0 ? likedIds.join(', ') : undefined,
      };
      await db.insertLead(lead);
      setStatus('success');
      setForm({ name: '', phone: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" dir={dir} className="section-pad bg-ink-900 relative overflow-hidden pt-32 lg:pt-36">
      <div className="absolute inset-0 bg-grain opacity-40" />
      <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-brass-500/10 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-brass-500/5 blur-3xl" />

      <div className="relative container-px">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brass-400">{t.contact.eyebrow}</span>
              <h2 className="mt-3 font-serif text-heading text-cream-50 text-balance">{t.contact.title}</h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-cream-300">{t.contact.description}</p>

              {likedIds.length > 0 && (
                <div className="mt-6 flex items-center gap-3 rounded-2xl border border-brass-400/30 bg-brass-500/10 px-5 py-4">
                  <Heart className="h-5 w-5 fill-brass-400 text-brass-400" />
                  <span className="text-sm text-cream-200">{t.ideas.liked} {likedIds.length} · {t.ideas.likedHint}</span>
                </div>
              )}

              <div className="mt-10 space-y-4">
                <a href="tel:+15550100" className="group flex items-center gap-4 rounded-2xl border border-cream-200/10 bg-cream-50/5 p-5 transition-all hover:border-brass-400/40 hover:bg-cream-50/10">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brass-500/20 text-brass-400 transition-colors group-hover:bg-brass-500 group-hover:text-ink-900">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm text-cream-300">{t.contact.callDirectly}</div>
                    <div className="font-serif text-lg font-semibold text-cream-50">+1 555-0100</div>
                  </div>
                </a>

                <a href="mailto:hello@rufcabinetry.com" className="group flex items-center gap-4 rounded-2xl border border-cream-200/10 bg-cream-50/5 p-5 transition-all hover:border-brass-400/40 hover:bg-cream-50/10">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brass-500/20 text-brass-400 transition-colors group-hover:bg-brass-500 group-hover:text-ink-900">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm text-cream-300">{t.contact.emailUs}</div>
                    <div className="font-serif text-lg font-semibold text-cream-50">hello@rufcabinetry.com</div>
                  </div>
                </a>

                <div className="flex items-center gap-4 rounded-2xl border border-cream-200/10 bg-cream-50/5 p-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brass-500/20 text-brass-400">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm text-cream-300">{t.contact.serviceArea}</div>
                    <div className="font-serif text-lg font-semibold text-cream-50">{t.contact.serviceAreaValue}</div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="rounded-3xl bg-cream-50 p-6 lg:p-10">
              {status === 'success' ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-sage-100 text-sage-500">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <h3 className="mt-6 font-serif text-2xl font-bold text-ink-900">{t.contact.successTitle}</h3>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-500">{t.contact.successBody}</p>
                  <button onClick={() => setStatus('idle')} className="mt-8 rounded-full border border-ink-200 px-6 py-2.5 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-100">
                    {t.contact.submitAnother}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-ink-900">{t.contact.formTitle}</h3>
                    <p className="mt-1 text-sm text-ink-400">{t.contact.formSubtitle}</p>
                  </div>
                  <div>
                    <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink-700">{t.contact.name} *</label>
                    <input id="name" type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t.contact.namePlaceholder}
                      className={`w-full rounded-xl border px-4 py-3 text-ink-900 placeholder:text-ink-300 transition-colors focus:outline-none focus:ring-2 ${errors.name ? 'border-red-400 focus:ring-red-200' : 'border-ink-200 focus:border-brass-400 focus:ring-brass-200'}`} />
                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-ink-700">{t.contact.phone} *</label>
                    <input id="phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder={t.contact.phonePlaceholder}
                      className={`w-full rounded-xl border px-4 py-3 text-ink-900 placeholder:text-ink-300 transition-colors focus:outline-none focus:ring-2 ${errors.phone ? 'border-red-400 focus:ring-red-200' : 'border-ink-200 focus:border-brass-400 focus:ring-brass-200'}`} />
                    {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink-700">{t.contact.email} <span className="text-ink-400">{t.contact.emailOptional}</span></label>
                    <input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder={t.contact.emailPlaceholder}
                      className="w-full rounded-xl border border-ink-200 px-4 py-3 text-ink-900 placeholder:text-ink-300 transition-colors focus:border-brass-400 focus:outline-none focus:ring-2 focus:ring-brass-200" />
                  </div>
                  <div>
                    <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-ink-700">{t.contact.message} <span className="text-ink-400">{t.contact.emailOptional}</span></label>
                    <textarea id="message" rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder={t.contact.messagePlaceholder}
                      className="w-full resize-none rounded-xl border border-ink-200 px-4 py-3 text-ink-900 placeholder:text-ink-300 transition-colors focus:border-brass-400 focus:outline-none focus:ring-2 focus:ring-brass-200" />
                  </div>
                  {status === 'error' && (
                    <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                      <AlertCircle className="h-4 w-4 shrink-0" />{t.contact.error}
                    </div>
                  )}
                  <button type="submit" disabled={status === 'loading'} className="flex w-full items-center justify-center gap-2 rounded-full bg-brass-500 px-8 py-4 text-base font-medium text-ink-900 shadow-lg shadow-brass-500/20 transition-all hover:scale-[1.01] hover:bg-brass-400 disabled:opacity-60 disabled:hover:scale-100">
                    {status === 'loading' ? <><Loader2 className="h-5 w-5 animate-spin" />{t.contact.sending}</> : t.contact.submit}
                  </button>
                  <p className="text-center text-xs text-ink-400">{t.contact.agree}</p>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
