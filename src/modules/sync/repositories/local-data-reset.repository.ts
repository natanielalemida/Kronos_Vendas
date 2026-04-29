import {knexConfig} from '@/database/connection';

export class LocalDataResetRepository {
  async clearSyncedRecords(): Promise<void> {
    await Promise.all([
      knexConfig('formaPagamento').del(),
      knexConfig('condicaoPagamento').del(),
      knexConfig('produtos').del(),
      knexConfig('regiao').del(),
      knexConfig('categoria').del(),
      knexConfig('contato').whereNotNull('Codigo').del(),
      knexConfig('pedido')
        .whereNotNull('Codigo')
        .orWhere('Codigo', '!=', 0)
        .del(),
      knexConfig('PedidoVinculoMeioPagamento').where('iSincronizado', 1).del(),
      knexConfig('PedidoVinculoProduto').where('iSincronizado', 1).del(),
      knexConfig('endereco').where('Codigo', '!=', 0).del(),
      knexConfig('pessoa')
        .whereNotNull('Codigo')
        .orWhere('Codigo', '!=', 0)
        .del(),
    ]);
  }

  async clearAllRecords(): Promise<void> {
    await Promise.all([
      knexConfig('formaPagamento').del(),
      knexConfig('condicaoPagamento').del(),
      knexConfig('produtos').del(),
      knexConfig('pessoa').del(),
      knexConfig('regiao').del(),
      knexConfig('categoria').del(),
      knexConfig('municipio').del(),
      knexConfig('contato').del(),
      knexConfig('endereco').del(),
      knexConfig('pedido').del(),
      knexConfig('PedidoVinculoProduto').del(),
      knexConfig('PedidoVinculoMeioPagamento').del(),
      knexConfig('produto_imagem').del(),
      knexConfig('muncipio_version').del(),
    ]);
  }
}
