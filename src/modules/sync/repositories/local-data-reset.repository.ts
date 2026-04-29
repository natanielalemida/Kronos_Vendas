import {knexConfig} from '@/database/connection';

export class LocalDataResetRepository {
  async clearSyncedRecords(): Promise<void> {
    await knexConfig.transaction(async transaction => {
      await transaction('PedidoVinculoMeioPagamento')
        .where('iSincronizado', 1)
        .del();
      await transaction('PedidoVinculoProduto').where('iSincronizado', 1).del();
      await transaction('pedido')
        .whereNotNull('Codigo')
        .orWhere('Codigo', '!=', 0)
        .del();
      await transaction('contato').whereNotNull('Codigo').del();
      await transaction('endereco').where('Codigo', '!=', 0).del();
      await transaction('pessoa')
        .whereNotNull('Codigo')
        .orWhere('Codigo', '!=', 0)
        .del();
      await transaction('formaPagamento').del();
      await transaction('condicaoPagamento').del();
      await transaction('produtos').del();
      await transaction('regiao').del();
      await transaction('categoria').del();
    });
  }

  async clearAllRecords(): Promise<void> {
    await knexConfig.transaction(async transaction => {
      await transaction('PedidoVinculoMeioPagamento').del();
      await transaction('PedidoVinculoProduto').del();
      await transaction('pedido').del();
      await transaction('contato').del();
      await transaction('endereco').del();
      await transaction('pessoa').del();
      await transaction('produto_imagem').del();
      await transaction('formaPagamento').del();
      await transaction('condicaoPagamento').del();
      await transaction('produtos').del();
      await transaction('regiao').del();
      await transaction('categoria').del();
      await transaction('municipio').del();
      await transaction('muncipio_version').del();
    });
  }
}
