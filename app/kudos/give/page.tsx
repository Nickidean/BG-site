'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CATEGORIES, MONTHLY_LIMIT } from '@/lib/kudos/types';

interface Me {
  id: string;
  name: string;
  role: string;
  givenThisMonth: number;
  remainingThisMonth: number;
}

interface CoachOption {
  id: string;
  name: string;
}

export default function GivePage() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [coaches, setCoaches] = useState<CoachOption[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const [showPinChange, setShowPinChange] = useState(false);
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [pinSuccess, setPinSuccess] = useState(false);
  const [pinLoading, setPinLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/kudos/me').then(r => r.json()),
      fetch('/api/kudos/coaches').then(r => r.json()),
    ]).then(([meData, coachesData]) => {
      if (!meData.id) { router.replace('/kudos'); return; }
      if (meData.role === 'admin') { router.replace('/kudos/admin'); return; }
      setMe(meData);
      if (Array.isArray(coachesData)) setCoaches(coachesData);
    }).catch(() => router.replace('/kudos'))
      .finally(() => setLoading(false));
  }, [router]);

  function toggleCoach(id: string) {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedIds.length || !category || !note.trim()) return;
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/kudos/recognitions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientIds: selectedIds, category, note }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to send'); return; }
      setSuccess(true);
      setMe(prev => prev ? { ...prev, givenThisMonth: prev.givenThisMonth + 1, remainingThisMonth: prev.remainingThisMonth - 1 } : prev);
      setSelectedIds([]);
      setCategory('');
      setNote('');
      setTimeout(() => setSuccess(false), 5000);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogout() {
    await fetch('/api/kudos/auth', { method: 'DELETE' });
    router.push('/kudos');
  }

  async function handlePinChange(e: React.FormEvent) {
    e.preventDefault();
    setPinError('');
    if (newPin !== confirmPin) { setPinError('New PINs do not match'); return; }
    setPinLoading(true);
    try {
      const res = await fetch('/api/kudos/me-pin', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPin, newPin }),
      });
      const data = await res.json();
      if (!res.ok) { setPinError(data.error || 'Failed to change PIN'); return; }
      setPinSuccess(true);
      setCurrentPin(''); setNewPin(''); setConfirmPin('');
      setTimeout(() => { setPinSuccess(false); setShowPinChange(false); }, 2000);
    } catch {
      setPinError('Something went wrong');
    } finally {
      setPinLoading(false);
    }
  }

  const [showMenu, setShowMenu] = useState(false);

  if (loading) return <LoadingScreen />;
  if (!me) return null;

  const remaining = me.remainingThisMonth;
  const canGive = remaining > 0;

  return (
    <div className="min-h-screen px-4 py-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-green-400 text-xs font-medium">Bridport Youth Football Club</p>
          <h1 className="text-xl font-bold">👋 Hey, {me.name.split(' ')[0]}</h1>
          <p className="text-green-300 text-sm">
            {remaining > 0
              ? `${remaining} of ${MONTHLY_LIMIT} kudos left this month`
              : "You've used all your kudos this month"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/kudos/mine"
            className="bg-green-500 hover:bg-green-400 text-white font-semibold text-sm px-4 py-2 rounded-xl transition-colors whitespace-nowrap"
          >
            My kudos
          </Link>
          <div className="relative">
            <button
              onClick={() => setShowMenu(m => !m)}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white text-lg"
            >
              ···
            </button>
            {showMenu && (
              <div className="absolute right-0 top-11 bg-green-900 border border-white/20 rounded-xl shadow-xl z-10 min-w-36 overflow-hidden">
                <button
                  onClick={() => { setShowPinChange(true); setShowMenu(false); }}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-white/10 transition-colors"
                >
                  Change PIN
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-white/10 transition-colors text-red-300"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Remaining indicator */}
      <div className="flex gap-2 mb-6">
        {Array.from({ length: MONTHLY_LIMIT }).map((_, i) => (
          <div key={i} className={`h-2 flex-1 rounded-full transition-colors ${i < me.givenThisMonth ? 'bg-green-400' : 'bg-white/20'}`} />
        ))}
      </div>

      {success && (
        <div className="bg-green-500/20 border border-green-400/30 text-green-200 rounded-xl px-4 py-3 mb-5 text-sm text-center">
          🎉 Kudos sent! It's been posted to the WhatsApp group.
        </div>
      )}

      {!canGive ? (
        <div className="bg-white/10 rounded-2xl p-6 text-center border border-white/20">
          <p className="text-4xl mb-3">🌟</p>
          <p className="font-semibold mb-1">{"You've"} given all {MONTHLY_LIMIT} kudos this month</p>
          <p className="text-green-300 text-sm">{"Your kudos reset on the 1st of next month. Check what you've given and received below."}</p>
          <Link href="/kudos/mine" className="inline-block mt-4 bg-green-500 hover:bg-green-400 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors">
            View my kudos
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Coach selection */}
          <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
            <label className="block text-sm font-semibold text-green-200 mb-3">Who deserves the kudos?</label>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {coaches.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => toggleCoach(c.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border ${
                    selectedIds.includes(c.id)
                      ? 'bg-green-500 border-green-400 text-white'
                      : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                  }`}
                >
                  {selectedIds.includes(c.id) ? '✓ ' : ''}{c.name}
                </button>
              ))}
            </div>
            {selectedIds.length > 0 && (
              <p className="text-green-300 text-xs mt-2">{selectedIds.length} coach{selectedIds.length > 1 ? 'es' : ''} selected</p>
            )}
          </div>

          {/* Category */}
          <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
            <label className="block text-sm font-semibold text-green-200 mb-3">What's it for?</label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors border text-left ${
                    category === cat.value
                      ? 'bg-green-500 border-green-400 text-white'
                      : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
            <label className="block text-sm font-semibold text-green-200 mb-2">
              Say why <span className="text-green-400/60 font-normal">(the more specific, the better)</span>
            </label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              maxLength={500}
              rows={3}
              placeholder="e.g. Always first to set up cones on a freezing morning, without being asked."
              required
              className="w-full bg-transparent text-white placeholder-white/30 text-base resize-none focus:outline-none"
            />
            <p className="text-green-400/50 text-xs text-right mt-1">{note.length}/500</p>
          </div>

          {error && <p className="text-red-300 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={submitting || !selectedIds.length || !category || !note.trim()}
            className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors text-base"
          >
            {submitting ? 'Sending…' : '🏆 Give kudos'}
          </button>
        </form>
      )}

      {/* Change PIN modal */}
      {showPinChange && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-green-900 border border-white/20 rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h2 className="font-bold text-lg mb-4">Change your PIN</h2>
            {pinSuccess ? (
              <p className="text-green-300 text-center py-4">✓ PIN changed successfully!</p>
            ) : (
              <form onSubmit={handlePinChange} className="space-y-3">
                <div>
                  <label className="block text-xs text-green-300 mb-1">Current PIN</label>
                  <input
                    type="password"
                    inputMode="numeric"
                    value={currentPin}
                    onChange={e => setCurrentPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 tracking-widest text-center text-base"
                  />
                </div>
                <div>
                  <label className="block text-xs text-green-300 mb-1">New PIN (4–6 digits)</label>
                  <input
                    type="password"
                    inputMode="numeric"
                    value={newPin}
                    onChange={e => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 tracking-widest text-center text-base"
                  />
                </div>
                <div>
                  <label className="block text-xs text-green-300 mb-1">Confirm new PIN</label>
                  <input
                    type="password"
                    inputMode="numeric"
                    value={confirmPin}
                    onChange={e => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 tracking-widest text-center text-base"
                  />
                </div>
                {pinError && <p className="text-red-300 text-sm">{pinError}</p>}
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => { setShowPinChange(false); setPinError(''); setCurrentPin(''); setNewPin(''); setConfirmPin(''); }}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg text-sm transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={pinLoading}
                    className="flex-1 bg-green-500 hover:bg-green-400 disabled:opacity-50 text-white font-semibold py-2 rounded-lg text-sm transition-colors"
                  >
                    {pinLoading ? 'Saving…' : 'Save PIN'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-green-300 text-sm animate-pulse">Loading…</div>
    </div>
  );
}
