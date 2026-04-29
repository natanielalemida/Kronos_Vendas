import {useMutation, useQueryClient} from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

import {OrderController} from '../controllers/order.controller';
import {ordersQueryKeys} from '../query-keys/orders.query-keys';
import {OrderControllerSendParams} from '../types/orders-data.types';

const controller = new OrderController();

export function useSendOrdersMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ordersToSend: OrderControllerSendParams[]) => {
      return Promise.all(
        ordersToSend.map(orderToSend => controller.sendOrder(orderToSend)),
      );
    },
    onSuccess: async results => {
      const hasFailedSync = results.some(result => !result);

      if (hasFailedSync) {
        return;
      }

      await queryClient.invalidateQueries({queryKey: ordersQueryKeys.all});
      Toast.show({
        type: 'success',
        text1: 'Sucesso',
        text2: 'Pedido enviado com sucesso',
        visibilityTime: 2000,
      });
    },
  });
}
