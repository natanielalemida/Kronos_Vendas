import {Knex} from 'knex';

import {knexConfig} from '@/database/connection';

import {OrderMapper} from '../mappers/order.mapper';
import {OrderListItem, OrdersFilterOptions} from '../types/order.types';
import {OrderSearchRow, OrderSyncRow} from '../types/orders-data.types';
import {VendaDto} from '@/modules/sync/types/order-sync.types';

export class OrderRepository {
  constructor(private readonly mapper = new OrderMapper()) {}

  async searchOrders(options: OrdersFilterOptions): Promise<OrderListItem[]> {
    const query = knexConfig('pedido')
      .select(
        'pedido.id',
        'pedido.Codigo',
        'pedido.Situacao',
        'pedido.DataEmissao',
        'pessoa.NomeFantasia',
        'pessoa.id as idPessoa',
        'pessoa.Codigo as PessoaCodigo',
        'PedidoVinculoMeioPagamento.ValorRecebido',
      )
      .innerJoin('pessoa', function (this: Knex.JoinClause) {
        this.on(function (this: Knex.JoinClause) {
          this.on('pedido.CodigoPessoa', '=', 'pessoa.Codigo').orOn(
            knexConfig.raw(
              'pessoa.Codigo IS NULL AND pedido.CodigoPessoa = pessoa.id',
            ),
          );
        });
      })
      .innerJoin(
        'PedidoVinculoMeioPagamento',
        function (this: Knex.JoinClause) {
          this.on(function (this: Knex.JoinClause) {
            this.on(
              'PedidoVinculoMeioPagamento.CodigoPedido',
              '=',
              'pedido.Codigo',
            ).orOn(
              knexConfig.raw(
                'pedido.Codigo IS NULL AND PedidoVinculoMeioPagamento.CodigoPedido = pedido.id',
              ),
            );
          });
        },
      );

    if (options.clienteId) {
      query.where('pessoa.id', options.clienteId);
    }

    if (options.notSyncd && !options.syncds) {
      const rows = (await query.andWhere(
        'pedido.Codigo',
        null,
      )) as OrderSearchRow[];
      return this.mapper.mapOrderListRows(rows);
    }

    if (!options.notSyncd && options.syncds) {
      const rows = (await query.whereNotNull(
        'pedido.Codigo',
      )) as OrderSearchRow[];
      return this.mapper.mapOrderListRows(rows);
    }

    if (!options.notSyncd && !options.syncds) {
      return [];
    }

    const rows = (await query) as OrderSearchRow[];
    return this.mapper.mapOrderListRows(rows);
  }

  async updateOrderCustomerId(orderId: number, customerCode: number) {
    await knexConfig('pedido')
      .update('CodigoPessoa', customerCode)
      .where('id', orderId);
  }

  async getOrderSyncPayloadById(
    id: number,
    terminal: number,
  ): Promise<VendaDto | undefined> {
    const rows = (await knexConfig('pedido')
      .select(
        'pedido.Codigo as CodigoPedidoTable',
        'pedido.DataEmissao',
        'pedido.ModuloDeVenda',
        'pedido.OperacaoTipo',
        'pedido.Situacao',
        'pedido.TipoMovimentacaoCodigo',
        'pedido.TipoMovimentacaoDescricao',
        'pedido.DataOperacao',
        'pedido.Observacao',
        'pedido.CodigoOperacaoVinculada',
        'pedido.IsOperacaoProcessada',
        'pedido.CodigoPessoa',
        'formaPagamento.*',
        'PedidoVinculoProduto.Descricao as DescricaoPedido',
        'PedidoVinculoProduto.Quantidade',
        'PedidoVinculoProduto.ValorCusto',
        'PedidoVinculoProduto.ValorVenda',
        'PedidoVinculoProduto.ValorOriginalProduto',
        'PedidoVinculoProduto.UnidadeMedida',
        'PedidoVinculoProduto.ValorVendaDesconto',
        'PedidoVinculoMeioPagamento.*',
        'condicaoPagamento.*',
        'produtos.ValorVendaAtacado',
        'produtos.Codigo as CodigoProduto',
        'pessoa.Codigo as PessoaCodigo',
        'pessoa.CodigoPessoa as CodigoPessoa',
        'pessoa.NomeFantasia',
        'pessoa.RazaoSocial',
        'pessoa.CNPJCPF as CNPJCPF',
        'pessoa.TipoPreco',
        'pessoa.id as idPessoa',
      )
      .innerJoin('pessoa', function (this: Knex.JoinClause) {
        this.on(function (this: Knex.JoinClause) {
          this.on('pedido.CodigoPessoa', '=', 'pessoa.Codigo').orOn(
            knexConfig.raw(
              'pessoa.Codigo IS NULL AND pedido.CodigoPessoa = pessoa.id',
            ),
          );
        });
      })
      .innerJoin('PedidoVinculoProduto', function (this: Knex.JoinClause) {
        this.on(function (this: Knex.JoinClause) {
          this.on(
            'PedidoVinculoProduto.CodigoPedido',
            '=',
            'pedido.Codigo',
          ).orOn(
            knexConfig.raw(
              'pedido.Codigo IS NULL AND PedidoVinculoProduto.CodigoPedido = pedido.id',
            ),
          );
        });
      })
      .innerJoin(
        'produtos',
        'produtos.Codigo',
        'PedidoVinculoProduto.CodigoProduto',
      )
      .innerJoin(
        'PedidoVinculoMeioPagamento',
        function (this: Knex.JoinClause) {
          this.on(function (this: Knex.JoinClause) {
            this.on(
              'PedidoVinculoMeioPagamento.CodigoPedido',
              '=',
              'pedido.Codigo',
            ).orOn(
              knexConfig.raw(
                'pedido.Codigo IS NULL AND PedidoVinculoMeioPagamento.CodigoPedido = pedido.id',
              ),
            );
          });
        },
      )
      .innerJoin(
        'formaPagamento',
        'formaPagamento.Codigo',
        'PedidoVinculoMeioPagamento.CodigoFormaPagamento',
      )
      .innerJoin(
        'condicaoPagamento',
        'condicaoPagamento.Codigo',
        'PedidoVinculoMeioPagamento.CodigoCondicao',
      )
      .where('pedido.id', id)) as OrderSyncRow[];

    if (!rows.length) {
      return undefined;
    }

    return this.mapper.mapOrderSyncRows(rows, terminal);
  }

  async deleteOrderById(id: number): Promise<void> {
    const transaction = await knexConfig.transaction();

    try {
      await transaction('pedido').where('id', id).del();
      await transaction('PedidoVinculoProduto').where('CodigoPedido', id).del();
      await transaction('PedidoVinculoMeioPagamento')
        .where('CodigoPedido', id)
        .del();

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
