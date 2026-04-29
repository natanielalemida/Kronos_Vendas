import {useMemo} from 'react';

import {useSyncExecutionStore} from '../stores/useSyncExecutionStore';
import {SyncStepState} from '../types/sync-run.types';

export function useSyncExecution() {
  const status = useSyncExecutionStore(store => store.status);
  const mode = useSyncExecutionStore(store => store.mode);
  const message = useSyncExecutionStore(store => store.message);
  const progressPercentage = useSyncExecutionStore(
    store => store.progressPercentage,
  );
  const steps = useSyncExecutionStore(store => store.steps);
  const errorMessage = useSyncExecutionStore(store => store.errorMessage);

  const activeStep = useMemo<SyncStepState | undefined>(() => {
    return steps.find(step => step.status === 'running');
  }, [steps]);

  const progress = useMemo(() => {
    if (status === 'idle') {
      return undefined;
    }

    return {
      message: message ?? activeStep?.label ?? 'Sincronizando dados...',
      progress: progressPercentage,
    };
  }, [activeStep?.label, message, progressPercentage, status]);

  return {
    status,
    mode,
    progress,
    steps,
    errorMessage,
    isRunning: status === 'running',
  };
}
