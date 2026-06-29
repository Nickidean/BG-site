'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { computeJourney, formatNumber, formatPct, type ComputedStep } from '@/lib/funnel/compute';
import type { DeviceView, Journey } from '@/lib/funnel/types';
import { screenshotUrl } from '../lib/client';
import { DeviceToggle } from './DeviceToggle';

interface Slide {
  cs: ComputedStep;
  laneName?: string;
}

function buildSlides(journey: Journey, view: DeviceView): Slide[] {
  const computed = computeJourney(journey, view);
  const slides: Slide[] = [];
  for (const section of computed.sections) {
    if (section.type === 'step') {
      slides.push({ cs: section.step });
    } else {
      for (const cl of section.lanes) {
        for (const cs of cl.steps) {
          slides.push({ cs, laneName: cl.lane.name });
        }
      }
    }
  }
  return slides;
}

export function PresentMode({
  journey,
  view,
  onChangeView,
  onClose,
}: {
  journey: Journey;
  view: DeviceView;
  onChangeView: (v: DeviceView) => void;
  onClose: () => void;
}) {
  const slides = useMemo(() => buildSlides(journey, view), [journey, view]);
  const [index, setIndex] = useState(0);
  const safeIndex = Math.min(index, Math.max(0, slides.length - 1));

  const go = useCallback(
    (delta: number) => setIndex((i) => Math.max(0, Math.min(slides.length - 1, i + delta))),
    [slides.length]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, onClose]);

  const slide = slides[safeIndex];
  const url = slide ? screenshotUrl(slide.cs.step.screenshotId) : null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-950 text-white">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-6 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white/60">{journey.name}</p>
          {slide?.laneName && (
            <span className="mt-0.5 inline-block rounded-full bg-[#0085CA] px-2 py-0.5 text-xs font-semibold">
              {slide.laneName} lane
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="[&_button]:focus:ring-offset-0">
            <DeviceToggle value={view} onChange={onChangeView} />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
          >
            Exit ✕
          </button>
        </div>
      </div>

      {!slide ? (
        <div className="flex flex-1 items-center justify-center text-white/60">
          No steps in the {view} funnel.
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-6 overflow-hidden p-6 lg:flex-row">
          {/* Screenshot */}
          <div className="flex min-h-0 flex-1 items-center justify-center">
            {url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={url}
                alt={slide.cs.step.title}
                className="max-h-full max-w-full rounded-xl object-contain shadow-2xl"
              />
            ) : (
              <div className="flex h-64 w-full items-center justify-center rounded-xl border border-white/10 text-white/40">
                No screenshot
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex w-full flex-col gap-5 overflow-y-auto lg:w-96">
            <h2 className="text-2xl font-bold">{slide.cs.step.title}</h2>

            <div className="flex flex-wrap gap-2">
              <Stat label="Visitors" value={slide.cs.hasValue ? formatNumber(slide.cs.value) : '—'} />
              {slide.cs.retention != null && (
                <Stat label="Retained" value={formatPct(slide.cs.retention, 0)} />
              )}
              {slide.cs.laneShare != null ? (
                <Stat label="Path share" value={formatPct(slide.cs.laneShare, 0)} accent />
              ) : (
                slide.cs.dropFromPrev &&
                slide.cs.dropFromPrev.abs > 0 && (
                  <Stat
                    label="Drop-off"
                    value={`−${formatPct(slide.cs.dropFromPrev.pct, 0)}`}
                    danger
                  />
                )
              )}
            </div>

            {slide.cs.step.notes.trim() && (
              <div>
                <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-white/40">
                  Notes
                </h3>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/90">
                  {slide.cs.step.notes}
                </p>
              </div>
            )}

            {slide.cs.step.links.length > 0 && (
              <div>
                <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-white/40">
                  Links
                </h3>
                <ul className="space-y-1">
                  {slide.cs.step.links.map((link) => (
                    <li key={link.id}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-[#5cc0f0] underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-white"
                      >
                        {link.label || link.url} ↗
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between gap-4 border-t border-white/10 px-6 py-3">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={safeIndex === 0}
          className="rounded-lg bg-white/10 px-5 py-2 text-sm font-semibold hover:bg-white/20 disabled:opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
        >
          ← Previous
        </button>
        <span className="text-sm text-white/50">
          {slides.length ? safeIndex + 1 : 0} / {slides.length}
        </span>
        <button
          type="button"
          onClick={() => go(1)}
          disabled={safeIndex >= slides.length - 1}
          className="rounded-lg bg-white/10 px-5 py-2 text-sm font-semibold hover:bg-white/20 disabled:opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
  danger,
}: {
  label: string;
  value: string;
  accent?: boolean;
  danger?: boolean;
}) {
  return (
    <div
      className={`rounded-xl px-3 py-2 ${
        accent ? 'bg-[#0085CA]/20' : danger ? 'bg-[#A32D2D]/25' : 'bg-white/10'
      }`}
    >
      <div className="text-[10px] font-semibold uppercase tracking-wide text-white/50">{label}</div>
      <div className="text-lg font-bold tabular-nums">{value}</div>
    </div>
  );
}
