// Pure funnel maths, shared by the editor, export and present mode.
// Every derived figure (retention, drop-off, lane share, conversion)
// recomputes from the selected device view.

import type { DeviceView, Journey, Lane, Section, Step } from './types';

export function isStepVisible(step: Step, view: DeviceView): boolean {
  if (view === 'combined') return true;
  if (view === 'desktop') return step.availability !== 'mobile';
  return step.availability !== 'desktop';
}

/** Whether the step has any number entered for the selected view. */
export function stepHasValue(step: Step, view: DeviceView): boolean {
  if (view === 'desktop') return step.desktop != null;
  if (view === 'mobile') return step.mobile != null;
  return step.desktop != null || step.mobile != null;
}

/** Visitor count for a step in the selected view. Nulls count as 0 for maths. */
export function stepValue(step: Step, view: DeviceView): number {
  if (view === 'desktop') return step.desktop ?? 0;
  if (view === 'mobile') return step.mobile ?? 0;
  return (step.desktop ?? 0) + (step.mobile ?? 0);
}

export interface ComputedStep {
  step: Step;
  value: number;
  hasValue: boolean;
  retention: number | null; // value / entryValue, 0..1
  dropFromPrev: { abs: number; pct: number } | null;
  laneShare: number | null; // set only on a lane's entry step
}

export interface ComputedLane {
  lane: Lane;
  steps: ComputedStep[];
  share: number | null;
}

export type ComputedSection =
  | { id: string; type: 'step'; section: Section; step: ComputedStep }
  | { id: string; type: 'fork'; section: Section; lanes: ComputedLane[] };

export interface ComputedJourney {
  view: DeviceView;
  sections: ComputedSection[];
  entryValue: number;
  finalValue: number;
  conversion: number | null;
  stepCount: number;
}

function visibleSteps(steps: Step[], view: DeviceView): Step[] {
  return steps.filter((s) => isStepVisible(s, view));
}

/** Find the value of the first visible step in the journey (the funnel entry). */
function findEntryValue(sections: Section[], view: DeviceView): number {
  for (const section of sections) {
    if (section.type === 'step') {
      if (isStepVisible(section.step, view)) return stepValue(section.step, view);
    } else {
      let sum = 0;
      let found = false;
      for (const lane of section.lanes) {
        const vis = visibleSteps(lane.steps, view);
        if (vis.length) {
          sum += stepValue(vis[0], view);
          found = true;
        }
      }
      if (found) return sum;
    }
  }
  return 0;
}

export function computeJourney(journey: Journey, view: DeviceView): ComputedJourney {
  const entryValue = findEntryValue(journey.sections, view);
  const retentionOf = (v: number) => (entryValue > 0 ? v / entryValue : null);

  const out: ComputedSection[] = [];
  let incoming: number | null = null; // value flowing into the current position
  let stepCount = 0;

  for (const section of journey.sections) {
    if (section.type === 'step') {
      if (!isStepVisible(section.step, view)) continue;
      const value = stepValue(section.step, view);
      const cs: ComputedStep = {
        step: section.step,
        value,
        hasValue: stepHasValue(section.step, view),
        retention: retentionOf(value),
        dropFromPrev:
          incoming != null && incoming > 0
            ? { abs: incoming - value, pct: (incoming - value) / incoming }
            : null,
        laneShare: null,
      };
      out.push({ id: section.id, type: 'step', section, step: cs });
      incoming = value;
      stepCount += 1;
    } else {
      // Fork: lanes run in parallel, splitting the incoming traffic.
      const laneEntryValues = section.lanes.map((lane) => {
        const vis = visibleSteps(lane.steps, view);
        return vis.length ? stepValue(vis[0], view) : 0;
      });
      const totalEntry = laneEntryValues.reduce((a, b) => a + b, 0);

      const computedLanes: ComputedLane[] = section.lanes.map((lane, li) => {
        const vis = visibleSteps(lane.steps, view);
        const steps: ComputedStep[] = [];
        let laneIncoming: number | null = null;
        vis.forEach((step, si) => {
          const value = stepValue(step, view);
          steps.push({
            step,
            value,
            hasValue: stepHasValue(step, view),
            retention: retentionOf(value),
            dropFromPrev:
              si > 0 && laneIncoming != null && laneIncoming > 0
                ? { abs: laneIncoming - value, pct: (laneIncoming - value) / laneIncoming }
                : null,
            laneShare: si === 0 ? (totalEntry > 0 ? value / totalEntry : null) : null,
          });
          laneIncoming = value;
          stepCount += 1;
        });
        return {
          lane,
          steps,
          share: totalEntry > 0 ? laneEntryValues[li] / totalEntry : null,
        };
      });

      out.push({ id: section.id, type: 'fork', section, lanes: computedLanes });

      // Traffic flowing on to the rejoin step is the sum of lane exits.
      const laneExitSum = computedLanes.reduce((acc, cl) => {
        const last = cl.steps[cl.steps.length - 1];
        return acc + (last ? last.value : 0);
      }, 0);
      incoming = laneExitSum;
    }
  }

  const finalValue = incoming ?? 0;
  return {
    view,
    sections: out,
    entryValue,
    finalValue,
    conversion: entryValue > 0 ? finalValue / entryValue : null,
    stepCount,
  };
}

export function formatNumber(n: number): string {
  return n.toLocaleString('en-GB');
}

export function formatPct(fraction: number, digits = 1): string {
  return `${(fraction * 100).toFixed(digits)}%`;
}

// ---- Text export -------------------------------------------------------

export function exportToText(journey: Journey, view: DeviceView): string {
  const computed = computeJourney(journey, view);
  const lines: string[] = [];
  const viewLabel = view.charAt(0).toUpperCase() + view.slice(1);

  lines.push(journey.name);
  lines.push('='.repeat(journey.name.length));
  lines.push(`Device view: ${viewLabel}`);
  if (computed.entryValue > 0) {
    lines.push(
      `Entry: ${formatNumber(computed.entryValue)}  ·  Final: ${formatNumber(
        computed.finalValue
      )}  ·  Overall conversion: ${
        computed.conversion != null ? formatPct(computed.conversion) : '—'
      }`
    );
  }
  lines.push('');

  const stepLines = (cs: ComputedStep, indent: string) => {
    const parts: string[] = [];
    if (cs.hasValue) parts.push(`${formatNumber(cs.value)} visitors`);
    if (cs.retention != null) parts.push(`${formatPct(cs.retention)} retained`);
    if (cs.dropFromPrev) parts.push(`${formatPct(cs.dropFromPrev.pct)} drop-off`);
    lines.push(`${indent}- ${cs.step.title}${parts.length ? `  (${parts.join(', ')})` : ''}`);
    if (cs.step.notes.trim()) {
      cs.step.notes
        .split('\n')
        .forEach((l) => lines.push(`${indent}    note: ${l}`));
    }
    cs.step.links.forEach((link) =>
      lines.push(`${indent}    link: ${link.label || link.url} — ${link.url}`)
    );
  };

  let n = 0;
  for (const section of computed.sections) {
    if (section.type === 'step') {
      n += 1;
      lines.push(`${n}.`);
      stepLines(section.step, '  ');
    } else {
      n += 1;
      lines.push(`${n}. Fork:`);
      for (const cl of section.lanes) {
        const sharePart = cl.share != null ? ` (${formatPct(cl.share)} of traffic)` : '';
        lines.push(`  Lane: ${cl.lane.name}${sharePart}`);
        cl.steps.forEach((cs) => stepLines(cs, '    '));
      }
    }
    lines.push('');
  }

  return lines.join('\n').trim() + '\n';
}
