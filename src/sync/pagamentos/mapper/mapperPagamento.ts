import {
  CondicaoPagamentoDto,
  FormaPagamento,
  FormaPagamentoDto,
  FormaPagamentoToSaveDto,
} from '../type';

export default class MapperPagamento {
  mappeToSave(formaPagamento: FormaPagamentoDto): FormaPagamentoToSaveDto {
    return {
      Codigo: formaPagamento.Codigo,
      Descricao: formaPagamento.Descricao,
      PermiteRecebimento: formaPagamento.PermiteRecebimento,
      PermitePagamentoPromocao: formaPagamento.PermitePagamentoPromocao,
      Ativo: formaPagamento.Ativo,
      FormaPagamentoPadrao: formaPagamento.FormaPagamentoPadrao,
      Identificador: formaPagamento.Identificador,
      EmissaoCupomFiscalObrigatoria:
        formaPagamento.EmissaoCupomFiscalObrigatoria,
      UtilizaCreditoDevolucao: formaPagamento.UtilizaCreditoDevolucao ? formaPagamento.UtilizaCreditoDevolucao : false,
      SolicitarDadosOperadoraBandeiraCartao:
        formaPagamento.SolicitarDadosOperadoraBandeiraCartao,
      IsPrazo: formaPagamento.IsPrazo,
      IsCartao: formaPagamento.IsCartao,
      IsRecebimentoEmConta: formaPagamento.IsRecebimentoEmConta,
    };
  }

  mapCodicaoPagamento(
    codicaoPagamento: CondicaoPagamentoDto,
  ): CondicaoPagamentoDto {
    return {
      Codigo: codicaoPagamento.Codigo,
      CodigoFormaPagamento: codicaoPagamento.CodigoFormaPagamento,
      QtdeParcelas: codicaoPagamento.QtdeParcelas,
      IntervaloDias: codicaoPagamento.IntervaloDias,
      QtdeDiasParcelaInicial: codicaoPagamento.QtdeDiasParcelaInicial,
      Ativo: codicaoPagamento.Ativo,
    };
  }

  mapperFormaPagamentoSeach(query: any[]) {
    return query.reduce<FormaPagamento[]>((result, item) => {
      const formaPagamentoIndex = result.findIndex(
        fp => fp.Codigo === item.CodigoFormaPagamento,
      );

      if (formaPagamentoIndex === -1) {
        result.push({
          id: item.id,
          Codigo: item.CodigoFormaPagamento,
          Descricao: item.Descricao,
          EmissaoCupomFiscalObrigatoria: item.EmissaoCupomFiscalObrigatoria,
          FormaPagamentoPadrao: item.FormaPagamentoPadrao,
          Identificador: item.Identificador,
          IntervaloDias: item.IntervaloDias,
          IsCartao: item.IsCartao,
          IsPrazo: item.IsPrazo,
          IsRecebimentoEmConta: item.IsRecebimentoEmConta,
          PermitePagamentoPromocao: item.PermitePagamentoPromocao,
          PermiteRecebimento: item.PermiteRecebimento,
          QtdeDiasParcelaInicial: item.QtdeDiasParcelaInicial,
          QtdeParcelas: item.QtdeParcelas,
          SolicitarDadosOperadoraBandeiraCartao:
            item.SolicitarDadosOperadoraBandeiraCartao,
          Tarifas: item.Tarifas,
          UtilizaCreditoDevolucao: item.UtilizaCreditoDevolucao,
          CondicaoPagamento: [
            {
              Codigo: item.Codigo,
              CodigoFormaPagamento: item.CodigoFormaPagamento,
              QtdeParcelas: item.QtdeParcelas,
              IntervaloDias: item.IntervaloDias,
              QtdeDiasParcelaInicial: item.QtdeDiasParcelaInicial,
              Ativo: item.Ativo,
              Tarifas: item.Tarifas,
            },
          ],
        });
      } else {
        result[formaPagamentoIndex].CondicaoPagamento.push({
          Codigo: item.Codigo,
          CodigoFormaPagamento: item.CodigoFormaPagamento,
          QtdeParcelas: item.QtdeParcelas,
          IntervaloDias: item.IntervaloDias,
          QtdeDiasParcelaInicial: item.QtdeDiasParcelaInicial,
          Ativo: item.Ativo,
          Tarifas: item.Tarifas,
        });
      }

      return result;
    }, []);
  }
}
