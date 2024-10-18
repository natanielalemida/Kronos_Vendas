import {knexConfig} from '../../../../../database/connection';
import mapPedido from '../mapper/mapperPedido';
import {PedidoSearchDto} from '../type';

export default class PedidoRepository {
  private mapper: mapPedido;

  constructor() {
    this.mapper = new mapPedido();
  }

  async search() {
    const data = await knexConfig('pedido')
      .select('*')
      .innerJoin('pessoa', function () {
        this.on(function () {
          this.on('pedido.CodigoPessoa', '=', 'pessoa.Codigo').orOn(
            knexConfig.raw(
              'pessoa.Codigo IS NULL AND pedido.CodigoPessoa = pessoa.id',
            ),
          );
        });
      })
      .innerJoin('PedidoVinculoProduto', function () {
        this.on(function () {
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
      .innerJoin('PedidoVinculoMeioPagamento', function () {
        this.on(function () {
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
      })
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
      .limit(10)
      .offset(20);
  }

  async searchPedidoComPessoa(options: {
    syncds: boolean;
    notSyncd: boolean;
  }): Promise<PedidoSearchDto[]> {
    const data = knexConfig('pedido')
      .select(
        'pedido.id',
        'pedido.Codigo',
        'pedido.DataEmissao',
        'pessoa.NomeFantasia',
        'PedidoVinculoMeioPagamento.ValorRecebido',
      )
      .innerJoin('pessoa', function () {
        this.on(function () {
          this.on('pedido.CodigoPessoa', '=', 'pessoa.Codigo').orOn(
            knexConfig.raw(
              'pessoa.Codigo IS NULL AND pedido.CodigoPessoa = pessoa.id',
            ),
          );
        });
      })
      .innerJoin('PedidoVinculoMeioPagamento', function () {
        this.on(function () {
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
      });

    if (options.notSyncd && !options.syncds) {
      const result = await data.andWhere('pedido.Codigo', null);
      return this.mapper.mapItems(result);
    }

    if (!options.notSyncd && options.syncds) {
      const result = await data.whereNotNull('pedido.Codigo');
      return this.mapper.mapItems(await data);
    }

    if (!options.notSyncd && !options.syncds) {
      return [];
    }

    const result = this.mapper.mapItems(await data);
    return result;
  }

  async searchPedidoComPessoaNotSynbced(): Promise<PedidoSearchDto[]> {
    const data = knexConfig('pedido')
      .select(
        'pedido.id',
        'pedido.Codigo',
        'pedido.DataEmissao',
        'pessoa.NomeFantasia',
      )
      .innerJoin('pessoa', function () {
        this.on(function () {
          this.on('pedido.CodigoPessoa', '=', 'pessoa.Codigo').orOn(
            knexConfig.raw(
              'pessoa.Codigo IS NULL AND pedido.CodigoPessoa = pessoa.id',
            ),
          );
        });
      })
      .andWhere('pedido.Codigo', null);

    const result = await data;
    return result;
  }

  async getPedidoById(id: number): Promise<PedidoSearchDto | undefined> {
    try {
      const data = await knexConfig('pedido')
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
          'pessoa.CNPJCPF as CNPJCPF',
          'pessoa.TipoPreco',
        )
        .innerJoin('pessoa', function () {
          this.on(function () {
            this.on('pedido.CodigoPessoa', '=', 'pessoa.Codigo').orOn(
              knexConfig.raw(
                'pessoa.Codigo IS NULL AND pedido.CodigoPessoa = pessoa.id',
              ),
            );
          });
        })
        .innerJoin('PedidoVinculoProduto', function () {
          this.on(function () {
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
        .innerJoin('PedidoVinculoMeioPagamento', function () {
          this.on(function () {
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
        })
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
        .where('pedido.id', id);

      if (!data.length) return undefined;

      return this.mapper.mapearDados(data);
    } catch (error) {
      console.error(error);
    }
  }

  async getPedidoByIdNotSynced(
    id: number,
  ): Promise<PedidoSearchDto | undefined> {
    try {
      const data = await knexConfig('pedido')
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
          'pessoa.CNPJCPF as CNPJCPF',
          'pessoa.TipoPreco',
        )
        .innerJoin('pessoa', 'pessoa.id', '=', 'pedido.CodigoPessoa')
        .innerJoin('PedidoVinculoProduto', function () {
          this.on(function () {
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
        .innerJoin('PedidoVinculoMeioPagamento', function () {
          this.on(function () {
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
        })
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
        .where('pedido.id', id);

      if (!data.length) return undefined;

      return this.mapper.mapearDados(data);
    } catch (error) {
      console.error(error);
    }
  }

  async deletePedidoById(id: number) {
    const trx = await knexConfig.transaction(); // Inicia uma transação

    try {
      // Deleta o pedido
      await trx('pedido').where('id', id).del();

      // Deleta os produtos vinculados ao pedido
      await trx('PedidoVinculoProduto').where('CodigoPedido', id).del();

      // Deleta os meios de pagamento vinculados ao pedido
      await trx('PedidoVinculoMeioPagamento').where('CodigoPedido', id).del();

      await trx.commit(); // Confirma a transação
    } catch (error) {
      await trx.rollback(); // Desfaz a transação em caso de erro
      console.error('Erro ao deletar pedido:', error);
      throw error; // Propaga o erro para tratamento externo, se necessário
    }
  }
}
