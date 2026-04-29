import {create} from 'zustand';

import {
  SyncExecutionState,
  SyncRunMode,
  SyncStepDefinition,
  SyncStepId,
  SyncStepRunResult,
  SyncStepState,
} from '../types/sync-run.types';

type SyncExecutionStore = SyncExecutionState & {
  startRun: (mode: SyncRunMode, steps: SyncStepDefinition[]) => void;
  startStep: (stepId: SyncStepId, message?: string) => void;
  finishStep: (stepId: SyncStepId, result?: SyncStepRunResult) => void;
  failStep: (stepId: SyncStepId, errorMessage: string) => void;
  completeRun: (message: string) => void;
  failRun: (errorMessage: string) => void;
  reset: () => void;
};

const initialState: SyncExecutionState = {
  status: 'idle',
  mode: undefined,
  message: undefined,
  progressPercentage: 0,
  steps: [],
  errorMessage: undefined,
};

function calculateProgressPercentage(
  completedStepsCount: number,
  totalSteps: number,
): number {
  if (totalSteps === 0) {
    return 0;
  }

  return Math.round((completedStepsCount / totalSteps) * 100);
}

export const useSyncExecutionStore = create<SyncExecutionStore>(set => ({
  ...initialState,
  startRun: (mode, steps) =>
    set({
      status: 'running',
      mode,
      message: undefined,
      errorMessage: undefined,
      progressPercentage: 0,
      steps: steps.map(step => ({
        id: step.id,
        label: step.label,
        status: 'pending',
      })),
    }),
  startStep: (stepId, message) =>
    set(state => ({
      message: message ?? state.steps.find(step => step.id === stepId)?.label,
      steps: state.steps.map(step =>
        step.id === stepId
          ? {
              ...step,
              status: 'running',
              message,
            }
          : step,
      ),
    })),
  finishStep: (stepId, result) =>
    set(state => {
      const steps: SyncStepState[] = state.steps.map(step => {
        if (step.id !== stepId) {
          return step;
        }

        return {
          ...step,
          status: result?.skipped ? 'skipped' : 'completed',
          message: result?.message ?? step.message,
          itemCount: result?.itemCount,
        };
      });

      const completedStepsCount = steps.filter(
        step => step.status === 'completed' || step.status === 'skipped',
      ).length;

      return {
        steps,
        message: result?.message ?? state.message,
        progressPercentage: calculateProgressPercentage(
          completedStepsCount,
          steps.length,
        ),
      };
    }),
  failStep: (stepId, errorMessage) =>
    set(state => ({
      status: 'error',
      message: errorMessage,
      errorMessage,
      steps: state.steps.map(step =>
        step.id === stepId
          ? {
              ...step,
              status: 'failed',
              message: errorMessage,
            }
          : step,
      ),
    })),
  completeRun: message =>
    set(state => ({
      status: 'success',
      message,
      progressPercentage: 100,
      errorMessage: undefined,
      steps: state.steps.map(step =>
        step.status === 'running'
          ? {
              ...step,
              status: 'completed',
            }
          : step,
      ),
    })),
  failRun: errorMessage =>
    set({
      status: 'error',
      message: errorMessage,
      errorMessage,
    }),
  reset: () => set(initialState),
}));
