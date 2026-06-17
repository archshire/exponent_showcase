'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { api, API_BASE, ApiError } from '@/lib/api';
import { getSocket } from '@/lib/socket';
import { Button, Card, Notice, TextField } from '@/components/ui';

function AuthForm() {
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
      setError(err instanceof ApiError ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md p-8 sf-fade-up">
      <div className="mb-6 flex items-center gap-2">
        <span className="text-2xl">🜂</span>
        <span className="text-2xl font-extrabold tracking-tight">
          Sky<span className="sf-gradient-text">Forge</span>
        </span>
      </div>
      <h1 className="text-2xl font-bold">Log in</h1>
      <p className="mt-1 mb-6 text-sm" style={{ color: 'var(--sf-muted)' }}>
        Don&apos;t have an account?{' '}
        <Link href="/auth/signup" style={{ color: 'var(--sf-teal)' }} className="font-semibold hover:underline">
          Register here
        </Link>
      </p>

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <TextField
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {(error || oauthError) && (
          <Notice kind="error">
            {error ?? `OAuth login failed (${oauthError}). Please try again.`}
          </Notice>
        )}

        <Button type="submit" loading={loading} className="w-full">
          Log in
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs" style={{ color: 'var(--sf-faint)' }}>
        <hr className="sf-divider flex-1" />
        Or continue with
        <hr className="sf-divider flex-1" />
      </div>

      <a href={`${API_BASE}/auth/42`} className="sf-btn sf-btn-ghost w-full">
        Continue with 42
      </a>
    </Card>
  );
}

export default function Page() {
  return (
    <div className="sf-app flex min-h-screen items-center justify-center p-6">
      <Suspense fallback={null}>
        <AuthForm />
      </Suspense>
    </div>
  );
}
