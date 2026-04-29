import type { ProfilerOnRenderCallback } from 'react';

type RenderPhase = 'mount' | 'update' | 'nested-update';

type RenderStat = {
  actualDurationTotal: number;
  baseDurationTotal: number;
  changedKeys: Record<string, number>;
  commits: number;
  lastCommitAt: number;
  lastPhase: RenderPhase;
  lastTrigger: string;
  worstActualDuration: number;
};

type RenderDiffMetadata = {
  changedKeys: string[];
  trigger: string;
};

const devLogPrefix = '[RenderProfiler]';
const flushDelayMs = 3000;
const maxEntriesPerFlush = 8;
const collectorUrl = 'http://127.0.0.1:4318/render-profiler';
const stats = new Map<string, RenderStat>();

let flushTimer: ReturnType<typeof setTimeout> | null = null;

function getStat(componentId: string) {
  const current = stats.get(componentId);

  if (current) {
    return current;
  }

  const next: RenderStat = {
    actualDurationTotal: 0,
    baseDurationTotal: 0,
    changedKeys: {},
    commits: 0,
    lastCommitAt: 0,
    lastPhase: 'mount',
    lastTrigger: 'initial-render',
    worstActualDuration: 0,
  };

  stats.set(componentId, next);

  return next;
}

function scheduleFlush() {
  if (!__DEV__ || flushTimer) {
    return;
  }

  flushTimer = setTimeout(() => {
    flushTimer = null;
    flushRenderProfilerSummary();
  }, flushDelayMs);
}

function buildSummaryLines() {
  return [...stats.entries()]
    .sort((left, right) => {
      const leftScore = left[1].actualDurationTotal + left[1].worstActualDuration * 2;
      const rightScore = right[1].actualDurationTotal + right[1].worstActualDuration * 2;

      return rightScore - leftScore;
    })
    .slice(0, maxEntriesPerFlush)
    .map(([componentId, stat]) => {
      const avgActualDuration = stat.actualDurationTotal / Math.max(stat.commits, 1);
      const changedKeys = Object.entries(stat.changedKeys)
        .sort((left, right) => right[1] - left[1])
        .slice(0, 3)
        .map(([key, occurrences]) => `${key}:${occurrences}`)
        .join(', ');

      return `${componentId} | commits=${stat.commits} | avg=${avgActualDuration.toFixed(1)}ms | worst=${stat.worstActualDuration.toFixed(1)}ms | trigger=${stat.lastTrigger} | changed=${changedKeys || 'none'}`;
    });
}

function emitSummary(lines: string[]) {
  if (!lines.length) {
    return;
  }

  const message = `${devLogPrefix} ${lines.join(' || ')}`;

  console.warn(message);
  console.tron?.display({
    name: 'render-profiler',
    preview: lines[0],
    value: lines,
  });
  void fetch(collectorUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      lines,
      message,
      timestamp: Date.now(),
    }),
  }).catch(() => undefined);
}

export function flushRenderProfilerSummary() {
  if (!__DEV__) {
    return;
  }

  emitSummary(buildSummaryLines());
}

export function recordRenderDiff(componentId: string, metadata: RenderDiffMetadata) {
  if (!__DEV__) {
    return;
  }

  const stat = getStat(componentId);

  stat.lastTrigger = metadata.trigger;

  metadata.changedKeys.forEach((key) => {
    stat.changedKeys[key] = (stat.changedKeys[key] ?? 0) + 1;
  });

  scheduleFlush();
}

export const appProfilerOnRender: ProfilerOnRenderCallback = (
  componentId,
  phase,
  actualDuration,
  baseDuration,
  startTime,
  commitTime,
) => {
  if (!__DEV__) {
    return;
  }

  const stat = getStat(componentId);

  stat.actualDurationTotal += actualDuration;
  stat.baseDurationTotal += baseDuration;
  stat.commits += 1;
  stat.lastCommitAt = commitTime;
  stat.lastPhase = phase;
  stat.worstActualDuration = Math.max(stat.worstActualDuration, actualDuration);
  stat.lastTrigger = `${phase}@${Math.round(commitTime - startTime)}ms`;

  if (stat.commits <= 2 || actualDuration >= 8) {
    console.warn(
      `${devLogPrefix} commit ${componentId} | phase=${phase} | actual=${actualDuration.toFixed(1)}ms | base=${baseDuration.toFixed(1)}ms`,
    );
  }

  scheduleFlush();
};
