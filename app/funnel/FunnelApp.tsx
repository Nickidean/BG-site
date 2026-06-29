'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Journey, JourneySummary } from '@/lib/funnel/types';
import { Editor } from './components/Editor';
import { api } from './lib/client';

export function FunnelApp({ authRequired }: { authRequired: boolean }) {
  const [journeys, setJourneys] = useState<JourneySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [current, setCurrent] = useState<Journey | null>(null);
  const [opening, setOpening] = useState(false);

  const refresh = useCallback(() => {
    setLoading(true);
    api
      .listJourneys()
      .then((d) => setJourneys(d.journeys))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function create() {
    const name = window.prompt('Name this journey', 'New journey');
    if (name == null) return;
    try {
      const { journey } = await api.createJourney(name.trim() || 'Untitled journey');
      setCurrent(journey);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create');
    }
  }

  async function open(id: string) {
    setOpening(true);
    try {
      const { journey } = await api.getJourney(id);
      setCurrent(journey);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to open');
    } finally {
      setOpening(false);
    }
  }

  async function rename(id: string, currentName: string) {
    const name = window.prompt('Rename journey', currentName);
    if (name == null || !name.trim()) return;
    await api.renameJourney(id, name.trim()).catch(() => {});
    setJourneys((js) => js.map((j) => (j.id === id ? { ...j, name: name.trim() } : j)));
  }

  async function remove(id: string, name: string) {
    if (!window.confirm(`Delete “${name}”? This cannot be undone.`)) return;
    await api.deleteJourney(id).catch(() => {});
    setJourneys((js) => js.filter((j) => j.id !== id));
  }

  if (current) {
    return (
      <Editor
        initialJourney={current}
        onBack={() => {
          setCurrent(null);
          refresh();
        }}
        onMeta={(id, name) =>
          setJourneys((js) => js.map((j) => (j.id === id ? { ...j, name } : j)))
        }
      />
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Journey Funnels</h1>
          <p className="mt-1 text-sm text-gray-500">
            Map a customer journey as a visual funnel, per device.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {authRequired && (
            <button
              type="button"
              onClick={() => api.logout().then(() => window.location.reload())}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0085CA]"
            >
              Sign out
            </button>
          )}
          <button type="button" onClick={create} className="btn-primary !px-4 !py-2 !text-sm">
            + New journey
          </button>
        </div>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-[#A32D2D]/10 px-4 py-2 text-sm text-[#A32D2D]">{error}</p>
      )}

      {loading || opening ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : journeys.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 px-6 py-16 text-center">
          <p className="text-gray-500">No journeys yet.</p>
          <button
            type="button"
            onClick={create}
            className="mt-4 font-semibold text-[#0085CA] hover:underline focus:outline-none focus:ring-2 focus:ring-[#0085CA] rounded"
          >
            Create your first journey
          </button>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {journeys.map((j) => (
            <li
              key={j.id}
              className="group flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <button
                type="button"
                onClick={() => open(j.id)}
                className="text-left focus:outline-none focus:ring-2 focus:ring-[#0085CA] rounded"
              >
                <h2 className="font-bold">{j.name}</h2>
                <p className="mt-1 text-xs text-gray-400">
                  Updated {new Date(j.updatedAt).toLocaleDateString('en-GB')}
                  {j.shareId ? ' · shared' : ''}
                </p>
              </button>
              <div className="mt-4 flex gap-3 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => open(j.id)}
                  className="text-[#0085CA] hover:underline focus:outline-none focus:ring-2 focus:ring-[#0085CA] rounded"
                >
                  Open
                </button>
                <button
                  type="button"
                  onClick={() => rename(j.id, j.name)}
                  className="text-gray-500 hover:underline focus:outline-none focus:ring-2 focus:ring-[#0085CA] rounded"
                >
                  Rename
                </button>
                <button
                  type="button"
                  onClick={() => remove(j.id, j.name)}
                  className="text-[#A32D2D] hover:underline focus:outline-none focus:ring-2 focus:ring-[#0085CA] rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
