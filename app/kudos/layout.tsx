import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Coach Kudos — Bridport Youth Football Club',
  description: 'Recognise the coaches who go the extra mile.',
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌟</text></svg>",
  },
};

export default function KudosLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 text-white">
      {children}
    </div>
  );
}
