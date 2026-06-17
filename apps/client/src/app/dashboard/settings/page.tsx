'use client';

import { useState } from 'react';
import { api, ApiError, SUPPORTED_LANGUAGES, type LanguageCode } from '@/lib/api';
import { useDashboardUser, useDashboardActions } from '@/context/DashboardContext';
import { useI18n, useT } from '@/i18n/I18nContext';
import { LANGUAGE_LABELS } from '@/i18n/translations';
import { Button, Card, Notice, SectionTitle, TextField } from '@/components/ui';

export default function SettingsPage() {
  const user = useDashboardUser();
  const { patchUser } = useDashboardActions();
  const { lang, setLang } = useI18n();
  const t = useT();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [busy, setBusy] = useState<'password' | 'language' | null>(null);
  const [notice, setNotice] = useState<{ kind: 'success' | 'error'; text: string } | null>(null);

  function flash(kind: 'success' | 'error', text: string) {
    setNotice({ kind, text });
    window.setTimeout(() => setNotice(null), 4000);
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    setBusy('password');
    try {
      await api.changePassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      flash('success', t('settings.passwordUpdated'));
    } catch (err) {
      flash('error', err instanceof ApiError ? err.message : 'Failed to update password.');
    } finally {
      setBusy(null);
    }
  }

  async function changeLanguage(code: LanguageCode) {
    if (code === lang) return;
    setBusy('language');
    try {
      const p = await api.changeLanguage(code);
      setLang(code);
      patchUser({ languageCode: p.languageCode });
      flash('success', t('settings.languageUpdated'));
    } catch (err) {
      flash('error', err instanceof ApiError ? err.message : 'Failed to update language.');
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <SectionTitle title={t('settings.title')} subtitle={t('settings.subtitle')} />

      {notice && <Notice kind={notice.kind}>{notice.text}</Notice>}

      <Card className="p-6">
        <h3 className="mb-4 text-lg font-bold">{t('settings.language')}</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {SUPPORTED_LANGUAGES.map((code) => {
            const active = code === lang;
            return (
              <button
                key={code}
                disabled={busy === 'language'}
                onClick={() => changeLanguage(code)}
                className="rounded-xl px-4 py-3 text-sm font-semibold transition-colors"
                style={{
                  color: active ? 'var(--sf-text)' : 'var(--sf-muted)',
                  background: active ? 'rgba(45,212,191,0.12)' : 'rgba(255,255,255,0.03)',
                  border: active ? '1px solid var(--sf-border-strong)' : '1px solid var(--sf-border)',
                }}
              >
                {LANGUAGE_LABELS[code]}
              </button>
            );
          })}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="mb-4 text-lg font-bold">{t('settings.password')}</h3>
        <form onSubmit={savePassword} className="flex max-w-md flex-col gap-4">
          <TextField
            label={t('settings.currentPassword')}
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <TextField
            label={t('settings.newPassword')}
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            loading={busy === 'password'}
            disabled={currentPassword.length === 0 || newPassword.length < 8}
            className="self-start"
          >
            {t('common.save')}
          </Button>
        </form>
        <p className="mt-3 text-xs" style={{ color: 'var(--sf-faint)' }}>
          Signed in: {user.email}
        </p>
      </Card>
    </div>
  );
}
