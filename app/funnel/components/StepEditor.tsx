'use client';

import { useEffect, useRef, useState } from 'react';
import type { Availability, Step, StepLink } from '@/lib/funnel/types';
import { uid } from '@/lib/funnel/types';
import { screenshotUrl, uploadScreenshot } from '../lib/client';

const AVAILABILITY: { value: Availability; label: string }[] = [
  { value: 'both', label: 'Both devices' },
  { value: 'desktop', label: 'Desktop only' },
  { value: 'mobile', label: 'Mobile only' },
];

export function StepEditor({
  step,
  onChange,
  onClose,
  onViewShot,
}: {
  step: Step;
  onChange: (patch: Partial<Step>) => void;
  onClose: () => void;
  onViewShot: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  async function handleImage(source: File | Blob | string) {
    setError('');
    setUploading(true);
    try {
      const id = await uploadScreenshot(source);
      onChange({ screenshotId: id });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const onPaste = (e: ClipboardEvent) => {
      const item = Array.from(e.clipboardData?.items || []).find((i) =>
        i.type.startsWith('image/')
      );
      const file = item?.getAsFile();
      if (file) {
        e.preventDefault();
        void handleImage(file);
      }
    };
    el.addEventListener('paste', onPaste as EventListener);
    return () => el.removeEventListener('paste', onPaste as EventListener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shotUrl = screenshotUrl(step.screenshotId);

  function updateLink(id: string, patch: Partial<StepLink>) {
    onChange({ links: step.links.map((l) => (l.id === id ? { ...l, ...patch } : l)) });
  }
  function addLink() {
    onChange({ links: [...step.links, { id: uid('link'), label: '', url: '' }] });
  }
  function removeLink(id: string) {
    onChange({ links: step.links.filter((l) => l.id !== id) });
  }

  const numberField = (value: number | null, onSet: (v: number | null) => void) => (
    <input
      type="number"
      inputMode="numeric"
      min={0}
      value={value ?? ''}
      onChange={(e) => onSet(e.target.value === '' ? null : Math.max(0, Number(e.target.value)))}
      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0085CA]"
      placeholder="—"
    />
  );

  return (
    <div
      className="fixed inset-0 z-40 flex justify-end bg-black/40"
      onMouseDown={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Edit step: ${step.title}`}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        onMouseDown={(e) => e.stopPropagation()}
        className="h-full w-full max-w-md overflow-y-auto bg-white shadow-2xl"
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4">
          <h2 className="text-lg font-bold">Edit step</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1.5 text-sm font-semibold text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0085CA]"
          >
            Done
          </button>
        </div>

        <div className="space-y-5 px-5 py-5">
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-gray-700">Title</span>
            <input
              value={step.title}
              onChange={(e) => onChange({ title: e.target.value })}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0085CA]"
            />
          </label>

          {/* Screenshot */}
          <div>
            <span className="mb-1 block text-sm font-semibold text-gray-700">Screenshot</span>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                const file = e.dataTransfer.files?.[0];
                if (file) void handleImage(file);
              }}
              className={`relative rounded-xl border-2 border-dashed p-3 text-center transition-colors ${
                dragOver ? 'border-[#0085CA] bg-[#0085CA]/5' : 'border-gray-300'
              }`}
            >
              {shotUrl ? (
                <div className="space-y-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={shotUrl}
                    alt={step.title}
                    className="mx-auto max-h-48 cursor-zoom-in rounded-lg object-contain"
                    onClick={() => onViewShot(shotUrl)}
                  />
                  <button
                    type="button"
                    onClick={() => onChange({ screenshotId: null })}
                    className="text-xs font-semibold text-[#A32D2D] hover:underline"
                  >
                    Remove screenshot
                  </button>
                </div>
              ) : (
                <p className="py-4 text-sm text-gray-500">
                  Drag &amp; drop, paste, or{' '}
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="font-semibold text-[#0085CA] hover:underline"
                  >
                    choose a file
                  </button>
                </p>
              )}
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/70 text-sm font-semibold text-gray-600">
                  Uploading…
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleImage(file);
                e.target.value = '';
              }}
            />
            {error && <p className="mt-1 text-xs text-[#A32D2D]">{error}</p>}
          </div>

          {/* Per-device numbers */}
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-gray-700">Desktop visitors</span>
              {numberField(step.desktop, (v) => onChange({ desktop: v }))}
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-gray-700">Mobile visitors</span>
              {numberField(step.mobile, (v) => onChange({ mobile: v }))}
            </label>
          </div>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-gray-700">Availability</span>
            <select
              value={step.availability}
              onChange={(e) => onChange({ availability: e.target.value as Availability })}
              className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0085CA]"
            >
              {AVAILABILITY.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>
          </label>

          {/* Notes */}
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-gray-700">Notes</span>
            <textarea
              value={step.notes}
              onChange={(e) => onChange({ notes: e.target.value })}
              rows={4}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0085CA]"
              placeholder="What happens on this screen, hypotheses, findings…"
            />
          </label>

          {/* Links */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">Links</span>
              <button
                type="button"
                onClick={addLink}
                className="text-sm font-semibold text-[#0085CA] hover:underline focus:outline-none focus:ring-2 focus:ring-[#0085CA] rounded"
              >
                + Add link
              </button>
            </div>
            <div className="space-y-2">
              {step.links.map((link) => (
                <div key={link.id} className="flex items-center gap-2">
                  <input
                    value={link.label}
                    onChange={(e) => updateLink(link.id, { label: e.target.value })}
                    placeholder="Label"
                    className="w-1/3 rounded-lg border border-gray-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0085CA]"
                  />
                  <input
                    value={link.url}
                    onChange={(e) => updateLink(link.id, { url: e.target.value })}
                    placeholder="https://…"
                    className="flex-1 rounded-lg border border-gray-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0085CA]"
                  />
                  <button
                    type="button"
                    onClick={() => removeLink(link.id)}
                    aria-label="Remove link"
                    className="rounded-lg px-2 py-1.5 text-sm text-[#A32D2D] hover:bg-[#A32D2D]/10 focus:outline-none focus:ring-2 focus:ring-[#0085CA]"
                  >
                    ✕
                  </button>
                </div>
              ))}
              {step.links.length === 0 && (
                <p className="text-xs text-gray-400">
                  No links yet. Add a label and URL (e.g. &ldquo;A/B test deck&rdquo;).
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
