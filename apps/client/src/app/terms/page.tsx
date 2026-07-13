'use client';

import Link from 'next/link';
import { BrowserLanguageProvider, useT } from '@/i18n/I18nContext';
import type { TranslationKey } from '@/i18n/translations';

const SECTIONS: Array<{ title: TranslationKey; body: TranslationKey }> = [
  { title: 'terms.s1Title', body: 'terms.s1Body' },
  { title: 'terms.s2Title', body: 'terms.s2Body' },
  { title: 'terms.s3Title', body: 'terms.s3Body' },
  { title: 'terms.s4Title', body: 'terms.s4Body' },
  { title: 'terms.s5Title', body: 'terms.s5Body' },
  { title: 'terms.s6Title', body: 'terms.s6Body' },
];

function TermsContent() {
  const t = useT();
  return (
    <div className="sf-app min-h-screen">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Link href="/dashboard" className="text-sm" style={{ color: 'var(--sf-teal)' }}>
          ← {t('common.back')}
        </Link>
        <h1 className="mt-4 text-3xl font-extrabold">{t('legal.terms')}</h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--sf-muted)' }}>
          {t('legal.lastUpdated')}
        </p>

        <div className="mt-8 flex flex-col gap-6 leading-relaxed">
          {SECTIONS.map((s) => (
            <section key={s.title}>
              <h2 className="mb-2 text-xl font-bold">{t(s.title)}</h2>
              <p style={{ color: 'var(--sf-muted)' }}>{t(s.body)}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TermsPage() {
  return (
    <BrowserLanguageProvider>
      <TermsContent />
    </BrowserLanguageProvider>
  );
}
