'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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
          router.replace('/kudos/give');
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
      router.push('/kudos/give');
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
    <div className="flex flex-col items-center min-h-screen px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Logo / header */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-3">🌟</div>
          <h1 className="text-3xl font-bold tracking-tight">Coach Kudos</h1>
          <p className="text-green-300 mt-1 text-sm">Recognise the coaches who go the extra mile</p>
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
                  name="username"
                  autoComplete="username"
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
              <label className="block text-sm font-medium text-green-200 mb-1">Your PIN</label>
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                inputMode="numeric"
                value={pin}
                onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="••••••"
                required
                className="w-full rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/30 px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-green-400"
              />
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

      {/* Benefits + How it works */}
      <div className="w-full max-w-sm mt-16 space-y-12 pb-16">

        {/* Why it matters */}
        <div>
          <h2 className="text-lg font-bold mb-3">Why it matters</h2>
          <p className="text-green-200 text-sm leading-relaxed mb-4">
            Coaches give up their time, but it can feel like they get nothing back. Sometimes a quick message or a word of encouragement makes a world of difference.
          </p>
          <p className="text-green-300 text-sm font-medium mb-4">
            Coach Kudos helps your club build a culture of support and generosity.
          </p>
          <ul className="space-y-3">
            {[
              { icon: '👀', text: 'Notice when a coach goes above and beyond, and say thank you' },
              { icon: '💬', text: "When someone's going through a tough time, send them a few words of support" },
              { icon: '✨', text: 'Spread a bit of positivity across the whole club' },
            ].map(({ icon, text }) => (
              <li key={text} className="flex items-start gap-3 text-sm text-white/80">
                <span className="text-base leading-snug shrink-0">{icon}</span>
                <span className="leading-relaxed">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10" />

        {/* How it works */}
        <div>
          <h2 className="text-lg font-bold mb-5">How it works</h2>
          <ol className="space-y-6">
            {[
              {
                icon: '🎟️',
                title: 'Get your recognitions',
                body: "Every month each coach gets 3 recognitions to give out. You don't have to use them, but here's the twist: the more you give, the more points you earn too.",
              },
              {
                icon: '✉️',
                title: 'Send a message',
                body: "Pick someone, write your message and send it. They'll get an email with your kind words.",
              },
              {
                icon: '⭐',
                title: 'Leadership can boost',
                body: 'The chairman and club leadership can see every recognition, and boost the ones they think are extra special.',
              },
              {
                icon: '🏆',
                title: 'Celebrate at meetings',
                body: "At each club meeting, based on all the recognition given, the club hands out a gift to thank the people who've gone above and beyond.",
              },
            ].map(({ icon, title, body }, i) => (
              <li key={title} className="flex gap-4">
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-xs font-bold text-green-300">
                    {i + 1}
                  </div>
                  {i < 3 && <div className="w-px flex-1 bg-white/10 mt-2" />}
                </div>
                <div className="pb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base">{icon}</span>
                    <p className="font-semibold text-sm">{title}</p>
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

      </div>
    </div>
  );
}
