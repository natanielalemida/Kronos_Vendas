import {useSyncExecutionStore} from '../stores/useSyncExecutionStore';
import {
  SyncRunMode,
  SyncStepDefinition,
  SyncStepId,
  SyncStepRunResult,
} from '../types/sync-run.types';

export class SyncSessionService {
  startRun(mode: SyncRunMode, steps: SyncStepDefinition[]): void {
    useSyncExecutionStore.getState().startRun(mode, steps);
  }

  startStep(stepId: SyncStepId, message?: string): void {
    useSyncExecutionStore.getState().startStep(stepId, message);
  }

  finishStep(stepId: SyncStepId, result?: SyncStepRunResult): void {
    useSyncExecutionStore.getState().finishStep(stepId, result);
  }

  failStep(stepId: SyncStepId, errorMessage: string): void {
    useSyncExecutionStore.getState().failStep(stepId, errorMessage);
  }

  completeRun(message: string): void {
    useSyncExecutionStore.getState().completeRun(message);
  }

  failRun(errorMessage: string): void {
    useSyncExecutionStore.getState().failRun(errorMessage);
  }

  reset(): void {
    useSyncExecutionStore.getState().reset();
  }
}
