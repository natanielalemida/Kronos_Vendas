import {beforeEach, describe, expect, it, jest} from '@jest/globals';
import {UserDto} from '@/shared/types';

import {PaymentMethodSyncRepository} from '../repositories/payment-method-sync.repository';
import {SyncApiRepository} from '../repositories/sync-api.repository';
import {PaymentMethodSyncService} from './payment-method-sync.service';

describe('PaymentMethodSyncService', () => {
  const user = {Hash: 'hash'} as UserDto;
  const organizationCode = 1;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  function createService(response: unknown) {
    const syncApiRepository = {
      get: jest.fn().mockResolvedValue(response),
    } as unknown as SyncApiRepository;
    const paymentMethodSyncRepository = {
      replacePaymentMethods: jest.fn().mockResolvedValue(undefined),
    } as unknown as PaymentMethodSyncRepository;

    return {
      service: new PaymentMethodSyncService(
        syncApiRepository,
        paymentMethodSyncRepository,
      ),
      syncApiRepository: syncApiRepository as {get: ReturnType<typeof jest.fn>},
      paymentMethodSyncRepository: paymentMethodSyncRepository as {
        replacePaymentMethods: ReturnType<typeof jest.fn>;
      },
    };
  }

  it('requests payment methods from the API and stores the result', async () => {
    const paymentMethods = [
      {
        Codigo: 1,
        Descricao: 'Dinheiro',
        PermiteRecebimento: true,
        PermitePagamentoPromocao: true,
        Ativo: true,
        FormaPagamentoPadrao: 1,
        CondicoesPagamento: [],
        Identificador: 10,
        EmissaoCupomFiscalObrigatoria: false,
        UtilizaCreditoDevolucao: null,
        SolicitarDadosOperadoraBandeiraCartao: false,
        IsPrazo: false,
        IsCartao: false,
        IsRecebimentoEmConta: false,
      },
    ];
    const {service, syncApiRepository, paymentMethodSyncRepository} =
      createService({
        Resultado: paymentMethods,
        Status: 1,
        Mensagens: [],
      });

    await expect(service.sync(user, organizationCode)).resolves.toEqual({
      itemCount: 1,
      message: 'Formas de pagamento sincronizadas.',
    });

    expect(syncApiRepository.get).toHaveBeenCalledWith(
      'arc/formapagamento',
      user,
      organizationCode,
    );
    expect(
      paymentMethodSyncRepository.replacePaymentMethods,
    ).toHaveBeenCalledWith(paymentMethods);
  });

  it('throws when the payment methods endpoint fails', async () => {
    const {service, paymentMethodSyncRepository} = createService({
      Resultado: [],
      Status: 0,
      Mensagens: ['Erro'],
    });

    await expect(service.sync(user, organizationCode)).rejects.toThrow(
      'Falha ao sincronizar formas de pagamento.',
    );
    expect(
      paymentMethodSyncRepository.replacePaymentMethods,
    ).not.toHaveBeenCalled();
  });
});
