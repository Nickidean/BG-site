// Shared types for the Journey Funnel app.

export type Availability = 'both' | 'desktop' | 'mobile';
export type DeviceView = 'desktop' | 'mobile' | 'combined';

export interface StepLink {
  id: string;
  label: string;
  url: string;
}

export interface Step {
  id: string;
  title: string;
  /** Id of a screenshot stored in Supabase-style storage (here: Redis). */
  screenshotId?: string | null;
  notes: string;
  links: StepLink[];
  /** Visitor numbers per device. Empty / null means "no number entered". */
  desktop: number | null;
  mobile: number | null;
  /** Which device funnels this step appears in. */
  availability: Availability;
}

export interface Lane {
  id: string;
  name: string;
  steps: Step[];
}

export type Section =
  | { id: string; type: 'step'; step: Step }
  | { id: string; type: 'fork'; lanes: Lane[] };

export interface Journey {
  id: string;
  name: string;
  updatedAt: number;
  sections: Section[];
  /** Optional token enabling a read-only public share link. */
  shareId?: string | null;
}

export interface JourneySummary {
  id: string;
  name: string;
  updatedAt: number;
  shareId?: string | null;
}

// ---- Factory helpers ---------------------------------------------------

let counter = 0;
export function uid(prefix = 'id'): string {
  counter += 1;
  return `${prefix}_${Date.now().toString(36)}_${counter.toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 7)}`;
}

export function newStep(title = 'New step'): Step {
  return {
    id: uid('step'),
    title,
    screenshotId: null,
    notes: '',
    links: [],
    desktop: null,
    mobile: null,
    availability: 'both',
  };
}

export function newStepSection(title?: string): Section {
  return { id: uid('sec'), type: 'step', step: newStep(title) };
}

export function newLane(name: string): Lane {
  return { id: uid('lane'), name, steps: [newStep(`${name} step`)] };
}

export function newForkSection(): Section {
  return {
    id: uid('sec'),
    type: 'fork',
    lanes: [newLane('Lane A'), newLane('Lane B')],
  };
}
