'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { LanguageCode } from '@/lib/api';
import { translate, type TranslationKey } from './translations';

interface I18nValue {
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({
  initialLang,
  children,
}: {
  initialLang: LanguageCode;
  children: React.ReactNode;
}) {
  const [lang, setLang] = useState<LanguageCode>(initialLang);
  const t = useCallback((key: TranslationKey) => translate(lang, key), [lang]);
  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    // Safe fallback so components render even outside a provider (e.g. auth pages).
    return { lang: 'en', setLang: () => {}, t: (key) => translate('en', key) };
  }
  return ctx;
}

export function useT(): (key: TranslationKey) => string {
  return useI18n().t;
}
