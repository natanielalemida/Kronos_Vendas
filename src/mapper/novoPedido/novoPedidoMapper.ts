export default class NovoPedidoMapper {
  static mapSale() {
    // nao completo, falta algumas chaves

    return {
      ModuloDeVenda: 1, //numero com o modulo de venda, nao achei nada sobre mobile no dto, vou deixar PDV por enquanto
      Cliente: {Codigo: 1}, // codigo do cliente
      MeiosPagamentos: [
        {
          Codigo: 1, //codigo da forma de pagamento
          Valor: 150.0, // valor total pedido,
          ValorRecebido: 50.0, // valor recebido forma de pagamento
        },
      ],
      OperacaoTipo: 1, // tipo da venda, se eh venda, orcamento ou pre venda
      faturada: true, //boolean
      ResponsavelFaturamento: {
        CodigoUsuario: 1, //codigo do usuario logado
      },
      Situacao: 'Pendente', //situacao do pedido
      ValorRecebido: 150.0, // valor recebido
      ValorTotalLiquido: 150.0, // valor total do pedido
      Itens: [
        {
          ValorCusto: 150.0, //valor de custo do produto
          ValorOriginalProduto: 150.0, // valor original sem desconto
          Quantidade: 1,
          ValorUnitario: 150.0,
          CodigoProduto: 1, // codigo produto
        },
      ],
    };
  }
}
