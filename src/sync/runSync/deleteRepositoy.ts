import {knexConfig} from '../../database/connection';

export default class DeleteRepository {
  public async deleteAll(): Promise<void> {
    const tables = [
      'formaPagamento',
      'condicaoPagamento',
      'produtos',
      'pessoa',
      'regiao',
      'categoria',
      'municipio',
      'endereco',
      'contato',
      'pedido',
      'PedidoVinculoMeioPagamento',
      'PedidoVinculoProduto',
    ];

    await Promise.all(tables.map(table => knexConfig(table).truncate()));
  }
}
