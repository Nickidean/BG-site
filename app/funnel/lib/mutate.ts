'use client';

import {
  newForkSection,
  newLane,
  newStep,
  newStepSection,
  type Journey,
  type Section,
  type Step,
} from '@/lib/funnel/types';

export interface StepTarget {
  sectionId: string;
  laneId: string | null; // null when the step is a top-level shared step
  stepId: string;
}

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T;
}

export function findStep(journey: Journey, t: StepTarget): Step | null {
  for (const section of journey.sections) {
    if (section.type === 'step' && section.id === t.sectionId && !t.laneId) {
      return section.step.id === t.stepId ? section.step : null;
    }
    if (section.type === 'fork' && section.id === t.sectionId) {
      const lane = section.lanes.find((l) => l.id === t.laneId);
      return lane?.steps.find((s) => s.id === t.stepId) ?? null;
    }
  }
  return null;
}

export function updateStep(journey: Journey, t: StepTarget, patch: Partial<Step>): Journey {
  const next = clone(journey);
  const step = findStep(next, t);
  if (step) Object.assign(step, patch);
  return next;
}

export function deleteStep(journey: Journey, t: StepTarget): Journey {
  const next = clone(journey);
  if (!t.laneId) {
    next.sections = next.sections.filter((s) => s.id !== t.sectionId);
    return next;
  }
  const section = next.sections.find((s) => s.id === t.sectionId);
  if (section?.type === 'fork') {
    const lane = section.lanes.find((l) => l.id === t.laneId);
    if (lane && lane.steps.length > 1) {
      lane.steps = lane.steps.filter((s) => s.id !== t.stepId);
    }
  }
  return next;
}

export function moveStep(journey: Journey, t: StepTarget, dir: -1 | 1): Journey {
  const next = clone(journey);
  if (!t.laneId) {
    const i = next.sections.findIndex((s) => s.id === t.sectionId);
    const j = i + dir;
    if (i >= 0 && j >= 0 && j < next.sections.length) {
      [next.sections[i], next.sections[j]] = [next.sections[j], next.sections[i]];
    }
    return next;
  }
  const section = next.sections.find((s) => s.id === t.sectionId);
  if (section?.type === 'fork') {
    const lane = section.lanes.find((l) => l.id === t.laneId);
    if (lane) {
      const i = lane.steps.findIndex((s) => s.id === t.stepId);
      const j = i + dir;
      if (i >= 0 && j >= 0 && j < lane.steps.length) {
        [lane.steps[i], lane.steps[j]] = [lane.steps[j], lane.steps[i]];
      }
    }
  }
  return next;
}

export function addStepSection(journey: Journey, afterId?: string): Journey {
  const next = clone(journey);
  const section = newStepSection('New step');
  insertAfter(next.sections, section, afterId);
  return next;
}

export function addForkSection(journey: Journey, afterId?: string): Journey {
  const next = clone(journey);
  const section = newForkSection();
  insertAfter(next.sections, section, afterId);
  return next;
}

function insertAfter(sections: Section[], section: Section, afterId?: string) {
  if (!afterId) {
    sections.push(section);
    return;
  }
  const i = sections.findIndex((s) => s.id === afterId);
  if (i < 0) sections.push(section);
  else sections.splice(i + 1, 0, section);
}

export function addStepToLane(journey: Journey, sectionId: string, laneId: string): Journey {
  const next = clone(journey);
  const section = next.sections.find((s) => s.id === sectionId);
  if (section?.type === 'fork') {
    const lane = section.lanes.find((l) => l.id === laneId);
    lane?.steps.push(newStep('New step'));
  }
  return next;
}

export function addLane(journey: Journey, sectionId: string): Journey {
  const next = clone(journey);
  const section = next.sections.find((s) => s.id === sectionId);
  if (section?.type === 'fork') {
    section.lanes.push(newLane(`Lane ${String.fromCharCode(65 + section.lanes.length)}`));
  }
  return next;
}

export function removeLane(journey: Journey, sectionId: string, laneId: string): Journey {
  const next = clone(journey);
  const section = next.sections.find((s) => s.id === sectionId);
  if (section?.type === 'fork' && section.lanes.length > 2) {
    section.lanes = section.lanes.filter((l) => l.id !== laneId);
  }
  return next;
}

export function renameLane(
  journey: Journey,
  sectionId: string,
  laneId: string,
  name: string
): Journey {
  const next = clone(journey);
  const section = next.sections.find((s) => s.id === sectionId);
  if (section?.type === 'fork') {
    const lane = section.lanes.find((l) => l.id === laneId);
    if (lane) lane.name = name;
  }
  return next;
}
