import { useEffect, useRef } from 'react';

import { recordRenderDiff } from '../performance-monitor';

type TrackedValues = Record<string, unknown>;

export function useDevRenderTrace(componentId: string, trackedValues: TrackedValues) {
  const previousValuesRef = useRef<TrackedValues | null>(null);
  const renderCountRef = useRef(0);

  useEffect(() => {
    if (!__DEV__) {
      return;
    }

    renderCountRef.current += 1;

    const previousValues = previousValuesRef.current;

    if (!previousValues) {
      previousValuesRef.current = trackedValues;
      recordRenderDiff(componentId, {
        changedKeys: ['initial-render'],
        trigger: 'initial-render',
      });
      return;
    }

    const changedKeys = Object.keys(trackedValues).filter((key) => !Object.is(previousValues[key], trackedValues[key]));

    previousValuesRef.current = trackedValues;

    recordRenderDiff(componentId, {
      changedKeys: changedKeys.length ? changedKeys : ['no-tracked-prop-change'],
      trigger: `render-${renderCountRef.current}`,
    });
  });
}
