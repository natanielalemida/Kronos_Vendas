import {Alert} from 'react-native';

import ApiInstace from '@/api/ApiInstace';
import {OrderSyncService} from '@/modules/sync/services/order-sync.service';
import {SingleCustomerUploadService} from '@/modules/sync/services/single-customer-upload.service';
import {ClienteDto} from '@/modules/sync/types/customer-sync.types';
import {UserDto} from '@/shared/types';

import {OrderRepository} from '../repositories/order.repository';
import {
  OrderControllerSendParams,
  OrderListQueryResult,
  OrderSyncApiResponse,
} from '../types/orders-data.types';
import {OrdersFilterOptions} from '../types/order.types';

function getOrderSyncErrorMessage(response?: OrderSyncApiResponse): string {
  return response?.mensagens?.[0]?.conteudo ?? 'Falha ao enviar pedido.';
}

export class OrderService {
  constructor(
    private readonly orderRepository = new OrderRepository(),
    private readonly orderSyncService = new OrderSyncService(),
  ) {}

  async fetchOrders(
    options: OrdersFilterOptions,
  ): Promise<OrderListQueryResult> {
    return this.orderRepository.searchOrders(options);
  }

  async sendOrder({
    authenticatedUser,
    companyCode,
    customerToSync,
    id,
    terminal,
  }: OrderControllerSendParams): Promise<boolean | undefined> {
    const customerSyncService = new SingleCustomerUploadService(
      [],
      authenticatedUser as UserDto,
      customerToSync as ClienteDto,
      () => {},
    );

    if (!customerToSync?.Codigo) {
      const syncedCustomer = await customerSyncService.syncSingleCustomer(true);

      if (!syncedCustomer) {
        return;
      }

      if (!syncedCustomer.Codigo) {
        throw new Error('Cliente sincronizado sem código válido.');
      }

      await this.orderRepository.updateOrderCustomerId(
        id,
        syncedCustomer.Codigo,
      );
    }

    try {
      const orderPayload = await this.orderRepository.getOrderSyncPayloadById(
        id,
        terminal,
      );

      if (!orderPayload) {
        throw new Error('Pedido não encontrado.');
      }

      const response = await ApiInstace.openUrl<OrderSyncApiResponse, unknown>({
        method: 'post',
        endPoint: 'arc/operacao/prevenda',
        data: orderPayload,
        headers: {
          Empresa: companyCode,
          Auth: authenticatedUser.Hash,
        },
      });

      if (!response?.Mensagens || !Array.isArray(response.Mensagens)) {
        const errorMessage = getOrderSyncErrorMessage(response);
        Alert.alert('Falha ao enviar pedido', errorMessage);
        throw new Error(errorMessage);
      }

      if (!response.Resultado) {
        throw new Error('Resposta inválida ao sincronizar pedido.');
      }

      await this.orderSyncService.updateOne(id, response.Resultado);
      return true;
    } catch (error) {
      const normalizedError =
        error instanceof Error
          ? error
          : new Error('Erro ao sincronizar pedido.');

      if (normalizedError.message === 'Network Error') {
        Alert.alert(
          'Sem conexão',
          'Verifique sua conexão com a internet e tente novamente',
        );
        return;
      }

      Alert.alert('Erro', normalizedError.message);
      return;
    }
  }
}
