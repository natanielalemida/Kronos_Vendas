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

function dividirValor(total: number, partes: number): number[] {
  const totalCentavos = Math.round(total * 100); // Converte o total para centavos
  const valorBase = Math.floor(totalCentavos / partes); // Valor base em centavos
  const valores: number[] = Array(partes).fill(valorBase); // Preenche todas as partes com o valor base

  let diferenca = totalCentavos - valorBase * partes; // Diferença em centavos

  // Adiciona a diferença na última parte
  valores[partes - 1] += diferenca;

  // Converte os valores de volta para reais (dividindo por 100)
  return valores.map(valor => valor / 100);
}

export default class mapPedido {
  mapearDados(dados, terminal) {
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

    const meiosPagamentosUnicos = dados.reduce((acc, item) => {
      const existente = acc.find(
        mp => mp.FormaPagamento.Codigo === item.CodigoFormaPagamento,
      );

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

                  // Dividir o valor recebido precisamente entre as parcelas
                  const valoresParcelas = dividirValor(
                    item.ValorRecebido,
                    item.QtdeParcelas,
                  );

                  return {
                    NumeroParcela: parcela,
                    Emissao: emissao,
                    Vencimento: dataFormatada,
                    ContaReceberTituloSituacaoSituacao: 1,
                    ValorBruto: valoresParcelas[index], // Define o valor da parcela
                    FormaPagamento: {
                      Codigo: item.CodigoFormaPagamento,
                    },
                  };
                },
              )
            : null
          : null;
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
      Observacao: dados[0].Observacao,
      MeiosPagamentos: meiosPagamentosUnicos,
      Pessoa: {
        CNPJCPF: dados[0].CNPJCPF,
        Codigo: dados[0].PessoaCodigo,
        CodigoPessoa: dados[0].CodigoPessoa,
        NomeFantasia: dados[0].NomeFantasia,
        TipoPreco: dados[0].TipoPreco,
        id: dados[0].idPessoa,
      },
      Terminal: {
        Codigo: terminal,
      },
      Itens: itensUnicos,
      Titulos: meiosPagamentosUnicos.flatMap(mp => mp.Titulos),
    };
  }

  mapearDadosToClone(dados) {
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

    const meiosPagamentosUnicos = dados.reduce((acc, item) => {
      const existente = acc.find(
        mp => mp.FormaPagamento.Codigo === item.CodigoFormaPagamento,
      );

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

                  // Dividir o valor recebido precisamente entre as parcelas
                  const valoresParcelas = dividirValor(
                    item.ValorRecebido,
                    item.QtdeParcelas,
                  );

                  return {
                    NumeroParcela: parcela,
                    Emissao: emissao,
                    Vencimento: dataFormatada,
                    ContaReceberTituloSituacaoSituacao: 1,
                    ValorBruto: valoresParcelas[index], // Define o valor da parcela
                    FormaPagamento: {
                      Codigo: item.CodigoFormaPagamento,
                    },
                  };
                },
              )
            : null
          : null;
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
      Observacao: dados[0].Observacao,
      MeiosPagamentos: meiosPagamentosUnicos,
      OperacaoTipo: dados[0].OperacaoTipo,
      Situacao: dados[0].Situacao,
      TipoMovimentacaoCodigo: dados[0].TipoMovimentacaoCodigo,
      TipoMovimentacaoDescricao: dados[0].TipoMovimentacaoDescricao,
      DataOperacao: dados[0].DataOperacao,
      CodigoOperacaoVinculada: dados[0].CodigoOperacaoVinculada,
      IsOperacaoProcessada: dados[0].IsOperacaoProcessada,
      CodigoPessoa: dados[0].PessoaCodigo
        ? dados[0].PessoaCodigo
        : dados[0].idPessoaRepository,
      Pessoa: {
        CNPJCPF: dados[0].CNPJCPF,
        Codigo: dados[0].PessoaCodigo,
        CodigoPessoa: dados[0].CodigoPessoa,
        NomeFantasia: dados[0].NomeFantasia,
        RazaoSocial: dados[0].RazaoSocial,
        TipoPreco: dados[0].TipoPreco,
      },
      Terminal: {
        Codigo: 1,
      },
      Itens: itensUnicos,
      Titulos: meiosPagamentosUnicos.flatMap(mp => mp.Titulos),
    };
  }

  mapItems(items: Item[]): Item[] {
    const mappedItems: {[key: number]: Item} = {};

    items.forEach(item => {
      if (item.id !== null) {
        if (mappedItems[item.id]) {
          mappedItems[item.id].ValorRecebido += item.ValorRecebido;
        } else {
          mappedItems[item.id] = {...item};
        }
      }
    });

    const sortedItems = Object.values(mappedItems).sort((a, b) => {
      // Prioridade: itens sem 'Codigo' vêm primeiro, seguidos pelos maiores 'id' e 'Codigo'

      // Primeiro, comparar se ambos têm 'Codigo'
      if (!a.Codigo && b.Codigo) {
        return -1; // 'a' vem primeiro
      }
      if (a.Codigo && !b.Codigo) {
        return 1; // 'b' vem primeiro
      }

      // Se ambos não têm 'Codigo' ou ambos têm, comparar pelo 'id'
      if (!a.Codigo && !b.Codigo && a.id !== b.id) {
        return b.id - a.id; // Ordem decrescente pelo 'id'
      }

      // Se ambos têm 'Codigo', comparar os 'Codigo' como números
      if (a.Codigo && b.Codigo) {
        return Number(b.Codigo) - Number(a.Codigo); // Ordem decrescente pelo 'Codigo'
      }

      return 0; // Se tudo for igual, manter a ordem
    });

    return sortedItems;
  }
}
