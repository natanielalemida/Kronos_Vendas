import {knexConfig} from '../../database/connection';

export default class DeleteRepository {
  public async deleteAllWithCodigo(): Promise<void> {
    const tables = [
      'formaPagamento',
      'condicaoPagamento',
      'produtos',
      'pessoa',
      'regiao',
      'categoria',
      'municipio',
      'contato',
      'pedido',
    ];

    const tablesSeleted = [
      'PedidoVinculoMeioPagamento',
      'PedidoVinculoProduto',
    ];

    await Promise.all(
      tables.map(table =>
        knexConfig(table)
          .whereNotNull('Codigo')
          .orWhere('Codigo', '!=', 0)
          .del(),
      ),
    );

    await knexConfig('endereco').where('Codigo', '!=', 0).del();

    await Promise.all(
      tablesSeleted.map(table =>
        knexConfig(table).where('iSincronizado', 1).del(),
      ),
    );
  }

  public async deleteAll(): Promise<void> {
    const tables = [
      'formaPagamento',
      'condicaoPagamento',
      'produtos',
      'pessoa',
      'regiao',
      'categoria',
      'municipio',
      'contato',
      'pedido',
      'PedidoVinculoProduto',
      'PedidoVinculoMeioPagamento',
    ];

    await Promise.all(tables.map(table => knexConfig(table).del()));
  }
}
