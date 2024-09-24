import {PedidoToSaveDto, VendaDto} from '../type';

export default class PedidoMapper {
  saveOne(pedido: VendaDto): PedidoToSaveDto {
    return {
      Pedido: {
        Codigo: pedido.Codigo,
        DataEmissao: pedido.DataEmissao,
        ModuloDeVenda: pedido.ModuloDeVenda,
        OperacaoTipo: pedido.OperacaoTipo,
        Situacao: pedido.Situacao,
        CodigoClienteEndereco: pedido.CodigoClienteEndereco,
        TipoMovimentacaoCodigo: pedido.TipoMovimentacao.Codigo,
        TipoMovimentacaoDescricao: pedido.TipoMovimentacao.Descricao,
        OperacaoSituacao: pedido.OperacaoSituacao,
        DataOperacao: pedido.DataOperacao,
        Observacao: pedido.Observacao,
        CodigoOperacaoVinculada: pedido.CodigoOperacaoVinculada,
        IsOperacaoProcessada: pedido.IsOperacaoProcessada,
        CodigoPessoa: pedido.Pessoa.Codigo,
      },
      ProdutosRelacao: pedido.Itens.map(produto => {
        console.log({valorDesconto: produto.ValorDesconto});
        return {
          CodigoPedido: pedido.Codigo,
          CodigoProduto: produto.CodigoProduto,
          Quantidade: produto.Quantidade,
          ValorVendaDesconto: parseFloat(produto.ValorDesconto)
            ? (parseFloat(produto.ValorDesconto) -
                parseFloat(produto.ValorProduto)) /
                parseFloat(produto.Quantidade) +
              parseFloat(produto.ValorProduto)
            : null,
        };
      }),
      MeioPagamentoRelacao: pedido.MeiosPagamentos.map(pagamento => {
        return {
          CodigoPedido: pedido.Codigo,
          CodigoFormaPagamento: pagamento.FormaPagamento.Codigo,
          CodigoCondicao: pagamento.CondicaoPagamento.Codigo,
          ValorRecebido: pagamento.ValorRecebido,
        };
      }),
    };
  }
}
