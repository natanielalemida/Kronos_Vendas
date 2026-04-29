import LottieView from 'lottie-react-native';

import {SyncProgress} from './sync.types';
import {SyncStepState} from './sync-run.types';

export type SyncActionCardTone = 'success' | 'info' | 'warning' | 'neutral';
export const NOT_AVAILABLE_SYNC_LABEL = 'Not informed';

export type SyncActionCard = {
  id: 'sync-images' | 'sync-all' | 'reset-sync' | 'share-database';
  label: string;
  tone: SyncActionCardTone;
  onPress: () => Promise<void>;
};

export type UseSetupSyncPageResult = {
  progress?: SyncProgress;
  lastSyncLabel: string;
  isSyncing: boolean;
  errorMessage?: string;
  steps: SyncStepState[];
  actionCards: SyncActionCard[];
  animationRef: React.RefObject<LottieView>;
};
