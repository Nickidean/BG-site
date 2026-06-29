'use client';

import type { DeviceView } from '@/lib/funnel/types';

const OPTIONS: { value: DeviceView; label: string }[] = [
  { value: 'desktop', label: 'Desktop' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'combined', label: 'Combined' },
];

export function DeviceToggle({
  value,
  onChange,
}: {
  value: DeviceView;
  onChange: (v: DeviceView) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Device view"
      className="inline-flex rounded-xl border border-gray-200 bg-white p-1"
    >
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          aria-pressed={value === opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#0085CA] ${
            value === opt.value ? 'bg-[#0085CA] text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
