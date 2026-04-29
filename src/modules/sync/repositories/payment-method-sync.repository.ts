import {Knex} from 'knex';

import {knexConfig} from '@/database/connection';

import {FormaPagamentoDto} from '../types/payment-method-sync.types';
import {KnexBatchRepository} from './knex-batch.repository';

type PaymentMethodRow = {
  Codigo: number;
  Descricao: string | null;
  PermiteRecebimento: boolean;
  PermitePagamentoPromocao: boolean;
  Ativo: boolean;
  FormaPagamentoPadrao: number;
  Identificador: number;
  EmissaoCupomFiscalObrigatoria: boolean;
  UtilizaCreditoDevolucao: boolean;
  SolicitarDadosOperadoraBandeiraCartao: boolean;
  IsPrazo: boolean;
  IsCartao: boolean;
  IsRecebimentoEmConta: boolean;
};

type PaymentConditionRow = {
  Codigo: number;
  CodigoFormaPagamento: number;
  QtdeParcelas: number;
  IntervaloDias: number;
  QtdeDiasParcelaInicial: number;
  Ativo: boolean;
  Tarifas: string;
};

export class PaymentMethodSyncRepository {
  private readonly knexBatchRepository = new KnexBatchRepository();

  async replacePaymentMethods(
    paymentMethods: FormaPagamentoDto[],
  ): Promise<void> {
    const paymentMethodRows: PaymentMethodRow[] = paymentMethods.map(
      paymentMethod => ({
        Codigo: paymentMethod.Codigo,
        Descricao: paymentMethod.Descricao,
        PermiteRecebimento: paymentMethod.PermiteRecebimento,
        PermitePagamentoPromocao: paymentMethod.PermitePagamentoPromocao,
        Ativo: paymentMethod.Ativo,
        FormaPagamentoPadrao: paymentMethod.FormaPagamentoPadrao,
        Identificador: paymentMethod.Identificador,
        EmissaoCupomFiscalObrigatoria:
          paymentMethod.EmissaoCupomFiscalObrigatoria,
        UtilizaCreditoDevolucao:
          paymentMethod.UtilizaCreditoDevolucao ?? false,
        SolicitarDadosOperadoraBandeiraCartao:
          paymentMethod.SolicitarDadosOperadoraBandeiraCartao,
        IsPrazo: paymentMethod.IsPrazo,
        IsCartao: paymentMethod.IsCartao,
        IsRecebimentoEmConta: paymentMethod.IsRecebimentoEmConta,
      }),
    );

    const paymentConditionRows: PaymentConditionRow[] = paymentMethods.flatMap(
      paymentMethod =>
        paymentMethod.CondicoesPagamento.map(condition => ({
          Codigo: condition.Codigo,
          CodigoFormaPagamento: condition.CodigoFormaPagamento,
          QtdeParcelas: condition.QtdeParcelas,
          IntervaloDias: condition.IntervaloDias,
          QtdeDiasParcelaInicial: condition.QtdeDiasParcelaInicial,
          Ativo: condition.Ativo,
          Tarifas: String(condition.Tarifas ?? 0),
        })),
    );

    await knexConfig.transaction(async (transaction: Knex.Transaction) => {
      await transaction('condicaoPagamento').del();
      await transaction('formaPagamento').del();

      await this.knexBatchRepository.insertInChunks(
        transaction,
        'formaPagamento',
        paymentMethodRows,
      );
      await this.knexBatchRepository.insertInChunks(
        transaction,
        'condicaoPagamento',
        paymentConditionRows,
      );
    });
  }
}
