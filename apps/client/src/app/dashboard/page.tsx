'use client';

import { useRouter } from 'next/navigation';
import { useDashboardUser } from '@/context/DashboardContext';
import { disconnectSocket } from '@/lib/socket';

export default function Page() {
  const user = useDashboardUser();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('http://localhost:3001/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    localStorage.removeItem('token');
    disconnectSocket();
    router.replace('/auth');
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Dashboard</h1>
      <p>Welcome, <strong>{user?.username}</strong></p>
      <p>Aura points: {user?.auraPoints}</p>
      <button
        onClick={() => router.push('/dashboard/matchmaking')}
        style={{
          marginTop: 12,
          background: '#2563eb',
          color: '#fff',
          border: 'none',
          padding: '8px 16px',
          cursor: 'pointer',
          borderRadius: 6,
          fontWeight: 600,
        }}
      >
        Play Game
      </button>
      <button onClick={handleLogout} style={{
          marginTop: 12,
          marginLeft: 8,
          background: 'transparent',
          border: '1px solid #ccc',
          padding: '6px 10px',
          cursor: 'pointer',
        }}>
        Logout
      </button>
    </div>
  );
}
