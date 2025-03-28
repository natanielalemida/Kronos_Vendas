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
        // Cálculo do valor com desconto (se aplicável)
        const taxaDesconto =
          parseFloat(produto.ValorDesconto) / parseFloat(produto.Quantidade);
        const valor = parseFloat(produto.ValorDesconto)
          ? parseFloat(produto.ValorProduto) - taxaDesconto
          : null;

        return {
          iSincronizado: 1,
          CodigoPedido: pedido.Codigo,
          CodigoProduto: produto.CodigoProduto,
          Quantidade: produto.Quantidade,
          ValorCusto: produto.ValorCusto,
          Descricao: produto.Descricao,
          ValorVenda: produto.ValorProduto,
          UnidadeMedida: produto.UnidadeMedida,
          ValorOriginalProduto: produto.ValorOriginalProduto,
          ValorVendaDesconto:
            valor !== null ? parseFloat(valor.toFixed(2)) : null, // Formatação correta do valor
        };
      }),
      MeioPagamentoRelacao: pedido.MeiosPagamentos.map(pagamento => {
        return {
          CodigoPedido: pedido.Codigo,
          CodigoFormaPagamento: pagamento.FormaPagamento.Codigo,
          CodigoCondicao: pagamento.CondicaoPagamento.Codigo,
          ValorRecebido: pagamento.ValorRecebido,
          iSincronizado: 1,
        };
      }),
    };
  }
}
