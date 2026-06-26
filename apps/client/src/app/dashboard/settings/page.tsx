'use client';

import { useRef, useState } from 'react';
import { api, ApiError, SUPPORTED_LANGUAGES, type LanguageCode } from '@/lib/api';
import { useDashboardUser, useDashboardActions } from '@/context/DashboardContext';
import { useI18n, useT } from '@/i18n/I18nContext';
import { LANGUAGE_LABELS } from '@/i18n/translations';
import { Avatar, Button, Card, Notice, SectionTitle, TextField } from '@/components/ui';

type Busy = 'username' | 'email' | 'picture' | 'password' | 'language' | null;

export default function SettingsPage() {
  const user = useDashboardUser();
  const { patchUser } = useDashboardActions();
  const { lang, setLang } = useI18n();
  const t = useT();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [busy, setBusy] = useState<Busy>(null);
  const [notice, setNotice] = useState<{ kind: 'success' | 'error'; text: string } | null>(null);

  function flash(kind: 'success' | 'error', text: string) {
    setNotice({ kind, text });
    window.setTimeout(() => setNotice(null), 4000);
  }

  async function saveUsername() {
    if (username === user.username) return;
    setBusy('username');
    try {
      const p = await api.changeUsername(username.trim());
      patchUser({ username: p.username });
      flash('success', t('profile.usernameUpdated'));
    } catch (err) {
      flash('error', err instanceof ApiError ? err.message : t('settings.failedUsername'));
    } finally {
      setBusy(null);
    }
  }

  async function saveEmail() {
    if (email === user.email) return;
    setBusy('email');
    try {
      const p = await api.changeEmail(email.trim());
      patchUser({ email: p.email });
      flash('success', t('profile.emailUpdated'));
    } catch (err) {
      flash('error', err instanceof ApiError ? err.message : t('settings.failedEmail'));
    } finally {
      setBusy(null);
    }
  }

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      flash('error', t('settings.pictureTooLarge'));
      return;
    }
    setBusy('picture');
    try {
      const dataUrl = await readAsDataUrl(file);
      const p = await api.uploadPicture(dataUrl);
      patchUser({ profilePictureUrl: p.profilePictureUrl, identityImageSource: p.identityImageSource });
      flash('success', t('profile.pictureUpdated'));
    } catch (err) {
      flash('error', err instanceof ApiError ? err.message : t('settings.failedPicture'));
    } finally {
      setBusy(null);
    }
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
      flash('error', err instanceof ApiError ? err.message : t('settings.failedPassword'));
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
      flash('error', err instanceof ApiError ? err.message : t('settings.failedLanguage'));
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <SectionTitle title={t('settings.title')} subtitle={t('settings.subtitle')} />

      {notice && <Notice kind={notice.kind}>{notice.text}</Notice>}

      {/* Identity (formerly the Profile page) */}
      <Card className="flex flex-wrap items-center gap-6 p-6">
        <Avatar identity={user} size={96} />
        <div className="flex flex-col gap-2">
          <p className="text-xl font-bold">{user.username}</p>
          <p className="text-sm" style={{ color: 'var(--sf-teal)' }}>
            {user.auraPoints} {t('common.aura')}
          </p>
          <Button
            variant="ghost"
            size="sm"
            loading={busy === 'picture'}
            onClick={() => fileRef.current?.click()}
          >
            {t('profile.changePicture')}
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={onPickFile}
          />
          <p className="text-xs" style={{ color: 'var(--sf-faint)' }}>
            {t('settings.pictureFormats')}
          </p>
        </div>
      </Card>

      <Card className="flex flex-col gap-5 p-6">
        <div className="flex items-end gap-3">
          <TextField
            className="flex-1"
            label={t('profile.username')}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Button
            loading={busy === 'username'}
            disabled={username === user.username || username.trim().length === 0}
            onClick={saveUsername}
          >
            {t('common.save')}
          </Button>
        </div>

        <div className="flex items-end gap-3">
          <TextField
            className="flex-1"
            label={t('profile.email')}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            loading={busy === 'email'}
            disabled={email === user.email || email.trim().length === 0}
            onClick={saveEmail}
          >
            {t('common.save')}
          </Button>
        </div>
      </Card>

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
        {user.hasPassword ? (
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
        ) : (
          <p className="text-sm" style={{ color: 'var(--sf-muted)' }}>
            {t('settings.no42Password')}
          </p>
        )}
        <p className="mt-3 text-xs" style={{ color: 'var(--sf-faint)' }}>
          {t('settings.signedInAs')} {user.email}
        </p>
      </Card>
    </div>
  );
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('read failed'));
    reader.readAsDataURL(file);
  });
}
