import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useQueryClient} from '@tanstack/react-query';
import {useCallback, useMemo, useRef} from 'react';
import LottieView from 'lottie-react-native';

import {useAppStore} from '@/shared/store/useAppStore';
import {DatabaseShareController} from '@/modules/sharing/controllers/databaseShare.controller';
import {SyncController} from '@/modules/sync/controllers/sync.controller';
import {useSyncExecution} from '@/modules/sync/hooks/useSyncExecution';

import {syncQueryKeys} from '../query-keys/sync.query-keys';
import {useLastSyncQuery} from '../queries/last-sync.query';
import {syncExecutionContextSchema} from '../schemas/sync.schema';
import {SyncSessionService} from '../services/sync-session.service';
import {
  NOT_AVAILABLE_SYNC_LABEL,
  SyncActionCard,
  UseSetupSyncPageResult,
} from '../types/sync-page.types';

export function useSetupSyncPage(): UseSetupSyncPageResult {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const user = useAppStore(state => state.user);
  const organizationCode = useAppStore(state => state.organizationCode);
  const {
    errorMessage,
    isRunning: isSyncing,
    progress,
    status,
    steps,
  } = useSyncExecution();
  const syncContext = syncExecutionContextSchema.safeParse({
    organizationCode,
    userHash: user?.Hash,
  });
  const lastSyncQuery = useLastSyncQuery(user, organizationCode);

  const animationRef = useRef<LottieView>(null);

  const syncController = useMemo(() => {
    if (!user || !syncContext.success) {
      return undefined;
    }

    return new SyncController(user, syncContext.data.organizationCode);
  }, [syncContext, user]);

  const databaseShareController = useMemo(() => {
    return new DatabaseShareController();
  }, []);
  const syncSessionService = useMemo(() => {
    return new SyncSessionService();
  }, []);

  useFocusEffect(
    useCallback(() => {
      lastSyncQuery.refetch().catch(error => {
        console.error('Failed to load last sync label:', error);
      });

      return () => undefined;
    }, [lastSyncQuery]),
  );

  const navigateToHome = useCallback(() => {
    navigation.navigate('Novo Pedido' as never);
  }, [navigation]);

  const resetSyncFeedback = useCallback(() => {
    animationRef.current?.reset();
    syncSessionService.reset();
  }, [syncSessionService]);

  const withAnimation = useCallback(async (callback: () => Promise<void>) => {
    animationRef.current?.play();

    try {
      await callback();
    } finally {
      animationRef.current?.reset();
    }
  }, []);

  const handleSyncAll = useCallback(async () => {
    if (!user || !syncController) {
      return;
    }

    await withAnimation(async () => {
      await syncController.syncAll();
      await queryClient.invalidateQueries({
        queryKey: syncQueryKeys.lastSync(organizationCode),
      });
    });

    resetSyncFeedback();
    navigateToHome();
  }, [
    navigateToHome,
    organizationCode,
    queryClient,
    resetSyncFeedback,
    syncController,
    user,
    withAnimation,
  ]);

  const handleResetAndSync = useCallback(async () => {
    if (!syncController) {
      return;
    }

    await withAnimation(async () => {
      await syncController.resetAndSync();
      await queryClient.invalidateQueries({
        queryKey: syncQueryKeys.lastSync(organizationCode),
      });
    });

    resetSyncFeedback();
    navigateToHome();
  }, [
    navigateToHome,
    organizationCode,
    queryClient,
    resetSyncFeedback,
    syncController,
    withAnimation,
  ]);

  const handleSyncImages = useCallback(async () => {
    if (!syncController) {
      return;
    }

    await withAnimation(async () => {
      await syncController.syncImages();
      await queryClient.invalidateQueries({
        queryKey: syncQueryKeys.lastSync(organizationCode),
      });
    });

    resetSyncFeedback();
    navigateToHome();
  }, [
    navigateToHome,
    organizationCode,
    queryClient,
    resetSyncFeedback,
    syncController,
    withAnimation,
  ]);

  const handleShareDatabase = useCallback(async () => {
    await databaseShareController.share();
  }, [databaseShareController]);

  const actionCards = useMemo<SyncActionCard[]>(
    () => [
      {
        id: 'sync-images',
        label: 'Sincronizar imagens',
        description: 'Atualiza somente as imagens dos produtos.',
        tone: 'info',
        onPress: handleSyncImages,
      },
      {
        id: 'sync-all',
        label: 'Sincronizar tudo',
        description: 'Atualiza os dados principais do aplicativo.',
        tone: 'success',
        onPress: handleSyncAll,
      },
      {
        id: 'reset-sync',
        label: 'Resetar e sincronizar',
        description: 'Refaz a base local do zero.',
        tone: 'warning',
        onPress: handleResetAndSync,
      },
      {
        id: 'share-database',
        label: 'Compartilhar banco local',
        description: 'Exporta o banco para suporte.',
        tone: 'neutral',
        onPress: handleShareDatabase,
      },
    ],
    [handleResetAndSync, handleShareDatabase, handleSyncAll, handleSyncImages],
  );

  return {
    status,
    errorMessage,
    progress,
    lastSyncLabel: lastSyncQuery.data ?? NOT_AVAILABLE_SYNC_LABEL,
    isSyncing,
    steps,
    actionCards,
    animationRef,
  };
}
