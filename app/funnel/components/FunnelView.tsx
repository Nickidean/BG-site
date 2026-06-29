'use client';

import { computeJourney, formatNumber, formatPct, type ComputedStep } from '@/lib/funnel/compute';
import type { DeviceView, Journey } from '@/lib/funnel/types';
import { screenshotUrl } from '../lib/client';
import type { StepTarget } from '../lib/mutate';

export interface FunnelViewHandlers {
  onEditStep: (t: StepTarget) => void;
  onMoveStep: (t: StepTarget, dir: -1 | 1) => void;
  onDeleteStep: (t: StepTarget) => void;
  onAddStepToLane: (sectionId: string, laneId: string) => void;
  onAddLane: (sectionId: string) => void;
  onRemoveLane: (sectionId: string, laneId: string) => void;
  onRenameLane: (sectionId: string, laneId: string, name: string) => void;
}

function DropChip({ drop }: { drop: ComputedStep['dropFromPrev'] }) {
  if (!drop || drop.abs <= 0) {
    return <div className="w-8 shrink-0" aria-hidden />;
  }
  const heavy = drop.pct >= 0.4;
  return (
    <div className="flex w-16 shrink-0 flex-col items-center justify-center self-center px-1 text-center">
      <span className="text-gray-300">→</span>
      <span
        className={`mt-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
          heavy ? 'bg-[#A32D2D]/10 text-[#A32D2D]' : 'bg-[#BA7517]/10 text-[#BA7517]'
        }`}
        title={`${formatNumber(drop.abs)} lost`}
      >
        −{formatPct(drop.pct, 0)}
      </span>
    </div>
  );
}

function StepCard({
  cs,
  target,
  editable,
  handlers,
  onViewShot,
  canLeft,
  canRight,
  canDelete = true,
}: {
  cs: ComputedStep;
  target: StepTarget;
  editable: boolean;
  handlers?: FunnelViewHandlers;
  onViewShot: (url: string, alt: string) => void;
  canLeft: boolean;
  canRight: boolean;
  canDelete?: boolean;
}) {
  const { step } = cs;
  const url = screenshotUrl(step.screenshotId);
  const retention = cs.retention != null ? Math.max(0, Math.min(1, cs.retention)) : null;
  const hasNotes = step.notes.trim().length > 0;
  const hasLinks = step.links.length > 0;

  return (
    <div className="w-56 shrink-0">
      <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* Screenshot */}
        <button
          type="button"
          onClick={() => url && onViewShot(url, step.title)}
          disabled={!url}
          className="group relative block h-28 w-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#0085CA]"
          aria-label={url ? `View screenshot for ${step.title}` : 'No screenshot'}
        >
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt={step.title} className="h-full w-full object-cover object-top" />
          ) : (
            <span className="flex h-full items-center justify-center text-xs text-gray-400">
              No screenshot
            </span>
          )}
          {step.availability !== 'both' && (
            <span className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
              {step.availability} only
            </span>
          )}
          <span className="absolute right-2 top-2 flex gap-1">
            {hasNotes && (
              <span
                title="Has notes"
                className="rounded-full bg-white/90 px-1.5 py-0.5 text-[10px] shadow"
              >
                📝
              </span>
            )}
            {hasLinks && (
              <span
                title="Has links"
                className="rounded-full bg-white/90 px-1.5 py-0.5 text-[10px] shadow"
              >
                🔗
              </span>
            )}
          </span>
        </button>

        {/* Body */}
        <div className="flex flex-1 flex-col gap-2 p-3">
          <h3 className="line-clamp-2 text-sm font-bold leading-snug" title={step.title}>
            {step.title}
          </h3>

          <div className="flex items-baseline justify-between">
            <span className="text-lg font-bold tabular-nums">
              {cs.hasValue ? formatNumber(cs.value) : '—'}
            </span>
            {cs.laneShare != null ? (
              <span className="rounded-full bg-[#0085CA]/10 px-2 py-0.5 text-xs font-semibold text-[#0085CA]">
                {formatPct(cs.laneShare, 0)} of traffic
              </span>
            ) : (
              retention != null && (
                <span className="text-xs font-semibold text-gray-500">
                  {formatPct(retention, 0)} retained
                </span>
              )
            )}
          </div>

          {/* Retention bar */}
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-[#0085CA] transition-all"
              style={{ width: `${(retention ?? 0) * 100}%` }}
            />
          </div>

          {editable && handlers && (
            <div className="mt-1 flex items-center gap-1">
              <button
                type="button"
                onClick={() => handlers.onMoveStep(target, -1)}
                disabled={!canLeft}
                aria-label="Move left"
                className="rounded-lg px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 disabled:opacity-30 focus:outline-none focus:ring-2 focus:ring-[#0085CA]"
              >
                ◀
              </button>
              <button
                type="button"
                onClick={() => handlers.onMoveStep(target, 1)}
                disabled={!canRight}
                aria-label="Move right"
                className="rounded-lg px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 disabled:opacity-30 focus:outline-none focus:ring-2 focus:ring-[#0085CA]"
              >
                ▶
              </button>
              <button
                type="button"
                onClick={() => handlers.onEditStep(target)}
                className="ml-auto rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0085CA]"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handlers.onDeleteStep(target)}
                disabled={!canDelete}
                aria-label="Delete step"
                className="rounded-lg px-2 py-1 text-xs text-[#A32D2D] hover:bg-[#A32D2D]/10 disabled:opacity-30 focus:outline-none focus:ring-2 focus:ring-[#0085CA]"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function FunnelView({
  journey,
  view,
  editable,
  handlers,
  onViewShot,
}: {
  journey: Journey;
  view: DeviceView;
  editable: boolean;
  handlers?: FunnelViewHandlers;
  onViewShot: (url: string, alt: string) => void;
}) {
  const computed = computeJourney(journey, view);

  if (computed.sections.length === 0) {
    return (
      <p className="px-6 py-12 text-center text-sm text-gray-400">
        No steps appear in the {view} funnel yet.
      </p>
    );
  }

  return (
    <div className="flex items-stretch gap-1 overflow-x-auto px-4 py-6">
      {computed.sections.map((section, si) => {
        if (section.type === 'step') {
          const target: StepTarget = {
            sectionId: section.section.id,
            laneId: null,
            stepId: section.step.step.id,
          };
          return (
            <div key={section.id} className="flex items-stretch">
              <DropChip drop={section.step.dropFromPrev} />
              <StepCard
                cs={section.step}
                target={target}
                editable={editable}
                handlers={handlers}
                onViewShot={onViewShot}
                canLeft={si > 0}
                canRight={si < computed.sections.length - 1}
              />
            </div>
          );
        }

        // Fork: lanes stacked vertically, each lane a horizontal row.
        return (
          <div key={section.id} className="flex items-stretch">
            <div className="flex w-10 shrink-0 items-center justify-center text-gray-300">⑂</div>
            <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-gray-300 bg-gray-50/60 p-3">
              {section.lanes.map((cl) => (
                <div key={cl.lane.id} className="flex items-stretch gap-1">
                  <div className="flex w-32 shrink-0 flex-col justify-center pr-2">
                    {editable && handlers ? (
                      <input
                        value={cl.lane.name}
                        onChange={(e) =>
                          handlers.onRenameLane(section.section.id, cl.lane.id, e.target.value)
                        }
                        className="w-full rounded-lg border border-transparent bg-transparent px-1 py-0.5 text-sm font-bold hover:border-gray-200 focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0085CA]"
                        aria-label="Lane name"
                      />
                    ) : (
                      <span className="px-1 text-sm font-bold">{cl.lane.name}</span>
                    )}
                    {cl.share != null && (
                      <span className="px-1 text-xs font-semibold text-[#0085CA]">
                        {formatPct(cl.share, 0)} of traffic
                      </span>
                    )}
                    {editable && handlers && (
                      <div className="mt-1 flex gap-1 px-1">
                        <button
                          type="button"
                          onClick={() => handlers.onAddStepToLane(section.section.id, cl.lane.id)}
                          className="rounded text-xs font-semibold text-[#0085CA] hover:underline focus:outline-none focus:ring-2 focus:ring-[#0085CA]"
                        >
                          + step
                        </button>
                        <button
                          type="button"
                          onClick={() => handlers.onRemoveLane(section.section.id, cl.lane.id)}
                          disabled={section.lanes.length <= 2}
                          className="rounded text-xs text-[#A32D2D] hover:underline disabled:opacity-30 focus:outline-none focus:ring-2 focus:ring-[#0085CA]"
                        >
                          remove
                        </button>
                      </div>
                    )}
                  </div>
                  {cl.steps.map((cs, idx) => {
                    const target: StepTarget = {
                      sectionId: section.section.id,
                      laneId: cl.lane.id,
                      stepId: cs.step.id,
                    };
                    return (
                      <div key={cs.step.id} className="flex items-stretch">
                        {idx > 0 && <DropChip drop={cs.dropFromPrev} />}
                        <StepCard
                          cs={cs}
                          target={target}
                          editable={editable}
                          handlers={handlers}
                          onViewShot={onViewShot}
                          canLeft={idx > 0}
                          canRight={idx < cl.steps.length - 1}
                          canDelete={cl.steps.length > 1}
                        />
                      </div>
                    );
                  })}
                  {cl.steps.length === 0 && (
                    <div className="flex w-56 items-center justify-center rounded-2xl border border-dashed border-gray-200 text-xs text-gray-400">
                      No steps on {view}
                    </div>
                  )}
                </div>
              ))}
              {editable && handlers && (
                <button
                  type="button"
                  onClick={() => handlers.onAddLane(section.section.id)}
                  className="self-start rounded-lg px-2 py-1 text-xs font-semibold text-[#0085CA] hover:bg-[#0085CA]/10 focus:outline-none focus:ring-2 focus:ring-[#0085CA]"
                >
                  + Add lane
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
