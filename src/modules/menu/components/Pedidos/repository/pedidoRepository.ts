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
    clienteId?: number;
  }): Promise<PedidoSearchDto[]> {
    const data = knexConfig('pedido')
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

    if (options.clienteId) {
      data.where('pessoa.id', options.clienteId);
    }

    if (options.notSyncd && !options.syncds) {
      const result = await data.andWhere('pedido.Codigo', null);
      return this.mapper.mapItems(result);
    }

    if (!options.notSyncd && options.syncds) {
      const result = await data.whereNotNull('pedido.Codigo');
      return this.mapper.mapItems(result);
    }

    if (!options.notSyncd && !options.syncds) {
      return [];
    }

    const result = await data; // Execute the query
    return this.mapper.mapItems(result);
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

  async updatePedidoIdCliente(pedidoId: number, clienteId: number) {
    await knexConfig('pedido')
      .update('CodigoPessoa', clienteId)
      .where('id', pedidoId);
  }

  async getPedidoById(
    id: number,
    terminal: number,
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
          'pessoa.RazaoSocial',
          'pessoa.CNPJCPF as CNPJCPF',
          'pessoa.TipoPreco',
          'pessoa.id as idPessoa',
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

      return this.mapper.mapearDados(data, terminal);
    } catch (error) {
      console.error(error);
    }
  }

  async getPedidoByIdToClone(id: number): Promise<PedidoSearchDto | undefined> {
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
          'pessoa.RazaoSocial',
          'pessoa.CNPJCPF as CNPJCPF',
          'pessoa.TipoPreco',
          'pessoa.id as idPessoaRepository',
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

      return this.mapper.mapearDadosToClone(data);
    } catch (error) {
      console.error(error);
    }
  }

  async getPedidoByIdNotSynced(
    id: number,
    terminal: number,
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

      return this.mapper.mapearDados(data, terminal);
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

  async clonePedidoById(id: number): Promise<number | undefined> {
    try {
      // 1. Buscar o pedido pelo ID usando a função já existente
      const pedidoOriginal = await this.getPedidoByIdToClone(id);

      if (!pedidoOriginal) {
        throw new Error('Pedido não encontrado');
      }

      // 2. Remover ou ajustar campos que não podem ser duplicados
      const {
        ModuloDeVenda,
        OperacaoTipo,
        TipoMovimentacaoCodigo,
        TipoMovimentacaoDescricao,
        DataOperacao,
        Observacao,
        CodigoOperacaoVinculada,
        IsOperacaoProcessada,
        CodigoPessoa,
        // Produtos e outros detalhes relacionados serão tratados depois
      } = pedidoOriginal;

      console.log({CodigoPessoa});

      // 3. Criar um novo pedido com os dados clonados (exceto campos únicos como 'CodigoPedidoTable')
      const [novoPedidoId] = await knexConfig('pedido').insert({
        DataEmissao: new Date(),
        ModuloDeVenda,
        OperacaoTipo,
        Situacao: 0,
        TipoMovimentacaoCodigo,
        TipoMovimentacaoDescricao,
        DataOperacao: new Date(),
        Observacao,
        CodigoOperacaoVinculada,
        IsOperacaoProcessada,
        CodigoPessoa,
        OperacaoSituacao: 1,
      });

      // 4. Clonar os produtos vinculados ao pedido original
      if (pedidoOriginal.Itens && novoPedidoId) {
        const produtosClonados = pedidoOriginal.Itens.map((produto: any) => ({
          CodigoPedido: novoPedidoId, // Associa ao novo pedido
          CodigoProduto: produto.CodigoProduto,
          Descricao: produto.Descricao,
          Quantidade: produto.Quantidade,
          ValorCusto: produto.ValorCusto,
          ValorVenda: produto.ValorVenda,
          ValorOriginalProduto: produto.ValorOriginalProduto,
          UnidadeMedida: produto.UnidadeMedida,
          ValorVendaDesconto: produto.ValorVendaDesconto,
        }));

        console.log({produtosClonados});

        await knexConfig('PedidoVinculoProduto').insert(produtosClonados);
      }

      // 5. Clonar os meios de pagamento
      if (pedidoOriginal.MeiosPagamentos && novoPedidoId) {
        const meiosPagamentoClonados = pedidoOriginal.MeiosPagamentos.flatMap(
          (meioPagamento: any) => {
            const {FormaPagamento, ValorRecebido} = meioPagamento;
            const {CondicoesPagamento, Codigo} = FormaPagamento;

            return CondicoesPagamento.map((condicaoPagamento: any) => ({
              CodigoPedido: novoPedidoId, // Associa ao novo pedido
              CodigoFormaPagamento: Codigo, // Usa o código de forma de pagamento
              CodigoCondicao: condicaoPagamento.Codigo,
              ValorRecebido: ValorRecebido,
            }));
          },
        );

        console.log({meiosPagamentoClonados});

        await knexConfig('PedidoVinculoMeioPagamento').insert(
          meiosPagamentoClonados,
        );
      }

      return novoPedidoId; // Retorna o ID do novo pedido clonado
    } catch (error) {
      console.error('Erro ao clonar o pedido:', error);
      throw new Error('Falha ao clonar o pedido');
    }
  }
}
