'use client';

import { useEffect, useState } from 'react';
import { computeJourney, formatNumber, formatPct } from '@/lib/funnel/compute';
import type { DeviceView, Journey } from '@/lib/funnel/types';
import { DeviceToggle } from '../../components/DeviceToggle';
import { FunnelView } from '../../components/FunnelView';
import { Lightbox } from '../../components/Lightbox';
import { PresentMode } from '../../components/PresentMode';

export function ShareViewer({ token }: { token: string }) {
  const [journey, setJourney] = useState<Journey | null>(null);
  const [error, setError] = useState('');
  const [view, setView] = useState<DeviceView>('combined');
  const [presenting, setPresenting] = useState(false);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    fetch(`/api/funnel/share/${token}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Not found'))))
      .then((d) => setJourney(d.journey))
      .catch(() => setError('This share link is not valid.'));
  }, [token]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-500">{error}</div>
    );
  }
  if (!journey) {
    return <div className="flex min-h-screen items-center justify-center text-gray-400">Loading…</div>;
  }

  const computed = computeJourney(journey, view);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white">
        <div className="flex flex-wrap items-center gap-3 px-4 py-3">
          <h1 className="min-w-0 flex-1 truncate text-lg font-bold">{journey.name}</h1>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500">
            Read-only
          </span>
          <DeviceToggle value={view} onChange={setView} />
          <button
            type="button"
            onClick={() => setPresenting(true)}
            className="btn-primary !px-4 !py-2 !text-sm"
          >
            Present
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-4 border-t border-gray-100 px-4 py-2 text-sm">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Overall conversion
          </span>
          <span className="font-bold text-[#0085CA]">
            {computed.conversion != null ? formatPct(computed.conversion) : '—'}
          </span>
          <span className="text-gray-400">
            {formatNumber(computed.entryValue)} → {formatNumber(computed.finalValue)}
          </span>
        </div>
      </header>

      <main>
        <FunnelView
          journey={journey}
          view={view}
          editable={false}
          onViewShot={(src, alt) => setLightbox({ src, alt })}
        />
      </main>

      {presenting && (
        <PresentMode
          journey={journey}
          view={view}
          onChangeView={setView}
          onClose={() => setPresenting(false)}
        />
      )}
      {lightbox && (
        <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />
      )}
    </div>
  );
}
