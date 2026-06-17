'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api, ApiError } from '@/lib/api';
import { getSocket } from '@/lib/socket';
import { Button, Card, Notice, TextField } from '@/components/ui';

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
      <Card className="w-full max-w-md p-8 sf-fade-up">
        <div className="mb-6 flex items-center gap-2">
          <span className="text-2xl">🜂</span>
          <span className="text-2xl font-extrabold tracking-tight">
            Sky<span className="sf-gradient-text">Forge</span>
          </span>
        </div>
        <h1 className="text-2xl font-bold">Create account</h1>
        <p className="mt-1 mb-6 text-sm" style={{ color: 'var(--sf-muted)' }}>
          Already have an account?{' '}
          <Link href="/auth" style={{ color: 'var(--sf-teal)' }} className="font-semibold hover:underline">
            Log in here
          </Link>
        </p>

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <TextField
            label="Username"
            type="text"
            placeholder="player_one"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
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
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <Notice kind="error">{error}</Notice>}

          <Button type="submit" loading={loading} className="w-full">
            Sign up
          </Button>
        </form>
      </Card>
    </div>
  );
}
