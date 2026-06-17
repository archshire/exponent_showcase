'use client';

import { useRef, useState } from 'react';
import { api, ApiError } from '@/lib/api';
import { useDashboardUser, useDashboardActions } from '@/context/DashboardContext';
import { useT } from '@/i18n/I18nContext';
import { Avatar, Button, Card, Notice, SectionTitle, TextField } from '@/components/ui';

export default function ProfilePage() {
  const user = useDashboardUser();
  const { patchUser } = useDashboardActions();
  const t = useT();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [busy, setBusy] = useState<'username' | 'email' | 'picture' | null>(null);
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
      flash('error', err instanceof ApiError ? err.message : 'Failed to update username.');
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
      flash('error', err instanceof ApiError ? err.message : 'Failed to update email.');
    } finally {
      setBusy(null);
    }
  }

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      flash('error', 'Image is too large. Maximum size is 5 MB.');
      return;
    }
    setBusy('picture');
    try {
      const dataUrl = await readAsDataUrl(file);
      const p = await api.uploadPicture(dataUrl);
      patchUser({ profilePictureUrl: p.profilePictureUrl, identityImageSource: p.identityImageSource });
      flash('success', t('profile.pictureUpdated'));
    } catch (err) {
      flash('error', err instanceof ApiError ? err.message : 'Failed to upload picture.');
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <SectionTitle title={t('profile.title')} subtitle={t('profile.subtitle')} />

      {notice && <Notice kind={notice.kind}>{notice.text}</Notice>}

      <Card className="flex flex-wrap items-center gap-6 p-6">
        <div className="relative">
          <Avatar identity={user} size={96} />
        </div>
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
            JPG, PNG or WEBP, up to 5 MB.
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
