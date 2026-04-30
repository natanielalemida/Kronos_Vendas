import {useQuery} from '@tanstack/react-query';
import {useMemo} from 'react';

import {SyncController} from '../controllers/sync.controller';
import {syncQueryKeys} from '../query-keys/sync.query-keys';
import {syncExecutionContextSchema} from '../schemas/sync.schema';
import {NOT_AVAILABLE_SYNC_LABEL} from '../types/sync-page.types';
import {UserDto} from '@/shared/types';

export function useLastSyncQuery(
  user: UserDto | undefined,
  organizationCode: number | undefined,
) {
  const syncContext = syncExecutionContextSchema.safeParse({
    organizationCode,
    userHash: user?.Hash,
  });

  const syncController = useMemo(() => {
    if (!user || !syncContext.success) {
      return undefined;
    }

    return new SyncController(user, syncContext.data.organizationCode);
  }, [syncContext, user]);

  return useQuery({
    enabled: !!syncController,
    gcTime: 1000 * 60 * 15,
    queryFn: async () => {
      const lastSyncLabel = await syncController?.getLastSyncLabel();
      return lastSyncLabel ?? NOT_AVAILABLE_SYNC_LABEL;
    },
    queryKey: syncQueryKeys.lastSync(organizationCode),
    staleTime: 1000 * 60 * 5,
  });
}
