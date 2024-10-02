type Item = {
  Codigo: number | null;
  DataEmissao: string;
  NomeFantasia: string;
  ValorRecebido: number;
  id: number;
};

function adicionarDias(data: Date, dias: number): Date {
  const novaData = new Date(data);
  novaData.setDate(novaData.getDate() + dias);
  return novaData;
}

// Função para formatar a data em 'DD/MM/YYYY'
function formatarData(data: Date): string {
  const dia = data.getDate().toString().padStart(2, '0');
  const mes = (data.getMonth() + 1).toString().padStart(2, '0');
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

function dividirPrecisamente(
  valor: number,
  quantidade: number,
  casasDecimais: number = 10,
): number {
  // Realiza a divisão e arredonda o resultado para o número de casas decimais especificado
  const resultadoDivisao = parseFloat(
    (valor / quantidade).toFixed(casasDecimais),
  );

  // Retorna o valor dividido com precisão
  return resultadoDivisao;
}

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

    // Mapeamento das formas de pagamento únicas, incluindo Titulos
    const meiosPagamentosUnicos = dados.reduce((acc, item) => {
      const existente = acc.find(
        mp => mp.FormaPagamento.Codigo === item.CodigoFormaPagamento,
      );

      // Se não existe, adiciona um novo meio de pagamento
      if (!existente) {
        const Titulos = !!item.IsPrazo
          ? item.QtdeParcelas > 0
            ? Array.from({length: item.QtdeParcelas}, (_, i) => i + 1).map(
                (parcela, index) => {
                  const diasAdicionais =
                    item.QtdeDiasParcelaInicial + index * item.IntervaloDias;
                  const dataParcela = adicionarDias(new Date(), diasAdicionais);
                  const dataFormatada = dataParcela;
                  const emissao = new Date();

                  return {
                    NumeroParcela: parcela,
                    Emissao: emissao,
                    Vencimento: dataFormatada,
                    ContaReceberTituloSituacaoSituacao: 1,
                    ValorBruto: dividirPrecisamente(
                      item.ValorRecebido,
                      item.QtdeParcelas,
                    ),
                    FormaPagamento: {
                      Codigo: item.CodigoFormaPagamento,
                    },
                  };
                },
              )
            : null
          : null;

        console.log({TitulosTesteAAAAAAA: Titulos});

        acc.push({
          CodigoVenda: null,
          CodigoContaReceberHistorico: null,
          CodigoOperadora: null,
          Valor: item.ValorRecebido,
          ValorRecebido: item.ValorRecebido,
          FormaPagamento: {
            IsPrazo: item.IsPrazo,
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
          Titulos,
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
      Titulos: meiosPagamentosUnicos.flatMap(mp => mp.Titulos), // Combina todos os títulos
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
