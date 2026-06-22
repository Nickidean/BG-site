'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PinInput } from './components/PinInput';

interface CoachOption {
  id: string;
  name: string;
}

export default function KudosLoginPage() {
  const router = useRouter();
  const [coaches, setCoaches] = useState<CoachOption[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingCoaches, setLoadingCoaches] = useState(true);

  useEffect(() => {
    // Check if already logged in
    fetch('/api/kudos/me')
      .then(r => r.json())
      .then(data => {
        if (data.id) {
          router.replace(data.role === 'admin' ? '/kudos/admin' : '/kudos/give');
        }
      })
      .catch(() => {});

    // Load coaches for the dropdown
    fetch('/api/kudos/coaches-public')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setCoaches(data);
      })
      .catch(() => {})
      .finally(() => setLoadingCoaches(false));
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedId || !pin) return;
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/kudos/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coachId: selectedId, pin }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }
      router.push(data.role === 'admin' ? '/kudos/admin' : '/kudos/give');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // Build dropdown with env-admin option when no coaches exist yet
  const allOptions = [
    ...(process.env.NODE_ENV !== 'production' || coaches.length === 0
      ? [{ id: '__admin__', name: '⚙️ Admin (first-run setup)' }]
      : []),
    ...coaches,
  ];

  // Always include the admin option
  const displayOptions = [{ id: '__admin__', name: '⚙️ Admin' }, ...coaches];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Logo / header */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-3">🌟</div>
          <h1 className="text-3xl font-bold tracking-tight">Coach Kudos</h1>
        </div>

        {/* Login card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-green-200 mb-1">Your club</label>
              <input
                readOnly
                value="Bridport Youth Football Club"
                className="w-full rounded-lg bg-white/5 border border-white/10 text-white/60 px-3 py-2.5 text-base cursor-default select-none focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-green-200 mb-1">Who are you?</label>
              {loadingCoaches ? (
                <div className="w-full rounded-lg bg-white/10 h-11 animate-pulse" />
              ) : (
                <select
                  value={selectedId}
                  onChange={e => setSelectedId(e.target.value)}
                  required
                  className="w-full rounded-lg bg-white/10 border border-white/20 text-white px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  <option value="" disabled className="bg-green-900">Select your name…</option>
                  {displayOptions.map(c => (
                    <option key={c.id} value={c.id} className="bg-green-900">{c.name}</option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <PinInput value={pin} onChange={setPin} label="Your PIN" />
            </div>

            {error && (
              <p className="text-red-300 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !selectedId || pin.length < 6}
              className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors"
            >
              {loading ? 'Logging in…' : 'Log in'}
            </button>
          </form>
        </div>

        <p className="text-center text-green-400/60 text-xs mt-6">
          Forgot your PIN? Just message Nick.
        </p>
      </div>
    </div>
  );
}
