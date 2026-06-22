'use client';
import { useRef } from 'react';

interface PinInputProps {
  value: string;
  onChange: (v: string) => void;
  label?: string;
}

export function PinInput({ value, onChange, label }: PinInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length: 6 }, (_, i) => value[i] || '');

  function update(i: number, char: string) {
    const next = digits.map((d, idx) => (idx === i ? char : d));
    onChange(next.join('').replace(/\s+$/, ''));
    if (char && i < 5) setTimeout(() => refs.current[i + 1]?.focus(), 0);
  }

  return (
    <div>
      {label && <label className="block text-sm font-medium text-green-200 mb-3">{label}</label>}
      <div className="flex gap-2">
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={el => { refs.current[i] = el; }}
            type="password"
            inputMode="numeric"
            maxLength={2}
            value={digit}
            onFocus={e => e.target.select()}
            onChange={e => {
              const val = e.target.value.replace(/\D/g, '');
              update(i, val.slice(-1));
            }}
            autoComplete="one-time-code"
            onPaste={e => {
              if (i !== 0) return;
              e.preventDefault();
              const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
              if (!pasted) return;
              const next = Array.from({ length: 6 }, (_, idx) => pasted[idx] || '');
              onChange(next.join(''));
              const lastFilled = Math.min(pasted.length - 1, 5);
              setTimeout(() => refs.current[lastFilled]?.focus(), 0);
            }}
            onKeyDown={e => {
              if (e.key === 'Backspace' && !digit && i > 0) {
                update(i - 1, '');
                refs.current[i - 1]?.focus();
              }
            }}
            className="w-11 h-14 text-center text-2xl font-bold bg-white/10 border-2 border-white/20 rounded-xl text-white focus:outline-none focus:border-green-400 transition-colors"
          />
        ))}
      </div>
    </div>
  );
}
