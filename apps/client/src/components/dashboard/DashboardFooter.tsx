'use client';

import Link from 'next/link';
import { useT } from '@/i18n/I18nContext';

export default function DashboardFooter() {
  const t = useT();
  return (
    <footer
      className="flex shrink-0 items-center justify-center gap-4 px-6 py-2 text-xs"
      style={{ borderTop: '1px solid var(--sf-border)', color: 'var(--sf-faint)' }}
    >
      <Link href="/privacy" className="hover:underline">{t('legal.privacy')}</Link>
      <span>·</span>
      <Link href="/terms" className="hover:underline">{t('legal.terms')}</Link>
    </footer>
  );
}
