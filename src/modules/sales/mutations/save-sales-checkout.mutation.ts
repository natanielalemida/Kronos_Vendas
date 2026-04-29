import {useMutation} from '@tanstack/react-query';
import {useRef} from 'react';

import {FormaPagamento} from '@/modules/sync/types/payment-method-sync.types';
import {ProdutoBodyCreateQtAndObsDto} from '@/modules/sync/types/product-sync.types';

import {SalesCheckoutRepository} from '../repositories/sales-checkout.repository';
import {saveSalesCheckoutSchema} from '../schemas/sales.schema';

type SaveSalesCheckoutParams = {
  customerCode?: number;
  note: string;
  orderId?: number;
  paymentMethods: FormaPagamento[];
  products: ProdutoBodyCreateQtAndObsDto[];
};

export function useSaveSalesCheckoutMutation() {
  const repositoryRef = useRef(new SalesCheckoutRepository());

  return useMutation({
    mutationFn: async ({
      customerCode,
      note,
      orderId,
      paymentMethods,
      products,
    }: SaveSalesCheckoutParams) => {
      const parsedParams = saveSalesCheckoutSchema.parse({
        customerCode,
        note,
        orderId,
        paymentMethods,
        products,
      });
      const payload = {
        DataEmissao: new Date(),
        ModuloDeVenda: 2,
        OperacaoTipo: 2,
        Situacao: 0,
        CodigoClienteEndereco: null,
        TipoMovimentacaoCodigo: 1,
        TipoMovimentacaoDescricao: 'Venda',
        OperacaoSituacao: 1,
        DataOperacao: new Date(),
        Observacao: parsedParams.note,
        CodigoOperacaoVinculada: 0,
        IsOperacaoProcessada: 0,
        CodigoPessoa: parsedParams.customerCode,
      };

      const saleId =
        typeof parsedParams.orderId === 'number'
          ? parsedParams.orderId
          : await repositoryRef.current.createSale(payload);

      if (typeof parsedParams.orderId === 'number') {
        await repositoryRef.current.updateSale(payload, parsedParams.orderId);
      }

      const paymentMethodPayload = parsedParams.paymentMethods.flatMap(
        paymentMethod => {
        return paymentMethod.CondicaoPagamento.map(paymentCondition => ({
          CodigoPedido: saleId,
          CodigoFormaPagamento: paymentCondition.CodigoFormaPagamento,
          CodigoCondicao: paymentCondition.Codigo,
          ValorRecebido: paymentCondition.ValorPago ?? 0,
        }));
        },
      );

      const productPayload = parsedParams.products.map(product => ({
        CodigoPedido: saleId,
        CodigoProduto: product.Codigo,
        Quantidade: product.Quantidade,
        ValorVendaDesconto: product.ValorVendaDesconto,
        Descricao: product.Descricao,
        ValorCusto: 0,
        ValorVenda: product.ValorVenda,
        ValorOriginalProduto: product.ValorVendaDesconto,
        UnidadeMedida: product.UnidadeMedida,
      }));

      await repositoryRef.current.savePaymentMethods(paymentMethodPayload, saleId);
      await repositoryRef.current.saveProducts(productPayload, saleId);

      return saleId;
    },
  });
}
