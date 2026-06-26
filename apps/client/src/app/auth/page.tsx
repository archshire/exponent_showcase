'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { api, API_BASE, ApiError } from '@/lib/api';
import { getSocket } from '@/lib/socket';
import { AbacusIcon, AuthHero, FortyTwoIcon, MathDoodles, Notice } from '@/components/ui';
import { BrowserLanguageProvider, useT } from '@/i18n/I18nContext';

function AuthForm() {
  const t = useT();
  const router = useRouter();
  const searchParams = useSearchParams();
  const oauthError = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // OAuth redirect handler
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      const socket = getSocket(token);
      socket.connect();
      router.push('/dashboard');
    }
  }, [router, searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await api.login(email, password);
      localStorage.setItem('token', data.token);
      const socket = getSocket(data.token);
      socket.connect();
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t('auth.loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 w-full max-w-sm sf-fade-up">
      <div className="mb-6 flex items-center gap-2 lg:hidden">
        <AbacusIcon size={30} className="sf-bob" style={{ color: 'var(--sf-yellow)' }} />
        <span className="text-3xl font-extrabold tracking-tight">
          Ex<span className="sf-gradient-text">ponent</span>
        </span>
      </div>
      <h1 className="text-4xl font-bold">{t('home.welcome')}</h1>
      <p className="mt-1 mb-7 text-sm" style={{ color: 'var(--sf-muted)' }}>
        {t('auth.noAccount')}{' '}
        <Link href="/auth/signup" style={{ color: 'var(--sf-yellow)' }} className="font-semibold hover:underline">
          {t('auth.registerHere')}
        </Link>
      </p>

      <form onSubmit={handleLogin} className="flex flex-col gap-6">
        <label className="flex flex-col gap-1">
          <span className="sf-label">{t('auth.email')}</span>
          <input
            className="sf-underline"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="sf-label">{t('auth.password')}</span>
          <input
            className="sf-underline"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {(error || oauthError) && (
          <Notice kind="error">
            {error ?? `${t('auth.oauthFailedPrefix')} (${oauthError}). ${t('common.tryAgain')}`}
          </Notice>
        )}

        <button type="submit" disabled={loading} className="sf-btn-sketch sf-btn-sketch-primary mt-1 w-full">
          {loading ? <span className="sf-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : t('auth.login')}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3 text-base" style={{ color: 'var(--sf-faint)' }}>
        <hr className="sf-divider flex-1" />
        {t('auth.orContinue').toLowerCase()}
        <hr className="sf-divider flex-1" />
      </div>

      <a
        href={`${API_BASE}/auth/42`}
        aria-label={t('auth.with42')}
        className="sf-btn-sketch flex w-full items-center justify-center"
      >
        <FortyTwoIcon size={30} />
      </a>
    </div>
  );
}

export default function Page() {
  return (
    <BrowserLanguageProvider>
      <div className="sf-app flex min-h-screen items-center justify-center p-6">
        <MathDoodles />
        <div className="relative z-10 grid w-full max-w-5xl items-center gap-12 lg:grid-cols-2">
          <AuthHero />
          <div className="flex justify-center lg:justify-start">
            <Suspense fallback={null}>
              <AuthForm />
            </Suspense>
          </div>
        </div>
      </div>
    </BrowserLanguageProvider>
  );
}
