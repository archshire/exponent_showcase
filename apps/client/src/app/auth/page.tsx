// useSearchParams() bails out of static prerendering, so the page that reads it
// must sit under a Suspense boundary or `next build` fails.
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSocket } from '@/lib/socket';

export default function Page() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // OAuth redirect handler
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const oauthError = params.get('error');

    if (token) {
      localStorage.setItem('token', token);

      const socket = getSocket(token);
      socket.connect();

      router.push('/dashboard');
    } else if (oauthError) {
      setError(`OAuth login failed (${oauthError}). Please try again.`);
    }
  }, [router]);

  const onLoginSuccess = (token: string) => {
    localStorage.setItem('token', token);

    const socket = getSocket(token);
    socket.connect();

    router.push('/dashboard');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Login failed');
      }

      const data = await res.json();
      onLoginSuccess(data.token);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400 }}>
      <h1><b>Login Page</b></h1>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" disabled={loading} style={{
          marginTop: 12,
          background: 'transparent',
          border: '1px solid #ccc',
          padding: '6px 10px',
          cursor: 'pointer',
        }}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <button
          type="button"
          onClick={() => router.push('/auth/signup')} 
          style={{
          marginTop: 12,
          background: 'transparent',
          border: '1px solid #ccc',
          padding: '6px 10px',
          cursor: 'pointer',
        }}
        >
          Create account
        </button>

        {/* Google and GitHub OAuth are temporarily disabled — only 42 is wired up.
        <button
          type="button"
          onClick={() => {
            window.location.href = 'http://localhost:3001/auth/google';
          }}
          style={{
          marginTop: 12,
          background: 'transparent',
          border: '1px solid #ccc',
          padding: '6px 10px',
          cursor: 'pointer',
        }}
        >
          Continue with 🇬 Google
        </button>

        <button
          type="button"
          onClick={() => {
            window.location.href = 'http://localhost:3001/auth/github';
          }}
          style={{
          marginTop: 12,
          background: 'transparent',
          border: '1px solid #ccc',
          padding: '6px 10px',
          cursor: 'pointer',
        }}
        >
          Continue with GitHub
        </button>
        */}

        <button
          type="button"
          onClick={() => {
            window.location.href = 'http://localhost:3001/auth/42';
          }}
          style={{
          marginTop: 12,
          background: 'transparent',
          border: '1px solid #ccc',
          padding: '6px 10px',
          cursor: 'pointer',
        }}
        >
          Continue with 42
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}