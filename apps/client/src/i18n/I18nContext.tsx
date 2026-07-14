'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, SUPPORTED_LANGUAGES, type LanguageCode } from '@/lib/api';
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

function detectBrowserLanguage(): LanguageCode {
  if (typeof navigator === 'undefined') return 'en';
  const primary = navigator.language?.split('-')[0]?.toLowerCase();
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(primary ?? '')
    ? (primary as LanguageCode)
    : 'en';
}

// Resolves the language to show after mount (never during the server render,
// to avoid an SSR/CSR hydration mismatch): if the visitor is already logged in,
// prefer their saved account language over the browser's, so pages outside the
// dashboard's I18nProvider (auth, terms, privacy) still match what they picked
// in Settings instead of silently reverting to browser-detected English. The
// session is an httpOnly cookie (unreadable from JS), so we just try `api.me()`
// and fall back to browser detection when it returns a null user (logged out).
function PreferredLanguageDetector() {
  const { setLang } = useI18n();
  useEffect(() => {
    let cancelled = false;
    async function detect() {
      try {
        const user = await api.me();
        if (!cancelled && user && (SUPPORTED_LANGUAGES as readonly string[]).includes(user.languageCode)) {
          setLang(user.languageCode as LanguageCode);
          return;
        }
      } catch {
        // Not logged in (anymore) or request failed — fall through to browser detection.
      }
      if (!cancelled) setLang(detectBrowserLanguage());
    }
    void detect();
    return () => {
      cancelled = true;
    };
  }, [setLang]);
  return null;
}

/** For pages outside the dashboard's I18nProvider (auth, signup, terms, privacy)
 *  where there's no language context yet — prefers the visitor's saved account
 *  language if they're logged in, otherwise detects the browser's language. */
export function BrowserLanguageProvider({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider initialLang="en">
      <PreferredLanguageDetector />
      {children}
    </I18nProvider>
  );
}
