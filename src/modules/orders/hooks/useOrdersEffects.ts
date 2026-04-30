import {useCallback, useEffect} from 'react';
import {useFocusEffect} from '@react-navigation/native';

import {logger} from '@/shared/utils/logger';

import {UseOrdersEffectsParams} from '../types/orders-hooks.types';

export function useOrdersEffects({
  customerId,
  getOrders,
  navigation,
  options,
  setOptions,
  setOrders,
  setSelectedOrders,
}: UseOrdersEffectsParams) {
  useEffect(() => {
    setOrders([]);
    getOrders(options)
      .then(result => {
        setOrders(result);
      })
      .catch(error => {
        logger.error('OrdersPage', 'Error while loading orders.', error);
      });
  }, [getOrders, options, setOrders]);

  useFocusEffect(
    useCallback(() => {
      setOptions(currentValue => ({...currentValue, clienteId: customerId}));

      return () => {
        setSelectedOrders([]);
        setOrders([]);
        if (navigation.setParams) {
          navigation.setParams({clienteId: undefined});
        }
      };
    }, [customerId, navigation, setOptions, setOrders, setSelectedOrders]),
  );
}
