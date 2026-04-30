"use client";

import { useState } from "react";

interface CheckEntry {
  id: string;
  timestamp: string;
  contentType: string;
  audience: string;
  copyPreview: string;
  copyLength: number;
  score: number;
  copied: boolean;
}

interface Stats {
  total: number;
  today: number;
  copyRate: number;
  recent: CheckEntry[];
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 text-center">
      <div className="text-3xl font-black text-[#0085CA]">{value}</div>
      <div className="text-xs text-gray-500 mt-1 font-medium">{label}</div>
    </div>
  );
}

function scoreColour(score: number) {
  if (score >= 7) return "text-[#1D9E75]";
  if (score >= 5) return "text-[#BA7517]";
  return "text-[#A32D2D]";
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/stats?password=${encodeURIComponent(password)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setStats(data as Stats);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start px-6 py-12"
      style={{ backgroundImage: "url('/bg-texture.png')", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="fixed inset-0 bg-[#003d6b]/75 pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <img src="/bg-flame.png" alt="British Gas" className="w-12 h-12 object-contain" />
          <div>
            <h1 className="text-white font-bold text-xl leading-tight">Admin</h1>
            <p className="text-white/50 text-xs">Tone of Voice Checker</p>
          </div>
        </div>

        {/* Password form */}
        {!stats && (
          <div className="bg-white rounded-2xl shadow-xl p-6 space-y-4 max-w-sm">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0085CA] focus:border-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchStats()}
              placeholder="Enter admin password"
            />
            {error && <p className="text-sm text-[#A32D2D]">{error}</p>}
            <button
              className="w-full bg-[#0085CA] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#006ba3] transition-colors disabled:opacity-40"
              onClick={fetchStats}
              disabled={loading || !password}
            >
              {loading ? "Loading…" : "View stats"}
            </button>
          </div>
        )}

        {/* Stats */}
        {stats && (
          <div className="space-y-5">
            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-4">
              <StatCard label="Total checks" value={stats.total} />
              <StatCard label="Checks today" value={stats.today} />
              <StatCard label="Rewrite copied" value={`${stats.copyRate}%`} />
            </div>

            {/* Recent checks table */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-800">Recent checks</h2>
                <p className="text-xs text-gray-400 mt-0.5">Most recent 50</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <th className="px-4 py-3 text-left">Time</th>
                      <th className="px-4 py-3 text-left">Type</th>
                      <th className="px-4 py-3 text-left">Copy preview</th>
                      <th className="px-4 py-3 text-center">Score</th>
                      <th className="px-4 py-3 text-center">Copied?</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {stats.recent.map((entry) => (
                      <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">
                          {new Date(entry.timestamp).toLocaleString("en-GB", {
                            day: "numeric", month: "short",
                            hour: "2-digit", minute: "2-digit",
                          })}
                        </td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap text-xs">
                          {entry.contentType || <span className="text-gray-300">—</span>}
                        </td>
                        <td
                          className="px-4 py-3 text-gray-700 max-w-sm cursor-pointer"
                          onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                        >
                          <span className={expandedId === entry.id ? "whitespace-pre-wrap" : "line-clamp-2"}>
                            {entry.copyPreview}
                          </span>
                          <span className="text-xs text-gray-400 ml-1">({entry.copyLength} chars)</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`font-bold ${scoreColour(entry.score)}`}>{entry.score}/10</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {entry.copied
                            ? <span className="text-[#1D9E75] font-bold">✓</span>
                            : <span className="text-gray-300">—</span>}
                        </td>
                      </tr>
                    ))}
                    {stats.recent.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-gray-400 text-sm">No checks yet</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
