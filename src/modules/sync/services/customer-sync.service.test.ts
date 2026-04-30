import {beforeEach, describe, expect, it, jest} from '@jest/globals';
import {UserDto} from '@/shared/types';

import {CustomerSyncRepository} from '../repositories/customer-sync.repository';
import {SyncApiRepository} from '../repositories/sync-api.repository';
import {CustomerSyncService} from './customer-sync.service';

describe('CustomerSyncService', () => {
  const user = {Hash: 'hash'} as UserDto;
  const organizationCode = 1;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  function createService(response: unknown) {
    const syncApiRepository = {
      get: jest.fn().mockResolvedValue(response),
    } as unknown as SyncApiRepository;
    const customerSyncRepository = {
      replaceCustomers: jest.fn().mockResolvedValue(undefined),
    } as unknown as CustomerSyncRepository;

    return {
      service: new CustomerSyncService(
        syncApiRepository,
        customerSyncRepository,
      ),
      syncApiRepository: syncApiRepository as {get: ReturnType<typeof jest.fn>},
      customerSyncRepository: customerSyncRepository as {
        replaceCustomers: ReturnType<typeof jest.fn>;
      },
    };
  }

  it('requests customers from the mobile sales endpoint and stores them', async () => {
    const customers = [
      {
        id: 1,
        Codigo: 10,
        isSincronizado: 1,
        Categoria: null,
        Regiao: null,
        DiaPagamento: 0,
        LimiteCompra: 0,
        BloquearCliente: false,
        ForcarAtualizacaoCadastro: false,
        CarenciaPagamento: 0,
        DescontoMaximo: 0,
        DataNascimento: null,
        TipoPreco: null,
        PessoaReferencia: [],
        MeiosPagamento: [],
        AcrescimoPercentual: null,
        Veiculos: null,
        PermiteComprarPazo: true,
        CodigoPessoa: 10,
        PessoaFJ: 1,
        RazaoSocial: 'Cliente 1',
        NomeFantasia: 'Cliente 1',
        CNPJCPF: '12345678901',
        IERG: null,
        TipoContribuinte: 1,
        Observacao: null,
        Ativo: true,
        DataCadastro: '2026-04-30',
        ResponsavelCadastro: {
          CodigoUsuario: 1,
          Nome: 'Admin',
          DescontoMaximoVenda: 0,
          DescontoMaximoRecebimento: 0,
        },
        Enderecos: [],
        Contatos: [],
      },
    ];
    const {service, syncApiRepository, customerSyncRepository} = createService({
      Resultado: customers,
      Status: 1,
      Mensagens: [],
    });

    await expect(service.sync(user, organizationCode)).resolves.toEqual({
      itemCount: 1,
      message: 'Clientes sincronizados.',
    });

    expect(syncApiRepository.get).toHaveBeenCalledWith(
      'arc/cliente/vendas/mobile?CodigoRegiao=null;CodigoCategoria=null',
      user,
      organizationCode,
    );
    expect(customerSyncRepository.replaceCustomers).toHaveBeenCalledWith(
      customers,
    );
  });

  it('throws when the customer sync endpoint fails', async () => {
    const {service, customerSyncRepository} = createService({
      Resultado: [],
      Status: 0,
      Mensagens: ['Erro'],
    });

    await expect(service.sync(user, organizationCode)).rejects.toThrow(
      'Falha ao sincronizar clientes.',
    );
    expect(customerSyncRepository.replaceCustomers).not.toHaveBeenCalled();
  });
});
