import {VendaDto} from '@/modules/sync/types/order-sync.types';

import {OrderListItem} from '../types/order.types';
import {
  MappedOrderPaymentMethod,
  MappedOrderSyncItem,
  OrderSearchRow,
  OrderSyncRow,
} from '../types/orders-data.types';

function addDays(date: Date, days: number): Date {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function splitAmount(total: number, parts: number): number[] {
  const totalCents = Math.round(total * 100);
  const baseValue = Math.floor(totalCents / parts);
  const values = Array(parts).fill(baseValue) as number[];
  let difference = totalCents - baseValue * parts;

  values[parts - 1] += difference;

  return values.map(value => value / 100);
}

export class OrderMapper {
  mapOrderListRows(rows: OrderSearchRow[]): OrderListItem[] {
    const mappedRows: Record<number, OrderSearchRow> = {};

    rows.forEach(row => {
      if (mappedRows[row.id]) {
        mappedRows[row.id].ValorRecebido += row.ValorRecebido;
        return;
      }

      mappedRows[row.id] = {...row};
    });

    const sortedRows = Object.values(mappedRows).sort((currentRow, nextRow) => {
      if (!currentRow.Codigo && nextRow.Codigo) {
        return -1;
      }

      if (currentRow.Codigo && !nextRow.Codigo) {
        return 1;
      }

      if (
        !currentRow.Codigo &&
        !nextRow.Codigo &&
        currentRow.id !== nextRow.id
      ) {
        return nextRow.id - currentRow.id;
      }

      if (currentRow.Codigo && nextRow.Codigo) {
        return Number(nextRow.Codigo) - Number(currentRow.Codigo);
      }

      return 0;
    });

    return sortedRows.map(row => ({
      ...row,
      Codigo: row.Codigo ?? undefined,
      PessoaCodigo: row.PessoaCodigo ?? undefined,
    }));
  }

  mapOrderSyncRows(rows: OrderSyncRow[], terminal: number): VendaDto {
    const uniqueItems = rows.reduce<MappedOrderSyncItem[]>((items, row) => {
      const existingItem = items.find(
        currentItem => currentItem.CodigoProduto === row.CodigoProduto,
      );
      const originalValue = row.ValorVendaDesconto || row.ValorVenda;

      if (!existingItem) {
        items.push({
          CodigoProduto: row.CodigoProduto,
          Descricao: row.DescricaoPedido,
          Quantidade: row.Quantidade,
          ValorUnitario: row.ValorVenda,
          ValorVenda: row.ValorVenda,
          ValorTotal: row.ValorVenda * row.Quantidade,
          UnidadeMedida: row.UnidadeMedida,
          ValorOriginalProduto: originalValue,
          ValorVendaDesconto: row.ValorVendaDesconto || row.ValorVenda,
          ValorDesconto: row.ValorVendaDesconto
            ? Number(
                (row.ValorVenda - row.ValorVendaDesconto) * row.Quantidade,
              ).toFixed(2)
            : '0.00',
        });
      }

      return items;
    }, []);

    const uniquePaymentMethods = rows.reduce<MappedOrderPaymentMethod[]>(
      (paymentMethods, row) => {
        const existingPaymentMethod = paymentMethods.find(
          currentPaymentMethod =>
            currentPaymentMethod.FormaPagamento.Codigo ===
            row.CodigoFormaPagamento,
        );

        if (!existingPaymentMethod) {
          const titles = row.IsPrazo
            ? row.QtdeParcelas > 0
              ? Array.from(
                  {length: row.QtdeParcelas},
                  (_, index) => index + 1,
                ).map((installmentNumber, index) => {
                  const additionalDays =
                    row.QtdeDiasParcelaInicial + index * row.IntervaloDias;
                  const dueDate = addDays(new Date(), additionalDays);
                  const issueDate = new Date();
                  const installmentValues = splitAmount(
                    row.ValorRecebido,
                    row.QtdeParcelas,
                  );

                  return {
                    NumeroParcela: installmentNumber,
                    Emissao: issueDate,
                    Vencimento: dueDate,
                    ContaReceberTituloSituacaoSituacao: 1,
                    ValorBruto: installmentValues[index],
                    FormaPagamento: {
                      Codigo: row.CodigoFormaPagamento,
                    },
                  };
                })
              : null
            : null;

          paymentMethods.push({
            CodigoVenda: null,
            CodigoContaReceberHistorico: null,
            CodigoOperadora: null,
            Valor: row.ValorRecebido,
            ValorRecebido: row.ValorRecebido,
            FormaPagamento: {
              IsPrazo: row.IsPrazo,
              Codigo: row.CodigoFormaPagamento,
              FormaPagamentoPadrao: row.FormaPagamentoPadrao,
              Descricao: row.Descricao,
              CondicoesPagamento: [
                {
                  Codigo: row.CodigoCondicao,
                },
              ],
            },
            CondicaoPagamento: {
              Codigo: row.CodigoCondicao,
            },
            Titulos: titles,
          });
        }

        return paymentMethods;
      },
      [],
    );

    return {
      Codigo: rows[0].CodigoPedidoTable ? rows[0].CodigoPedidoTable : 0,
      DataEmissao: new Date(rows[0].DataEmissao),
      ModuloDeVenda: 2,
      Observacao: rows[0].Observacao,
      MeiosPagamentos: uniquePaymentMethods,
      Pessoa: {
        CNPJCPF: rows[0].CNPJCPF,
        Codigo: rows[0].PessoaCodigo,
        CodigoPessoa: rows[0].CodigoPessoa,
        NomeFantasia: rows[0].NomeFantasia,
        TipoPreco: rows[0].TipoPreco,
        id: rows[0].idPessoa,
      },
      Terminal: {
        Codigo: terminal,
      },
      Itens: uniqueItems,
      Titulos: uniquePaymentMethods.flatMap(
        paymentMethod => paymentMethod.Titulos,
      ),
    } as unknown as VendaDto;
  }
}
