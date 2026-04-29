import {knexConfig} from '@/database/connection';
import {FormaPagamento} from '@/modules/sync/types/payment-method-sync.types';

type SalePayload = {
  DataEmissao: Date;
  ModuloDeVenda: number;
  OperacaoTipo: number;
  Situacao: number;
  CodigoClienteEndereco: null;
  TipoMovimentacaoCodigo: number;
  TipoMovimentacaoDescricao: string;
  OperacaoSituacao: number;
  DataOperacao: Date;
  Observacao: string;
  CodigoOperacaoVinculada: number;
  IsOperacaoProcessada: number;
  CodigoPessoa?: number;
};

type SalePaymentMethodPayload = {
  CodigoPedido: number;
  CodigoFormaPagamento: number;
  CodigoCondicao: number;
  ValorRecebido: number;
};

type SaleProductPayload = {
  CodigoPedido: number;
  CodigoProduto: number;
  Quantidade: number;
  ValorVendaDesconto: number;
  Descricao: string;
  ValorCusto: number;
  ValorVenda: number;
  ValorOriginalProduto: number;
  UnidadeMedida: string;
};

type PaymentMethodJoinedRow = {
  id: number;
  Codigo: number;
  CodigoFormaPagamento: number;
  Descricao: string;
  EmissaoCupomFiscalObrigatoria: boolean;
  FormaPagamentoPadrao: number;
  Identificador: number;
  IntervaloDias: number;
  IsCartao: boolean;
  IsPrazo: boolean;
  IsRecebimentoEmConta: boolean;
  PermitePagamentoPromocao: boolean;
  PermiteRecebimento: boolean;
  QtdeDiasParcelaInicial: number;
  QtdeParcelas: number;
  SolicitarDadosOperadoraBandeiraCartao: boolean;
  Tarifas: string;
  UtilizaCreditoDevolucao: boolean;
  Ativo: boolean;
};

export class SalesCheckoutRepository {
  async getPaymentMethods(): Promise<FormaPagamento[]> {
    const rows = (await knexConfig('formaPagamento')
      .select('*')
      .innerJoin(
        'condicaoPagamento',
        'formaPagamento.Codigo',
        'condicaoPagamento.CodigoFormaPagamento',
      )) as PaymentMethodJoinedRow[];

    return rows.reduce<FormaPagamento[]>((paymentMethods, row) => {
      const paymentMethodIndex = paymentMethods.findIndex(
        paymentMethod => paymentMethod.Codigo === row.CodigoFormaPagamento,
      );

      if (paymentMethodIndex === -1) {
        paymentMethods.push({
          id: row.id,
          Codigo: row.CodigoFormaPagamento,
          Descricao: row.Descricao,
          EmissaoCupomFiscalObrigatoria: row.EmissaoCupomFiscalObrigatoria,
          FormaPagamentoPadrao: row.FormaPagamentoPadrao,
          Identificador: row.Identificador,
          IntervaloDias: row.IntervaloDias,
          IsCartao: row.IsCartao,
          IsPrazo: row.IsPrazo,
          IsRecebimentoEmConta: row.IsRecebimentoEmConta,
          PermitePagamentoPromocao: row.PermitePagamentoPromocao,
          PermiteRecebimento: row.PermiteRecebimento,
          QtdeDiasParcelaInicial: row.QtdeDiasParcelaInicial,
          QtdeParcelas: row.QtdeParcelas,
          SolicitarDadosOperadoraBandeiraCartao:
            row.SolicitarDadosOperadoraBandeiraCartao,
          Tarifas: row.Tarifas,
          UtilizaCreditoDevolucao: row.UtilizaCreditoDevolucao,
          CondicaoPagamento: [
            {
              Codigo: row.Codigo,
              CodigoFormaPagamento: row.CodigoFormaPagamento,
              QtdeParcelas: row.QtdeParcelas,
              IntervaloDias: row.IntervaloDias,
              QtdeDiasParcelaInicial: row.QtdeDiasParcelaInicial,
              Ativo: row.Ativo,
              Tarifas: row.Tarifas,
            },
          ],
        });

        return paymentMethods;
      }

      paymentMethods[paymentMethodIndex].CondicaoPagamento.push({
        Codigo: row.Codigo,
        CodigoFormaPagamento: row.CodigoFormaPagamento,
        QtdeParcelas: row.QtdeParcelas,
        IntervaloDias: row.IntervaloDias,
        QtdeDiasParcelaInicial: row.QtdeDiasParcelaInicial,
        Ativo: row.Ativo,
        Tarifas: row.Tarifas,
      });

      return paymentMethods;
    }, []);
  }

  async createSale(payload: SalePayload): Promise<number> {
    const [id] = await knexConfig('pedido').insert(payload);
    return id;
  }

  async updateSale(payload: SalePayload, id: number): Promise<void> {
    await knexConfig('pedido').update(payload).where('id', id);
  }

  async savePaymentMethods(
    payload: SalePaymentMethodPayload[],
    saleId: number,
  ): Promise<void> {
    await knexConfig('PedidoVinculoMeioPagamento')
      .where('CodigoPedido', saleId)
      .del();

    if (!payload.length) {
      return;
    }

    await knexConfig('PedidoVinculoMeioPagamento').insert(payload);
  }

  async saveProducts(payload: SaleProductPayload[], saleId: number): Promise<void> {
    await knexConfig('PedidoVinculoProduto').where('CodigoPedido', saleId).del();

    if (!payload.length) {
      return;
    }

    await knexConfig('PedidoVinculoProduto').insert(payload);
  }
}
