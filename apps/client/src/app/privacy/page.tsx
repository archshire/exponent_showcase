'use client';

import Link from 'next/link';
import { BrowserLanguageProvider, useT } from '@/i18n/I18nContext';
import type { TranslationKey } from '@/i18n/translations';

const SECTIONS: Array<{ title: TranslationKey; body: TranslationKey }> = [
  { title: 'privacy.s1Title', body: 'privacy.s1Body' },
  { title: 'privacy.s2Title', body: 'privacy.s2Body' },
  { title: 'privacy.s3Title', body: 'privacy.s3Body' },
  { title: 'privacy.s4Title', body: 'privacy.s4Body' },
  { title: 'privacy.s5Title', body: 'privacy.s5Body' },
];

function PrivacyContent() {
  const t = useT();
  return (
    <div className="sf-app min-h-screen">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Link href="/dashboard" className="text-sm" style={{ color: 'var(--sf-teal)' }}>
          ← {t('common.back')}
        </Link>
        <h1 className="mt-4 text-3xl font-extrabold">{t('legal.privacy')}</h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--sf-muted)' }}>
          {t('legal.lastUpdated')}
        </p>

        <div
          className="mt-8 flex flex-col gap-6 leading-relaxed"
          style={{ color: 'var(--sf-text)' }}
        >
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

export default function PrivacyPage() {
  return (
    <BrowserLanguageProvider>
      <PrivacyContent />
    </BrowserLanguageProvider>
  );
}
