'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CATEGORIES, MONTHLY_LIMIT, isAdminRole } from '@/lib/kudos/types';
import type { Recognition, Boost } from '@/lib/kudos/types';

interface Me { id: string; name: string; role: string; isEnvAdmin?: boolean; }

interface CoachSummary {
  id: string;
  name: string;
  role: string;
  totalGiven: number;
  totalReceived: number;
  quarterReceived: number;
}

interface AdminData {
  recognitions: Recognition[];
  summary: CoachSummary[];
}

interface CoachFull {
  id: string;
  name: string;
  role: string;
  pin: string;
  email?: string;
  createdAt: number;
}

const catLabel = (v: string) => CATEGORIES.find(c => c.value === v)?.label ?? v;
const fmtDate = (ts: number) => new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

type AdminTab = 'feed' | 'leaderboard' | 'coaches';

export default function AdminPage() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [data, setData] = useState<AdminData | null>(null);
  const [coaches, setCoaches] = useState<CoachFull[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<AdminTab>('feed');
  const [filterCoach, setFilterCoach] = useState('');

  // Bulk add
  const [bulkNames, setBulkNames] = useState('');
  const [bulkPreview, setBulkPreview] = useState<{ name: string; pin: string }[]>([]);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkDone, setBulkDone] = useState(false);

  // Add coach form
  const [newName, setNewName] = useState('');
  const [newPin, setNewPin] = useState('');
  const [newRole, setNewRole] = useState<'coach' | 'admin' | 'chairman'>('coach');
  const [newEmail, setNewEmail] = useState('');
  const [addError, setAddError] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [addSuccess, setAddSuccess] = useState('');

  // Edit coach
  const [editId, setEditId] = useState<string | null>(null);
  const [editPin, setEditPin] = useState('');

  // Boost recognition
  const [boostId, setBoostId] = useState<string | null>(null);
  const [boostComment, setBoostComment] = useState('');
  const [boostLoading, setBoostLoading] = useState(false);

  // Monthly thanks
  const [monthlyThanksSent, setMonthlyThanksSent] = useState(false);
  const [monthlyThanksLoading, setMonthlyThanksLoading] = useState(false);

  const fetchData = useCallback(async () => {
    const params = new URLSearchParams();
    if (filterCoach) params.set('coach', filterCoach);
    const [meRes, adminRes, coachRes] = await Promise.all([
      fetch('/api/kudos/me').then(r => r.json()),
      fetch(`/api/kudos/admin?${params}`).then(r => r.json()),
      fetch('/api/kudos/coaches').then(r => r.json()),
    ]);
    return { meRes, adminRes, coachRes };
  }, [filterCoach]);

  useEffect(() => {
    fetchData().then(({ meRes, adminRes, coachRes }) => {
      if (!meRes.id) { router.replace('/kudos'); return; }
      if (!isAdminRole(meRes.role) && meRes.id !== '__admin__') { router.replace('/kudos/give'); return; }
      setMe(meRes);
      if (adminRes.recognitions) setData(adminRes);
      if (Array.isArray(coachRes)) setCoaches(coachRes);
    }).catch(() => router.replace('/kudos'))
      .finally(() => setLoading(false));

    fetch('/api/kudos/monthly-thanks').then(r => r.json()).then(d => setMonthlyThanksSent(!!d.sent)).catch(() => {});
  }, [fetchData, router]);

  async function handleSendMonthlyThanks() {
    if (!confirm('Send a monthly thank-you email to all coaches? This can only be sent once per month.')) return;
    setMonthlyThanksLoading(true);
    try {
      const res = await fetch('/api/kudos/monthly-thanks', { method: 'POST' });
      const d = await res.json();
      if (res.ok) setMonthlyThanksSent(true);
      else alert(d.error || 'Failed to send');
    } finally {
      setMonthlyThanksLoading(false);
    }
  }

  async function handleBoost(id: string) {
    if (!boostComment.trim()) return;
    setBoostLoading(true);
    try {
      const res = await fetch('/api/kudos/recognitions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, boostComment }),
      });
      const d = await res.json();
      if (res.ok && d.recognition) {
        setData(prev => prev ? {
          ...prev,
          recognitions: prev.recognitions.map(r => r.id === id ? d.recognition : r),
        } : prev);
        setBoostId(null);
        setBoostComment('');
      }
    } finally {
      setBoostLoading(false);
    }
  }

  async function handleDeleteAll() {
    if (!confirm(`Remove ALL ${data?.recognitions.length} recognitions? This cannot be undone.`)) return;
    await fetch('/api/kudos/recognitions', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    const params = new URLSearchParams();
    if (filterCoach) params.set('coach', filterCoach);
    const adminRes = await fetch(`/api/kudos/admin?${params}`).then(r => r.json());
    if (adminRes.recognitions) setData(adminRes);
  }

  async function handleDeleteRecognition(id: string) {
    if (!confirm('Remove this recognition? This cannot be undone.')) return;
    await fetch('/api/kudos/recognitions', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    // Re-fetch everything so the leaderboard updates too
    const params = new URLSearchParams();
    if (filterCoach) params.set('coach', filterCoach);
    const adminRes = await fetch(`/api/kudos/admin?${params}`).then(r => r.json());
    if (adminRes.recognitions) setData(adminRes);
  }

  function generatePin() {
    return String(Math.floor(100000 + Math.random() * 900000));
  }

  function handleBulkPreview() {
    const names = bulkNames.split('\n').map(n => n.trim()).filter(Boolean);
    setBulkPreview(names.map(name => ({ name, pin: generatePin() })));
    setBulkDone(false);
  }

  async function handleBulkAdd() {
    setBulkLoading(true);
    try {
      await Promise.all(bulkPreview.map(({ name, pin }) =>
        fetch('/api/kudos/coaches', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, pin, role: 'coach' }),
        })
      ));
      setBulkDone(true);
      const updatedCoaches = await fetch('/api/kudos/coaches').then(r => r.json());
      if (Array.isArray(updatedCoaches)) setCoaches(updatedCoaches);
    } finally {
      setBulkLoading(false);
    }
  }

  function downloadBulkCSV() {
    const rows = [['Name', 'PIN'], ...bulkPreview.map(c => [c.name, c.pin])];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bridport-yfc-coach-pins.csv';
    a.click();
  }

  async function handleLogout() {
    await fetch('/api/kudos/auth', { method: 'DELETE' });
    router.push('/kudos');
  }

  async function handleAddCoach(e: React.FormEvent) {
    e.preventDefault();
    setAddError('');
    setAddLoading(true);
    try {
      const res = await fetch('/api/kudos/coaches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName, pin: newPin, role: newRole, email: newEmail }),
      });
      const d = await res.json();
      if (!res.ok) { setAddError(d.error || 'Failed'); return; }
      setAddSuccess(`${newName} added successfully`);
      setNewName(''); setNewPin(''); setNewRole('coach'); setNewEmail('');
      setTimeout(() => setAddSuccess(''), 4000);
      const updatedCoaches = await fetch('/api/kudos/coaches').then(r => r.json());
      if (Array.isArray(updatedCoaches)) setCoaches(updatedCoaches);
    } catch {
      setAddError('Something went wrong');
    } finally {
      setAddLoading(false);
    }
  }

  async function handleResetPin(id: string) {
    if (!editPin || !/^\d{4,6}$/.test(editPin)) { alert('Enter a valid 4–6 digit PIN'); return; }
    const res = await fetch('/api/kudos/coaches', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, pin: editPin }),
    });
    if (res.ok) {
      setEditId(null); setEditPin('');
      const updatedCoaches = await fetch('/api/kudos/coaches').then(r => r.json());
      if (Array.isArray(updatedCoaches)) setCoaches(updatedCoaches);
    }
  }

  async function handleDeactivate(id: string, name: string) {
    if (!confirm(`Remove ${name} from the app? Their recognition history will be kept.`)) return;
    await fetch('/api/kudos/coaches', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, active: false }),
    });
    const updatedCoaches = await fetch('/api/kudos/coaches').then(r => r.json());
    if (Array.isArray(updatedCoaches)) setCoaches(updatedCoaches);
  }

  function exportCSV() {
    if (!data) return;
    const rows = [
      ['Date', 'From', 'To', 'Category', 'Note'],
      ...data.recognitions.map(r => [
        fmtDate(r.createdAt),
        r.giverName,
        r.recipientNames.join(', '),
        catLabel(r.category),
        `"${r.note.replace(/"/g, '""')}"`,
      ]),
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kudos-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  }

  if (loading) return <LoadingScreen />;
  if (!me || !data) return null;

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const feedRecs = data.recognitions;

  return (
    <div className="min-h-screen px-4 py-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-green-400 text-xs font-medium">Bridport Youth Football Club</p>
          <h1 className="text-xl font-bold">{"Chairman's View"}</h1>
          <p className="text-green-300 text-sm">{me.name}</p>
        </div>
        <div className="flex items-center gap-2">
          {me.id !== '__admin__' && (
            <Link
              href="/kudos/give"
              className="bg-green-500 hover:bg-green-400 text-white font-semibold text-sm px-4 py-2 rounded-xl transition-colors whitespace-nowrap"
            >
              Give kudos
            </Link>
          )}
          <button onClick={handleLogout} className="text-green-400/60 hover:text-green-300 text-sm transition-colors">Log out</button>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard label="Total recognitions" value={String(data.recognitions.length)} />
        <StatCard label="This month" value={String(data.recognitions.filter(r => r.createdAt >= monthStart).length)} />
        <StatCard label="Active coaches" value={String(coaches.length)} />
      </div>

      {/* Monthly thanks — chairman only */}
      {(me.role === 'chairman' || me.id === '__admin__') && (
        <div className={`rounded-2xl p-4 border mb-6 flex items-center justify-between gap-4 ${monthlyThanksSent ? 'bg-green-500/10 border-green-500/20' : 'bg-white/10 border-white/20'}`}>
          <div>
            <p className="font-semibold text-sm">Monthly thank-you to all coaches</p>
            <p className="text-green-300/70 text-xs mt-0.5">
              {monthlyThanksSent ? '✓ Sent this month' : 'Email every coach to thank them for their efforts this month'}
            </p>
          </div>
          <button
            onClick={handleSendMonthlyThanks}
            disabled={monthlyThanksSent || monthlyThanksLoading}
            className="bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm px-4 py-2 rounded-xl transition-colors whitespace-nowrap"
          >
            {monthlyThanksLoading ? 'Sending…' : monthlyThanksSent ? 'Sent ✓' : 'Send thanks'}
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex bg-white/10 rounded-xl p-1 mb-6 gap-1">
        {(['feed', 'leaderboard', 'coaches'] as AdminTab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors capitalize ${tab === t ? 'bg-green-500 text-white' : 'text-white/60 hover:text-white'}`}
          >
            {t === 'feed' ? 'Recognition feed' : t === 'leaderboard' ? 'Leaderboard' : 'Manage coaches'}
          </button>
        ))}
      </div>

      {/* FEED TAB */}
      {tab === 'feed' && (
        <div>
          <div className="flex items-center justify-between mb-4 gap-3">
            <select
              value={filterCoach}
              onChange={e => setFilterCoach(e.target.value)}
              className="bg-white/10 border border-white/20 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 flex-1"
            >
              <option value="" className="bg-green-900">All coaches</option>
              {coaches.map(c => <option key={c.id} value={c.id} className="bg-green-900">{c.name}</option>)}
            </select>
            <button
              onClick={exportCSV}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm rounded-lg px-4 py-2 transition-colors whitespace-nowrap"
            >
              Export CSV
            </button>
            <button
              onClick={handleDeleteAll}
              disabled={!data?.recognitions.length}
              className="bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 text-red-300 hover:text-red-200 text-sm rounded-lg px-4 py-2 transition-colors whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Remove all
            </button>
          </div>

          <div className="space-y-3">
            {feedRecs.length === 0 ? (
              <div className="text-center text-green-300/60 py-12 text-sm">No recognitions yet.</div>
            ) : (
              feedRecs.map(r => (
                <div key={r.id} className="bg-white/10 rounded-2xl p-4 border border-white/20">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="text-sm font-medium">
                      <span className="text-green-300">{r.giverName}</span>
                      <span className="text-white/50 mx-1">→</span>
                      <span className="text-green-300">{r.recipientNames.join(' & ')}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-green-400/60">{fmtDate(r.createdAt)}</span>
                      <button
                        onClick={() => { setBoostId(boostId === r.id ? null : r.id); setBoostComment(''); }}
                        className="text-xs text-yellow-300 hover:text-yellow-200 bg-yellow-500/10 hover:bg-yellow-500/20 px-2 py-0.5 rounded-lg transition-colors"
                      >
                        ⭐ Boost
                      </button>
                      <button
                        onClick={() => handleDeleteRecognition(r.id)}
                        className="text-xs text-red-300 hover:text-red-200 bg-white/10 hover:bg-red-500/20 px-2 py-0.5 rounded-lg transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <span className="inline-block text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full mb-2 border border-green-500/30">{catLabel(r.category)}</span>
                  <p className="text-sm text-white/80">"{r.note}"</p>

                  {/* Existing boosts */}
                  {r.boosts?.map((b: Boost, i: number) => (
                    <div key={i} className="mt-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-3 py-2">
                      <p className="text-xs text-yellow-300 font-medium mb-1">⭐ Chairman's boost</p>
                      <p className="text-sm text-white/80">"{b.comment}"</p>
                    </div>
                  ))}

                  {/* Boost form */}
                  {boostId === r.id && (
                    <div className="mt-3 space-y-2">
                      <textarea
                        value={boostComment}
                        onChange={e => setBoostComment(e.target.value)}
                        rows={2}
                        maxLength={300}
                        placeholder="Add a note to boost this recognition — the recipient will be emailed."
                        className="w-full bg-white/10 border border-yellow-500/30 text-white placeholder-white/30 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleBoost(r.id)}
                          disabled={boostLoading || !boostComment.trim()}
                          className="bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-white font-semibold px-4 py-1.5 rounded-lg text-sm transition-colors"
                        >
                          {boostLoading ? 'Sending…' : 'Send boost'}
                        </button>
                        <button
                          onClick={() => { setBoostId(null); setBoostComment(''); }}
                          className="text-white/50 hover:text-white text-sm px-2 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* LEADERBOARD TAB */}
      {tab === 'leaderboard' && (
        <div>
          <p className="text-green-300/60 text-xs mb-4">
            Quarter = current calendar quarter. Sorted by total received.
          </p>
          <div className="bg-white/10 rounded-2xl border border-white/20 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-3 text-green-300 font-medium">Coach</th>
                  <th className="text-right p-3 text-green-300 font-medium">Received</th>
                  <th className="text-right p-3 text-green-300 font-medium">This Qtr</th>
                  <th className="text-right p-3 text-green-300 font-medium">Given</th>
                </tr>
              </thead>
              <tbody>
                {data.summary.map((s, i) => (
                  <tr key={s.id} className="border-b border-white/5 last:border-0">
                    <td className="p-3 flex items-center gap-2">
                      {i === 0 && <span>🥇</span>}
                      {i === 1 && <span>🥈</span>}
                      {i === 2 && <span>🥉</span>}
                      {i > 2 && <span className="text-white/30 w-5 text-center">{i + 1}</span>}
                      <span>{s.name}</span>
                      {s.role === 'admin' && <span className="text-xs text-green-400/50">(admin)</span>}
                    </td>
                    <td className="p-3 text-right font-semibold">{s.totalReceived}</td>
                    <td className="p-3 text-right text-green-300">{s.quarterReceived}</td>
                    <td className="p-3 text-right text-white/50">{s.totalGiven}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* COACHES TAB */}
      {tab === 'coaches' && (
        <div className="space-y-6">
          {/* Bulk add */}
          <div className="bg-white/10 rounded-2xl p-5 border border-white/20">
            <h2 className="font-semibold mb-1">Bulk add coaches</h2>
            <p className="text-green-300/70 text-xs mb-4">Paste one name per line — PINs are auto-generated. Download the list to share with coaches.</p>
            {!bulkPreview.length ? (
              <div className="space-y-3">
                <textarea
                  value={bulkNames}
                  onChange={e => setBulkNames(e.target.value)}
                  rows={6}
                  placeholder={"Dave Smith\nSarah Jones\nMike Taylor"}
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
                />
                <button
                  onClick={handleBulkPreview}
                  disabled={!bulkNames.trim()}
                  className="bg-green-500 hover:bg-green-400 disabled:opacity-50 text-white font-semibold px-5 py-2 rounded-lg text-sm transition-colors"
                >
                  Generate PINs
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-white/5 rounded-xl overflow-hidden border border-white/10">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left p-3 text-green-300 font-medium">Name</th>
                        <th className="text-left p-3 text-green-300 font-medium">PIN</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bulkPreview.map((c, i) => (
                        <tr key={i} className="border-b border-white/5 last:border-0">
                          <td className="p-3">{c.name}</td>
                          <td className="p-3 font-mono">{c.pin}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {bulkDone ? (
                  <div className="space-y-2">
                    <p className="text-green-300 text-sm">✓ {bulkPreview.length} coaches added!</p>
                    <div className="flex gap-2">
                      <button onClick={downloadBulkCSV} className="bg-green-500 hover:bg-green-400 text-white font-semibold px-5 py-2 rounded-lg text-sm transition-colors">
                        Download CSV
                      </button>
                      <button onClick={() => { setBulkPreview([]); setBulkNames(''); setBulkDone(false); }} className="bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded-lg text-sm transition-colors">
                        Add more
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={handleBulkAdd} disabled={bulkLoading} className="bg-green-500 hover:bg-green-400 disabled:opacity-50 text-white font-semibold px-5 py-2 rounded-lg text-sm transition-colors">
                      {bulkLoading ? 'Adding…' : `Add all ${bulkPreview.length} coaches`}
                    </button>
                    <button onClick={downloadBulkCSV} className="bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded-lg text-sm transition-colors">
                      Download CSV
                    </button>
                    <button onClick={() => setBulkPreview([])} className="text-green-400/60 hover:text-green-300 text-sm transition-colors px-2">
                      Back
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Add coach form */}
          <div className="bg-white/10 rounded-2xl p-5 border border-white/20">
            <h2 className="font-semibold mb-4">Add new coach</h2>
            <form onSubmit={handleAddCoach} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-green-300 mb-1">Full name</label>
                  <input
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    required
                    placeholder="e.g. Dave Smith"
                    className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-green-300 mb-1">PIN (6 digits)</label>
                  <input
                    value={newPin}
                    onChange={e => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    inputMode="numeric"
                    placeholder="e.g. 1234"
                    className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-green-300 mb-1">Email <span className="text-green-400/50">(for kudos notifications)</span></label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  placeholder="coach@example.com"
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div>
                <label className="block text-xs text-green-300 mb-1">Role</label>
                <select
                  value={newRole}
                  onChange={e => setNewRole(e.target.value as 'coach' | 'admin')}
                  className="bg-white/10 border border-white/20 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  <option value="coach" className="bg-green-900">Coach</option>
                  <option value="admin" className="bg-green-900">Admin</option>
                  <option value="chairman" className="bg-green-900">Chairman</option>
                </select>
              </div>
              {addError && <p className="text-red-300 text-sm">{addError}</p>}
              {addSuccess && <p className="text-green-300 text-sm">{addSuccess}</p>}
              <button
                type="submit"
                disabled={addLoading}
                className="bg-green-500 hover:bg-green-400 disabled:opacity-50 text-white font-semibold px-5 py-2 rounded-lg text-sm transition-colors"
              >
                {addLoading ? 'Adding…' : 'Add coach'}
              </button>
            </form>
          </div>

          {/* Coach list */}
          <div className="bg-white/10 rounded-2xl border border-white/20 overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="font-semibold">Active coaches ({coaches.length})</h2>
              <button
                onClick={() => {
                  const rows = [['Name', 'PIN', 'Email', 'Role'], ...coaches.map(c => [c.name, c.pin, c.email ?? '', c.role])];
                  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
                  const a = document.createElement('a');
                  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
                  a.download = 'bridport-yfc-coaches.csv';
                  a.click();
                }}
                className="text-xs bg-white/10 hover:bg-white/20 border border-white/20 text-white px-3 py-1.5 rounded-lg transition-colors"
              >
                Download all PINs
              </button>
            </div>
            <div className="divide-y divide-white/5">
              {coaches.map(c => (
                <div key={c.id} className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <span className="font-medium text-sm">{c.name}</span>
                      {c.role === 'admin' && <span className="ml-2 text-xs text-green-400/70 bg-green-500/10 px-1.5 py-0.5 rounded">admin</span>}
                      {c.role === 'chairman' && <span className="ml-2 text-xs text-yellow-300/80 bg-yellow-500/10 px-1.5 py-0.5 rounded">chairman</span>}
                      <p className="text-xs text-green-400/50 mt-0.5">PIN: {c.pin}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setEditId(editId === c.id ? null : c.id); setEditPin(''); }}
                        className="text-xs text-green-300 hover:text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg transition-colors"
                      >
                        Reset PIN
                      </button>
                      <button
                        onClick={() => handleDeactivate(c.id, c.name)}
                        className="text-xs text-red-300 hover:text-red-200 bg-white/10 hover:bg-red-500/20 px-2.5 py-1 rounded-lg transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  {editId === c.id && (
                    <div className="mt-3 flex gap-2">
                      <input
                        value={editPin}
                        onChange={e => setEditPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        inputMode="numeric"
                        placeholder="New PIN"
                        className="bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 w-32"
                      />
                      <button
                        onClick={() => handleResetPin(c.id)}
                        className="bg-green-500 hover:bg-green-400 text-white text-sm px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Save
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
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

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-green-300 text-sm animate-pulse">Loading…</div>
    </div>
  );
}
