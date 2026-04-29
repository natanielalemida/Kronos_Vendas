export type SyncRunMode = 'sync-all' | 'reset-and-sync' | 'sync-images';

export type SyncStepId =
  | 'upload-pending-customers'
  | 'clear-synced-records'
  | 'clear-all-local-records'
  | 'municipalities'
  | 'products'
  | 'payment-methods'
  | 'customers'
  | 'orders'
  | 'product-images';

export type SyncStepStatus =
  | 'pending'
  | 'running'
  | 'completed'
  | 'skipped'
  | 'failed';

export type SyncStepState = {
  id: SyncStepId;
  label: string;
  status: SyncStepStatus;
  message?: string;
  itemCount?: number;
};

export type SyncExecutionStatus = 'idle' | 'running' | 'success' | 'error';

export type SyncExecutionState = {
  status: SyncExecutionStatus;
  mode?: SyncRunMode;
  message?: string;
  progressPercentage: number;
  steps: SyncStepState[];
  errorMessage?: string;
};

export type SyncStepDefinition = {
  id: SyncStepId;
  label: string;
  run: () => Promise<SyncStepRunResult>;
};

export type SyncStepRunResult = {
  itemCount?: number;
  message?: string;
  skipped?: boolean;
};
