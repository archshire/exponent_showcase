'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api, ApiError } from '@/lib/api';
import { getSocket } from '@/lib/socket';
import { AbacusIcon, AuthHero, MathDoodles, Notice } from '@/components/ui';

export default function SignupClient() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await api.register(username, email, password);
      localStorage.setItem('token', data.token);
      const socket = getSocket(data.token);
      socket.connect();
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sf-app flex min-h-screen items-center justify-center p-6">
      <MathDoodles />
      <div className="relative z-10 grid w-full max-w-5xl items-center gap-12 lg:grid-cols-2">
        <AuthHero />
        <div className="flex justify-center lg:justify-start">
      <div className="w-full max-w-sm sf-fade-up">
        <div className="mb-6 flex items-center gap-2 lg:hidden">
          <AbacusIcon size={30} className="sf-bob" style={{ color: 'var(--sf-yellow)' }} />
          <span className="text-3xl font-extrabold tracking-tight">
            Ex<span className="sf-gradient-text">ponent</span>
          </span>
        </div>
        <h1 className="text-4xl font-bold">Create your account</h1>
        <p className="mt-1 mb-7 text-sm" style={{ color: 'var(--sf-muted)' }}>
          Already have an account?{' '}
          <Link href="/auth" style={{ color: 'var(--sf-yellow)' }} className="font-semibold hover:underline">
            Log in here
          </Link>
        </p>

        <form onSubmit={handleSignup} className="flex flex-col gap-6">
          <label className="flex flex-col gap-1">
            <span className="sf-label">Username</span>
            <input
              className="sf-underline"
              type="text"
              placeholder="player_one"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="sf-label">Email</span>
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
            <span className="sf-label">Password</span>
            <input
              className="sf-underline"
              type="password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error && <Notice kind="error">{error}</Notice>}

          <button type="submit" disabled={loading} className="sf-btn-sketch sf-btn-sketch-primary mt-1 w-full">
            {loading ? <span className="sf-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : 'Create account'}
          </button>
        </form>
      </div>
        </div>
      </div>
    </div>
  );
}
