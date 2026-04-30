import {useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';

import {useAppSession} from '@/shared/hooks/useAppSession';
import {logger} from '@/shared/utils/logger';

import {ExitScreenNavigation} from '../types/menu-router.types';

export function useSetupExitScreen(navigation: ExitScreenNavigation) {
  const {clearAllContext} = useAppSession();

  const handleLogout = useCallback(async () => {
    clearAllContext();
    navigation.navigate('Login');
  }, [clearAllContext, navigation]);

  useFocusEffect(
    useCallback(() => {
      handleLogout().catch(error => {
        logger.error(
          'ExitScreen',
          'Failed to logout from drawer exit screen.',
          error,
        );
      });

      return () => undefined;
    }, [handleLogout]),
  );
}
