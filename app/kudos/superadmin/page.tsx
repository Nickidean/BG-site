'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { LogEntry, LogType } from '@/lib/kudos/log';

interface Stats {
  totalCoaches: number;
  coachesWithEmail: number;
  totalRecognitions: number;
  recognitionsThisMonth: number;
  recognitionsToday: number;
  emailsSent: number;
  emailsFailed: number;
  loginsFailed: number;
  loginsToday: number;
}

const TYPE_META: Record<LogType, { label: string; colour: string; icon: string }> = {
  login:               { label: 'Login',          colour: 'text-green-300',  icon: '🔓' },
  login_failed:        { label: 'Login failed',   colour: 'text-red-300',    icon: '🚫' },
  kudos_sent:          { label: 'Kudos sent',      colour: 'text-yellow-300', icon: '🏆' },
  email_sent:          { label: 'Email sent',      colour: 'text-blue-300',   icon: '✉️' },
  email_failed:        { label: 'Email failed',    colour: 'text-red-300',    icon: '❌' },
  boost:               { label: 'Boost',           colour: 'text-yellow-200', icon: '⭐' },
  monthly_thanks:      { label: 'Monthly thanks',  colour: 'text-green-200',  icon: '💚' },
  pin_changed:         { label: 'PIN changed',     colour: 'text-white/60',   icon: '🔑' },
  coach_added:         { label: 'Coach added',     colour: 'text-green-300',  icon: '➕' },
  coach_removed:       { label: 'Coach removed',   colour: 'text-red-300',    icon: '➖' },
  recognition_deleted: { label: 'Deleted',         colour: 'text-red-300',    icon: '🗑️' },
  error:               { label: 'Error',           colour: 'text-red-400',    icon: '⚠️' },
};

const fmtTime = (ts: number) => new Date(ts).toLocaleString('en-GB', {
  day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit',
});

export default function SuperAdminPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<LogType | ''>('');
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    setRefreshing(true);
    try {
      const res = await fetch('/api/kudos/logs');
      if (res.status === 403) { router.replace('/kudos'); return; }
      const data = await res.json();
      setLogs(data.logs ?? []);
      setStats(data.stats ?? null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    // Only __admin__ can access this page
    fetch('/api/kudos/me').then(r => r.json()).then(d => {
      if (d.id !== '__admin__') { router.replace('/kudos'); return; }
      load();
    }).catch(() => router.replace('/kudos'));
  }, []);

  const filtered = filter ? logs.filter(l => l.type === filter) : logs;

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-green-300 text-sm animate-pulse">Loading…</div>
    </div>
  );

  return (
    <div className="min-h-screen px-4 py-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-green-400 text-xs font-medium">Bridport Youth Football Club</p>
          <h1 className="text-xl font-bold">System Monitor</h1>
          <p className="text-green-300 text-sm">Super admin · env account only</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            disabled={refreshing}
            className="bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white text-sm px-3 py-1.5 rounded-lg transition-colors"
          >
            {refreshing ? 'Refreshing…' : 'Refresh'}
          </button>
          <button
            onClick={async () => { await fetch('/api/kudos/auth', { method: 'DELETE' }); router.push('/kudos'); }}
            className="text-green-400/60 hover:text-green-300 text-sm transition-colors"
          >
            Log out
          </button>
        </div>
      </div>

      {/* Stats grid */}
      {stats && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Stat label="Active coaches" value={stats.totalCoaches} />
          <Stat label="Have email" value={stats.coachesWithEmail} note={`${stats.totalCoaches - stats.coachesWithEmail} missing`} warn={stats.totalCoaches - stats.coachesWithEmail > 0} />
          <Stat label="Total kudos" value={stats.totalRecognitions} />
          <Stat label="Kudos this month" value={stats.recognitionsThisMonth} />
          <Stat label="Kudos today" value={stats.recognitionsToday} />
          <Stat label="Logins today" value={stats.loginsToday} />
          <Stat label="Emails sent" value={stats.emailsSent} />
          <Stat label="Email failures" value={stats.emailsFailed} warn={stats.emailsFailed > 0} />
          <Stat label="Failed logins" value={stats.loginsFailed} warn={stats.loginsFailed > 0} />
        </div>
      )}

      {/* Log filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <button
          onClick={() => setFilter('')}
          className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${!filter ? 'bg-green-500 border-green-400 text-white' : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20'}`}
        >
          All ({logs.length})
        </button>
        {(['login_failed', 'email_failed', 'error', 'kudos_sent', 'email_sent', 'login'] as LogType[]).map(t => {
          const count = logs.filter(l => l.type === t).length;
          if (!count) return null;
          const meta = TYPE_META[t];
          return (
            <button
              key={t}
              onClick={() => setFilter(t === filter ? '' : t)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${filter === t ? 'bg-green-500 border-green-400 text-white' : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20'}`}
            >
              {meta.icon} {meta.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Log entries */}
      <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center text-green-300/40 py-12 text-sm">No entries</div>
        ) : (
          <div className="divide-y divide-white/5">
            {filtered.map(entry => {
              const meta = TYPE_META[entry.type] ?? { icon: '•', label: entry.type, colour: 'text-white/60' };
              return (
                <div key={entry.id} className="px-4 py-3 flex items-start gap-3">
                  <span className="text-base shrink-0 mt-0.5">{meta.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${meta.colour}`}>{entry.message}</p>
                    {entry.meta && Object.keys(entry.meta).length > 0 && (
                      <p className="text-xs text-white/30 mt-0.5 truncate">
                        {Object.entries(entry.meta)
                          .filter(([k]) => k !== 'ip')
                          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : String(v)}`)
                          .join(' · ')}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-white/30 shrink-0 mt-0.5">{fmtTime(entry.createdAt)}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <p className="text-center text-white/20 text-xs mt-4">Showing last {filtered.length} entries · 90 day retention</p>
    </div>
  );
}

function Stat({ label, value, note, warn }: { label: string; value: number; note?: string; warn?: boolean }) {
  return (
    <div className={`rounded-xl p-3 text-center border ${warn && value > 0 ? 'bg-red-500/10 border-red-500/20' : 'bg-white/10 border-white/20'}`}>
      <div className={`text-2xl font-bold ${warn && value > 0 ? 'text-red-300' : ''}`}>{value}</div>
      <div className="text-green-300 text-xs mt-0.5 leading-tight">{label}</div>
      {note && <div className={`text-xs mt-0.5 ${warn ? 'text-red-300/70' : 'text-white/40'}`}>{note}</div>}
    </div>
  );
}
