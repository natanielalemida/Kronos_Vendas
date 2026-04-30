import {useEffect, useState} from 'react';

import {initializeDatabase} from '@/modules/auth/lib/initializeDatabase';
import {useAppStorageActions} from '@/modules/storage/hooks/useAppStorageActions';
import {logger} from '@/shared/utils/logger';

type AppInitializationState = {
  isReady: boolean;
  error?: Error;
};

export function useInitializeApp(): AppInitializationState {
  const [state, setState] = useState<AppInitializationState>({
    isReady: false,
    error: undefined,
  });
  const {hydrate} = useAppStorageActions();

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      try {
        await initializeDatabase();
        await hydrate();

        if (!isMounted) {
          return;
        }

        setState({
          isReady: true,
          error: undefined,
        });
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setState({
          isReady: false,
          error:
            error instanceof Error
              ? error
              : new Error('Unexpected app initialization error.'),
        });
      }
    };

    initialize().catch(error => {
      logger.error('AppInit', 'Unexpected app initialization failure.', error);
    });

    return () => {
      isMounted = false;
    };
  }, [hydrate]);

  return state;
}
