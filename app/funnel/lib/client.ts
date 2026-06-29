'use client';

import type { Journey, JourneySummary } from '@/lib/funnel/types';

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  listJourneys: () =>
    fetch('/api/funnel/journeys').then((r) => json<{ journeys: JourneySummary[] }>(r)),
  createJourney: (name: string) =>
    fetch('/api/funnel/journeys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    }).then((r) => json<{ journey: Journey }>(r)),
  getJourney: (id: string) =>
    fetch(`/api/funnel/journeys/${id}`).then((r) => json<{ journey: Journey }>(r)),
  saveJourney: (journey: Journey) =>
    fetch(`/api/funnel/journeys/${journey.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: journey.name, sections: journey.sections }),
    }).then((r) => json<{ journey: Journey }>(r)),
  renameJourney: (id: string, name: string) =>
    fetch(`/api/funnel/journeys/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    }).then((r) => json<{ journey: Journey }>(r)),
  setShare: (id: string, share: boolean) =>
    fetch(`/api/funnel/journeys/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ share }),
    }).then((r) => json<{ journey: Journey; shareId: string | null }>(r)),
  deleteJourney: (id: string) =>
    fetch(`/api/funnel/journeys/${id}`, { method: 'DELETE' }).then((r) => json<{ ok: true }>(r)),
  logout: () => fetch('/api/funnel/auth', { method: 'DELETE' }),
};

export function screenshotUrl(id?: string | null): string | null {
  return id ? `/api/funnel/screenshot/${id}` : null;
}

/**
 * Compress an image file/data URL client-side and upload it.
 * Returns the stored screenshot id. Keeps the stored bytes small enough to
 * sit comfortably within request-size limits.
 */
export async function uploadScreenshot(source: File | Blob | string): Promise<string> {
  const dataUrl = await compressImage(source);
  const res = await fetch('/api/funnel/screenshot', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dataUrl }),
  });
  const { id } = await json<{ id: string }>(res);
  return id;
}

function readAsDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function compressImage(source: File | Blob | string, maxWidth = 1400): Promise<string> {
  const srcUrl = typeof source === 'string' ? source : await readAsDataUrl(source);
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = reject;
    el.src = srcUrl;
  });
  const scale = Math.min(1, maxWidth / img.width);
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return srcUrl;
  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL('image/jpeg', 0.82);
}
