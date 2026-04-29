import {knexConfig} from '@/database/connection';
import {
  FormaPagamento,
  FormaPagamentoFromQueryDto,
} from '@/modules/sync/types/payment-method-sync.types';

type PaymentMethodJoinedRow = FormaPagamentoFromQueryDto & {
  CodigoFormaPagamento: number;
  QtdeDiasParcelaInicial: number;
  QtdeParcelas: number;
  IntervaloDias: number;
  Tarifas: string;
  Codigo: number;
};

function mapPaymentMethods(rows: PaymentMethodJoinedRow[]): FormaPagamento[] {
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

export default class PaymentMethodRepository {
  async getPaymentMethods(): Promise<FormaPagamento[]> {
    const rows = (await knexConfig('formaPagamento')
      .select('*')
      .innerJoin(
        'condicaoPagamento',
        'formaPagamento.Codigo',
        'condicaoPagamento.CodigoFormaPagamento',
      )) as PaymentMethodJoinedRow[];

    return mapPaymentMethods(rows);
  }
}
