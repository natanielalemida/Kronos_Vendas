import {Alert} from 'react-native';
import {beforeEach, describe, expect, it, jest} from '@jest/globals';

import ApiInstace from '@/api/ApiInstace';

jest.mock('@/modules/orders/repositories/order.repository', () => ({
  OrderRepository: jest.fn(),
}));

jest.mock('@/modules/sync/services/order-sync.service', () => ({
  OrderSyncService: jest.fn(),
}));

jest.mock('@/modules/sync/services/single-customer-upload.service', () => ({
  SingleCustomerUploadService: jest.fn(),
}));

import {OrderService} from './order.service';

jest.mock('@/api/ApiInstace', () => ({
  __esModule: true,
  default: {
    openUrl: jest.fn(),
  },
}));

jest.spyOn(Alert, 'alert').mockImplementation(() => {});

describe('OrderService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('posts order payload to the order sync endpoint with auth headers', async () => {
    const orderRepository = {
      getOrderSyncPayloadById: jest.fn().mockResolvedValue({Codigo: 123}),
      updateOrderCustomerId: jest.fn(),
    };
    const orderSyncService = {
      updateOne: jest.fn().mockResolvedValue(undefined),
    };
    const orderService = new OrderService(
      orderRepository as never,
      orderSyncService as never,
    );

    (ApiInstace.openUrl as ReturnType<typeof jest.fn>).mockResolvedValue({
      Mensagens: [],
      Resultado: {Codigo: 123},
    });

    const result = await orderService.sendOrder({
      authenticatedUser: {
        Hash: 'hash',
      },
      companyCode: 1,
      customerToSync: {
        Codigo: 10,
      },
      id: 7,
      terminal: 1,
    });

    expect(orderRepository.getOrderSyncPayloadById).toHaveBeenCalledWith(7, 1);
    expect(ApiInstace.openUrl).toHaveBeenCalledWith({
      method: 'post',
      endPoint: 'arc/operacao/prevenda',
      data: {Codigo: 123},
      headers: {
        Empresa: 1,
        Auth: 'hash',
      },
    });
    expect(orderSyncService.updateOne).toHaveBeenCalledWith(7, {Codigo: 123});
    expect(result).toBe(true);
  });

  it('alerts the API message when the order sync response is invalid', async () => {
    const orderRepository = {
      getOrderSyncPayloadById: jest.fn().mockResolvedValue({Codigo: 123}),
      updateOrderCustomerId: jest.fn(),
    };
    const orderSyncService = {
      updateOne: jest.fn(),
    };
    const orderService = new OrderService(
      orderRepository as never,
      orderSyncService as never,
    );

    (ApiInstace.openUrl as ReturnType<typeof jest.fn>).mockResolvedValue({
      mensagens: [{conteudo: 'Pedido rejeitado'}],
    });

    const result = await orderService.sendOrder({
      authenticatedUser: {
        Hash: 'hash',
      },
      companyCode: 1,
      customerToSync: {
        Codigo: 10,
      },
      id: 7,
      terminal: 1,
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      'Falha ao enviar pedido',
      'Pedido rejeitado',
    );
    expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Pedido rejeitado');
    expect(result).toBeUndefined();
  });
});
