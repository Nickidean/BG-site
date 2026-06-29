'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { computeJourney, exportToText, formatNumber, formatPct } from '@/lib/funnel/compute';
import type { DeviceView, Journey, Step } from '@/lib/funnel/types';
import { api } from '../lib/client';
import * as mutate from '../lib/mutate';
import type { StepTarget } from '../lib/mutate';
import { DeviceToggle } from './DeviceToggle';
import { FunnelView, type FunnelViewHandlers } from './FunnelView';
import { Lightbox } from './Lightbox';
import { PresentMode } from './PresentMode';
import { StepEditor } from './StepEditor';

type SaveState = 'saved' | 'saving' | 'error';

export function Editor({
  initialJourney,
  onBack,
  onMeta,
}: {
  initialJourney: Journey;
  onBack: () => void;
  onMeta: (id: string, name: string) => void;
}) {
  const [journey, setJourney] = useState<Journey>(initialJourney);
  const [view, setView] = useState<DeviceView>('combined');
  const [editTarget, setEditTarget] = useState<StepTarget | null>(null);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  const [presenting, setPresenting] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [shareId, setShareId] = useState<string | null>(initialJourney.shareId ?? null);
  const [saveState, setSaveState] = useState<SaveState>('saved');

  // Autosave (debounced) whenever the structure or name changes.
  const firstRender = useRef(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setSaveState('saving');
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      api
        .saveJourney(journey)
        .then(() => setSaveState('saved'))
        .catch(() => setSaveState('error'));
    }, 700);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [journey]);

  const apply = useCallback((next: Journey) => setJourney(next), []);

  const handlers: FunnelViewHandlers = {
    onEditStep: setEditTarget,
    onMoveStep: (t, dir) => apply(mutate.moveStep(journey, t, dir)),
    onDeleteStep: (t) => apply(mutate.deleteStep(journey, t)),
    onAddStepToLane: (sid, lid) => apply(mutate.addStepToLane(journey, sid, lid)),
    onAddLane: (sid) => apply(mutate.addLane(journey, sid)),
    onRemoveLane: (sid, lid) => apply(mutate.removeLane(journey, sid, lid)),
    onRenameLane: (sid, lid, name) => apply(mutate.renameLane(journey, sid, lid, name)),
  };

  const editingStep: Step | null = editTarget ? mutate.findStep(journey, editTarget) : null;

  function patchEditing(patch: Partial<Step>) {
    if (editTarget) apply(mutate.updateStep(journey, editTarget, patch));
  }

  function rename(name: string) {
    setJourney((j) => ({ ...j, name }));
    onMeta(journey.id, name);
  }

  async function toggleShare(enabled: boolean) {
    try {
      const { shareId: id } = await api.setShare(journey.id, enabled);
      setShareId(id);
    } catch {
      /* ignore */
    }
  }

  const computed = computeJourney(journey, view);
  const shareUrl =
    shareId && typeof window !== 'undefined'
      ? `${window.location.origin}/funnel/share/${shareId}`
      : '';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toolbar */}
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white">
        <div className="flex flex-wrap items-center gap-3 px-4 py-3">
          <button
            type="button"
            onClick={onBack}
            className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0085CA]"
          >
            ← Library
          </button>
          <input
            value={journey.name}
            onChange={(e) => rename(e.target.value)}
            aria-label="Journey name"
            className="min-w-0 flex-1 rounded-lg border border-transparent px-2 py-1 text-lg font-bold hover:border-gray-200 focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0085CA]"
          />
          <span
            className={`text-xs font-semibold ${
              saveState === 'error' ? 'text-[#A32D2D]' : 'text-gray-400'
            }`}
          >
            {saveState === 'saving' ? 'Saving…' : saveState === 'error' ? 'Save failed' : 'Saved'}
          </span>
          <DeviceToggle value={view} onChange={setView} />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowExport(true)}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0085CA]"
            >
              Export
            </button>
            <button
              type="button"
              onClick={() => setShowShare(true)}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0085CA]"
            >
              Share
            </button>
            <button
              type="button"
              onClick={() => setPresenting(true)}
              className="btn-primary !px-4 !py-2 !text-sm"
            >
              Present
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="flex flex-wrap items-center gap-4 border-t border-gray-100 px-4 py-2 text-sm">
          <SummaryStat label="Entry" value={formatNumber(computed.entryValue)} />
          <SummaryStat label="Final" value={formatNumber(computed.finalValue)} />
          <SummaryStat
            label="Overall conversion"
            value={computed.conversion != null ? formatPct(computed.conversion) : '—'}
            highlight
          />
          <SummaryStat label="Steps shown" value={String(computed.stepCount)} />
        </div>
      </header>

      {/* Canvas */}
      <main>
        <FunnelView
          journey={journey}
          view={view}
          editable
          handlers={handlers}
          onViewShot={(src, alt) => setLightbox({ src, alt })}
        />

        <div className="flex flex-wrap gap-3 px-6 pb-16">
          <button
            type="button"
            onClick={() => apply(mutate.addStepSection(journey))}
            className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:border-[#0085CA] hover:text-[#0085CA] focus:outline-none focus:ring-2 focus:ring-[#0085CA]"
          >
            + Add step
          </button>
          <button
            type="button"
            onClick={() => apply(mutate.addForkSection(journey))}
            className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:border-[#0085CA] hover:text-[#0085CA] focus:outline-none focus:ring-2 focus:ring-[#0085CA]"
          >
            + Add fork
          </button>
        </div>
      </main>

      {editingStep && editTarget && (
        <StepEditor
          step={editingStep}
          onChange={patchEditing}
          onClose={() => setEditTarget(null)}
          onViewShot={(src) => setLightbox({ src, alt: editingStep.title })}
        />
      )}

      {lightbox && (
        <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />
      )}

      {presenting && (
        <PresentMode
          journey={journey}
          view={view}
          onChangeView={setView}
          onClose={() => setPresenting(false)}
        />
      )}

      {showExport && (
        <ExportModal journey={journey} view={view} onClose={() => setShowExport(false)} />
      )}

      {showShare && (
        <ShareModal
          enabled={!!shareId}
          url={shareUrl}
          onToggle={toggleShare}
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  );
}

function SummaryStat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</span>
      <span className={`font-bold tabular-nums ${highlight ? 'text-[#0085CA]' : 'text-gray-800'}`}>
        {value}
      </span>
    </div>
  );
}

function ExportModal({
  journey,
  view,
  onClose,
}: {
  journey: Journey;
  view: DeviceView;
  onClose: () => void;
}) {
  const text = exportToText(journey, view);
  const [copied, setCopied] = useState(false);

  function download() {
    const blob = new Blob([text], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${journey.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-${view}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-6"
      onMouseDown={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Export"
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        className="flex max-h-[80vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 className="text-lg font-bold">Export outline ({view})</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1.5 text-sm font-semibold text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0085CA]"
          >
            Close
          </button>
        </div>
        <pre className="flex-1 overflow-auto whitespace-pre-wrap px-5 py-4 text-sm text-gray-800">
          {text}
        </pre>
        <div className="flex justify-end gap-2 border-t border-gray-200 px-5 py-4">
          <button
            type="button"
            onClick={() => {
              void navigator.clipboard.writeText(text).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              });
            }}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0085CA]"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button type="button" onClick={download} className="btn-primary !px-4 !py-2 !text-sm">
            Download .txt
          </button>
        </div>
      </div>
    </div>
  );
}

function ShareModal({
  enabled,
  url,
  onToggle,
  onClose,
}: {
  enabled: boolean;
  url: string;
  onToggle: (enabled: boolean) => void;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-6"
      onMouseDown={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Share"
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Read-only share link</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1.5 text-sm font-semibold text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0085CA]"
          >
            Close
          </button>
        </div>
        <label className="mb-4 flex items-center gap-3">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => onToggle(e.target.checked)}
            className="h-4 w-4 accent-[#0085CA]"
          />
          <span className="text-sm font-semibold text-gray-700">
            Anyone with the link can view (read-only)
          </span>
        </label>
        {enabled && url && (
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={url}
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm"
              onFocus={(e) => e.target.select()}
            />
            <button
              type="button"
              onClick={() => {
                void navigator.clipboard.writeText(url).then(() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                });
              }}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0085CA]"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
