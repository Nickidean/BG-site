'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CATEGORIES, MONTHLY_LIMIT } from '@/lib/kudos/types';
import type { Recognition } from '@/lib/kudos/types';

interface Me {
  id: string;
  name: string;
  role: string;
  givenThisMonth: number;
  remainingThisMonth: number;
}

const categoryLabel = (value: string) =>
  CATEGORIES.find(c => c.value === value)?.label ?? value;

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function MinePage() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [recognitions, setRecognitions] = useState<Recognition[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'received' | 'given'>('received');

  useEffect(() => {
    Promise.all([
      fetch('/api/kudos/me').then(r => r.json()),
      fetch('/api/kudos/recognitions').then(r => r.json()),
    ]).then(([meData, recs]) => {
      if (!meData.id) { router.replace('/kudos'); return; }
      if (meData.role === 'admin') { router.replace('/kudos/admin'); return; }
      setMe(meData);
      if (Array.isArray(recs)) setRecognitions(recs);
    }).catch(() => router.replace('/kudos'))
      .finally(() => setLoading(false));
  }, [router]);

  async function handleLogout() {
    await fetch('/api/kudos/auth', { method: 'DELETE' });
    router.push('/kudos');
  }

  if (loading) return <LoadingScreen />;
  if (!me) return null;

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

  const received = recognitions.filter(r => r.recipientIds.includes(me.id));
  const given = recognitions.filter(r => r.giverId === me.id);
  const receivedThisMonth = received.filter(r => r.createdAt >= monthStart).length;

  const displayed = tab === 'received' ? received : given;

  return (
    <div className="min-h-screen px-4 py-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-green-400 text-xs font-medium">Bridport Youth Football Club</p>
          <h1 className="text-xl font-bold">My Kudos</h1>
          <p className="text-green-300 text-sm">{me.name}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/kudos/give" className="text-green-300 hover:text-white text-sm transition-colors">Give kudos</Link>
          <button onClick={handleLogout} className="text-green-400/60 hover:text-green-300 text-sm transition-colors">Log out</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard label="Given this month" value={`${me.givenThisMonth}/${MONTHLY_LIMIT}`} />
        <StatCard label="Received this month" value={String(receivedThisMonth)} />
        <StatCard label="Total received" value={String(received.length)} />
      </div>

      {/* Tabs */}
      <div className="flex bg-white/10 rounded-xl p-1 mb-5">
        {(['received', 'given'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors capitalize ${tab === t ? 'bg-green-500 text-white' : 'text-white/60 hover:text-white'}`}
          >
            {t} ({t === 'received' ? received.length : given.length})
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {tab === 'given' && (
          <Link
            href="/kudos/give"
            className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-400 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
          >
            🏆 Give kudos
          </Link>
        )}
        {displayed.length === 0 ? (
          <div className="text-center text-green-300/60 py-12 text-sm">
            {tab === 'received' ? 'No kudos received yet — they\'re coming!' : 'You haven\'t given any kudos yet.'}
          </div>
        ) : (
          displayed.map(r => (
            <RecognitionCard key={r.id} r={r} perspective={tab} myId={me.id} />
          ))
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/10 rounded-xl p-3 text-center border border-white/20">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-green-300 text-xs mt-0.5 leading-tight">{label}</div>
    </div>
  );
}

function RecognitionCard({ r, perspective, myId }: { r: Recognition; perspective: 'received' | 'given'; myId: string }) {
  const formatDate = (ts: number) =>
    new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="text-sm font-medium">
          {perspective === 'received'
            ? <span>From <span className="text-green-300">{r.giverName}</span></span>
            : <span>To <span className="text-green-300">{r.recipientNames.join(' & ')}</span></span>
          }
        </div>
        <span className="text-xs text-green-400/60 shrink-0">{formatDate(r.createdAt)}</span>
      </div>
      <span className="inline-block text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full mb-2 border border-green-500/30">
        {categoryLabel(r.category)}
      </span>
      <p className="text-sm text-white/80 leading-relaxed">"{r.note}"</p>
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
