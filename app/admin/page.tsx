"use client";

import { useState, useCallback } from "react";

interface ContentTypeStat {
  count: number;
  copies: number;
  totalScore: number;
}

interface RequestEntry {
  id: string;
  timestamp: string;
  contentType: string;
  audience: string;
  inputLength: number;
  overallScore: number;
  warmScore: number;
  workingScore: number;
  verdict: string;
  copied: boolean;
}

interface StatsData {
  totalRequests: number;
  totalCopies: number;
  requestsToday: number;
  copyRate: number;
  byContentType: Record<string, ContentTypeStat>;
  recent: RequestEntry[];
}

function scoreColour(score: number) {
  if (score >= 7) return "text-[#1D9E75]";
  if (score >= 5) return "text-[#BA7517]";
  return "text-[#A32D2D]";
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow">
      <div className="text-3xl font-black text-gray-900">{value}</div>
      <div className="text-sm font-semibold text-gray-700 mt-1">{label}</div>
      {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
    </div>
  );
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [token, setToken] = useState("");

  const fetchStats = useCallback(async (pw: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/stats", {
        headers: { "x-admin-token": pw },
      });
      const data = await res.json();
      if (res.status === 401) { setError("Wrong password."); return; }
      if (res.status === 503) { setError(data.error ?? "Server not configured."); return; }
      if (!res.ok) { setError(data.error ?? "Failed to load stats."); return; }
      setStats(data);
      setAuthed(true);
      setToken(pw);
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = () => fetchStats(token);

  if (!authed) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6"
        style={{
          backgroundImage: "url('/bg-texture.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="fixed inset-0 bg-[#003d6b]/75 pointer-events-none" />
        <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm">
          <div className="flex items-center gap-3 mb-6">
            <img src="/bg-logo.png" alt="British Gas" className="h-8 w-auto object-contain" />
            <div>
              <div className="font-bold text-gray-900">Admin</div>
              <div className="text-xs text-gray-400">Copy Checker dashboard</div>
            </div>
          </div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
          <input
            type="password"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0085CA] focus:border-transparent mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchStats(password)}
            placeholder="Enter admin password"
            autoFocus
          />
          {error && <p className="text-sm text-[#A32D2D] mb-3">{error}</p>}
          <button
            className="btn-primary w-full"
            onClick={() => fetchStats(password)}
            disabled={loading || !password}
          >
            {loading ? "Loading…" : "View dashboard"}
          </button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const contentTypeRows = Object.entries(stats.byContentType).sort(
    ([, a], [, b]) => b.count - a.count
  );

  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage: "url('/bg-texture.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="fixed inset-0 bg-[#003d6b]/75 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/bg-logo.png" alt="British Gas" className="h-9 w-auto object-contain" />
            <div>
              <h1 className="text-white font-bold text-lg leading-tight">Admin Dashboard</h1>
              <p className="text-white/50 text-xs">Copy Checker · usage & success metrics</p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="text-sm text-white/70 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <svg className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Total requests" value={stats.totalRequests} />
          <StatCard label="Rewrites copied" value={stats.totalCopies} sub="success metric" />
          <StatCard label="Copy rate" value={`${stats.copyRate}%`} sub="copies ÷ requests" />
          <StatCard label="Today" value={stats.requestsToday} sub="requests" />
        </div>

        {/* Copy rate bar */}
        <div className="bg-white rounded-2xl p-5 shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-gray-800">Rewrite copy rate</span>
            <span className="text-sm text-gray-500">{stats.copyRate}%</span>
          </div>
          <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#1D9E75] transition-all duration-700"
              style={{ width: `${stats.copyRate}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {stats.totalCopies} of {stats.totalRequests} users copied the suggested rewrite
          </p>
        </div>

        {/* By content type */}
        {contentTypeRows.length > 0 && (
          <div className="bg-white rounded-2xl p-5 shadow">
            <h2 className="font-semibold text-gray-800 mb-4">Requests by content type</h2>
            <div className="space-y-3">
              {contentTypeRows.map(([type, stat]) => {
                const pct = stats.totalRequests > 0 ? Math.round((stat.count / stats.totalRequests) * 100) : 0;
                const avgScore = stat.count > 0 ? Math.round(stat.totalScore / stat.count * 10) / 10 : 0;
                const typeCopyRate = stat.count > 0 ? Math.round((stat.copies / stat.count) * 100) : 0;
                return (
                  <div key={type}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700 truncate mr-2">{type}</span>
                      <div className="flex items-center gap-3 text-xs text-gray-400 flex-shrink-0">
                        <span className={`font-semibold ${scoreColour(avgScore)}`}>avg {avgScore}/10</span>
                        <span>{typeCopyRate}% copied</span>
                        <span className="font-semibold text-gray-600">{stat.count}</span>
                      </div>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#0085CA] transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent requests */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Recent requests</h2>
            <p className="text-xs text-gray-400 mt-0.5">Last {stats.recent.length} checks</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wide">
                  <th className="px-5 py-3 text-left font-medium">When</th>
                  <th className="px-5 py-3 text-left font-medium">Content type</th>
                  <th className="px-5 py-3 text-left font-medium">Audience</th>
                  <th className="px-4 py-3 text-center font-medium">Score</th>
                  <th className="px-5 py-3 text-left font-medium">Verdict</th>
                  <th className="px-4 py-3 text-center font-medium">Copied</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent.map((r, i) => (
                  <tr key={r.id} className={`border-b border-gray-50 ${i % 2 === 0 ? "" : "bg-gray-50/50"}`}>
                    <td className="px-5 py-3 text-gray-400 text-xs whitespace-nowrap">{timeAgo(r.timestamp)}</td>
                    <td className="px-5 py-3 text-gray-700 whitespace-nowrap">{r.contentType}</td>
                    <td className="px-5 py-3 text-gray-500 text-xs whitespace-nowrap">{r.audience}</td>
                    <td className={`px-4 py-3 text-center font-bold ${scoreColour(r.overallScore)}`}>{r.overallScore}/10</td>
                    <td className="px-5 py-3 text-gray-600 text-xs max-w-[160px] truncate">{r.verdict}</td>
                    <td className="px-4 py-3 text-center">
                      {r.copied ? (
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#1D9E75]/15">
                          <svg className="w-3 h-3 text-[#1D9E75]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      ) : (
                        <span className="text-gray-200">–</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {stats.recent.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-10">No requests yet.</p>
            )}
          </div>
        </div>

        <footer className="text-center text-white/30 text-xs pb-4">
          British Gas internal tool · admin view
        </footer>
      </div>
    </div>
  );
}
