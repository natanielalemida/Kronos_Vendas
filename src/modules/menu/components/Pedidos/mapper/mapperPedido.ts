type Item = {
  Codigo: number | null;
  DataEmissao: string;
  NomeFantasia: string;
  ValorRecebido: number;
  id: number;
};

export default class mapPedido {
  mapearDados(dados) {
    const itensUnicos = dados.reduce((acc, item) => {
      const existente = acc.find(i => i.CodigoProduto === item.CodigoProduto);
      const valor = item.ValorVendaDesconto
        ? item.ValorVendaDesconto
        : item.ValorVenda;

      if (!existente) {
        acc.push({
          CodigoProduto: item.CodigoProduto,
          Descricao: item.DescricaoPedido,
          Quantidade: item.Quantidade,
          ValorUnitario: item.ValorVenda,
          ValorVenda: item.ValorVenda,
          ValorTotal: item.ValorVenda * item.Quantidade,
          UnidadeMedida: item.UnidadeMedida,
          ValorOriginalProduto: valor,
          ValorVendaDesconto: item.ValorVendaDesconto
            ? item.ValorVendaDesconto
            : item.ValorVenda,
          ValorDesconto: item.ValorVendaDesconto
            ? Number(
                (item.ValorVenda - item.ValorVendaDesconto) * item.Quantidade,
              ).toFixed(2)
            : '0.00',
        });
      }
      return acc;
    }, []);

    // Mapeamento das formas de pagamento únicas
    const meiosPagamentosUnicos = dados.reduce((acc, item) => {
      const existente = acc.find(
        mp => mp.FormaPagamento.Codigo === item.CodigoFormaPagamento,
      );
      if (!existente) {
        acc.push({
          CodigoVenda: null,
          CodigoContaReceberHistorico: null,
          CodigoOperadora: null,
          Valor: item.ValorRecebido,
          ValorRecebido: item.ValorRecebido,
          FormaPagamento: {
            Codigo: item.CodigoFormaPagamento,
            FormaPagamentoPadrao: item.FormaPagamentoPadrao,
            Descricao: item.Descricao,
            CondicoesPagamento: [
              {
                Codigo: item.CodigoCondicao,
              },
            ],
          },
          CondicaoPagamento: {
            Codigo: item.CodigoCondicao,
          },
        });
      }
      return acc;
    }, []);

    return {
      Codigo: dados[0].CodigoPedidoTable ? dados[0].CodigoPedidoTable : 0,
      DataEmissao: new Date(dados[0].DataEmissao),
      ModuloDeVenda: 2,
      MeiosPagamentos: meiosPagamentosUnicos,
      Pessoa: {
        CNPJCPF: dados[0].CNPJCPF,
        Codigo: dados[0].PessoaCodigo,
        CodigoPessoa: dados[0].CodigoPessoa,
        NomeFantasia: dados[0].NomeFantasia,
        TipoPreco: dados[0].TipoPreco,
      },
      Terminal: {
        Codigo: 1,
      },
      Itens: itensUnicos,
    };
  }

  mapItems(items: Item[]): Item[] {
    const mappedItems: {[key: number]: Item} = {};

    items.forEach(item => {
      if (item.id !== null) {
        // Se o código já existe no objeto acumulador, soma o ValorRecebido
        if (mappedItems[item.id]) {
          mappedItems[item.id].ValorRecebido += item.ValorRecebido;
        } else {
          // Caso contrário, adiciona o item ao acumulador
          mappedItems[item.id] = {...item};
        }
      }
    });

    // Retorna os itens acumulados em forma de array
    return Object.values(mappedItems);
  }
}
