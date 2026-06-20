export type Role = 'coach' | 'admin';

export interface Coach {
  id: string;
  name: string;
  pin: string;
  role: Role;
  active: boolean;
  createdAt: number;
}

export interface Recognition {
  id: string;
  giverId: string;
  giverName: string;
  recipientIds: string[];
  recipientNames: string[];
  category: string;
  note: string;
  createdAt: number;
}

export const CATEGORIES = [
  { value: 'kit', label: 'Kit & Equipment' },
  { value: 'coaching', label: 'Coaching' },
  { value: 'admin', label: 'Admin & Organisation' },
  { value: 'above-and-beyond', label: 'Going Above & Beyond' },
  { value: 'matchday', label: 'Matchday' },
  { value: 'support', label: 'Support & Mentoring' },
];

export const MONTHLY_LIMIT = 3;
