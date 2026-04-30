import {useNavigation, useRoute} from '@react-navigation/native';
import {useQueryClient} from '@tanstack/react-query';
import {Alert} from 'react-native';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {CustomerEditRepository} from '@/modules/customers/repositories/customer-edit.repository';
import {useAppStorage} from '@/modules/storage/hooks/useAppStorage';
import {useAppSession} from '@/shared/hooks/useAppSession';
import {logger} from '@/shared/utils/logger';

import {
  calculateDiscountPercent,
  formatOrderSummaryDate,
  mapEditableCustomerRecordToClienteDto,
  mapOrderSummaryProductsToDraft,
} from '../helpers/order-summary.helpers';
import {useSendOrdersMutation} from '../mutations/send-orders.mutation';
import {useOrderSummaryQuery} from '../queries/order-summary.query';
import {ordersQueryKeys} from '../query-keys/orders.query-keys';
import {OrderSummaryRepository} from '../repositories/order-summary.repository';
import {orderSummaryRouteParamsSchema} from '../schemas/order-summary.schema';
import {
  OrderSummaryCompany,
  OrderSummaryDisplayPaymentMethod,
  OrderSummaryDisplayProduct,
  OrderSummaryNavigation,
  UseSetupOrderSummaryPageResult,
} from '../types/order-summary.types';
import {useExportOrderPdf} from './useExportOrderPdf';

export function useSetupOrderSummaryPage(): UseSetupOrderSummaryPageResult {
  const navigation = useNavigation() as OrderSummaryNavigation;
  const route = useRoute();
  const parsedParams = orderSummaryRouteParamsSchema.safeParse(route.params);
  const routeParams = parsedParams.success ? parsedParams.data : undefined;
  const {terminal} = useAppStorage();
  const {
    empresa,
    setClienteOnContext,
    setProdutosSelecionados,
    usuario,
  } = useAppSession();
  const company = empresa as OrderSummaryCompany | undefined;
  const customerRepositoryRef = useRef(new CustomerEditRepository());
  const orderSummaryRepositoryRef = useRef(new OrderSummaryRepository());
  const queryClient = useQueryClient();
  const sendOrdersMutation = useSendOrdersMutation();
  const {exportOrderPdf} = useExportOrderPdf();
  const [isPerformingAction, setIsPerformingAction] = useState(false);
  const orderId = routeParams?.id;
  const orderSummaryQuery = useOrderSummaryQuery(orderId, terminal);
  const order = orderSummaryQuery.data;

  useEffect(() => {
    if (!orderSummaryQuery.error) {
      return;
    }

    logger.error(
      'OrderSummary',
      'Error while loading order summary.',
      orderSummaryQuery.error,
    );
    Alert.alert('Erro', 'Não foi possível carregar o pedido.');
  }, [orderSummaryQuery.error]);

  const resolveCustomerFromOrder = useCallback(async () => {
    if (!order) {
      throw new Error('Pedido não carregado.');
    }

    if (order.Pessoa.Codigo) {
      return customerRepositoryRef.current.findByCode(order.Pessoa.id);
    }

    return customerRepositoryRef.current.findById(order.Pessoa.id);
  }, [order]);

  const syncOrderIntoDraft = useCallback(async () => {
    const editableCustomer = await resolveCustomerFromOrder();

    setClienteOnContext(mapEditableCustomerRecordToClienteDto(editableCustomer));
    setProdutosSelecionados(mapOrderSummaryProductsToDraft(order?.Itens ?? []));
  }, [order?.Itens, resolveCustomerFromOrder, setClienteOnContext, setProdutosSelecionados]);

  const handleSendOrder = useCallback(async () => {
    if (!routeParams || !usuario || !company?.Codigo) {
      Alert.alert('Erro', 'Usuário ou empresa não estão disponíveis.');
      return;
    }

    setIsPerformingAction(true);

    try {
      const customerToSync =
        routeParams.idCliente != null
          ? await customerRepositoryRef.current.findById(routeParams.idCliente)
          : {};
      const result = await sendOrdersMutation.mutateAsync([
        {
          authenticatedUser: usuario,
          companyCode: company.Codigo,
          customerToSync,
          id: routeParams.id,
          terminal: terminal ?? 0,
        },
      ]);

      if (!result[0]) {
        return;
      }

      Alert.alert('Sucesso', 'Pedido enviado com sucesso');
      navigation.navigate('Menu');
    } catch (error) {
      logger.error(
        'OrderSummary',
        'Error while sending order from summary.',
        error,
      );
      Alert.alert('Erro', 'Não foi possível enviar o pedido.');
    } finally {
      setIsPerformingAction(false);
    }
  }, [
    company?.Codigo,
    navigation,
    routeParams,
    sendOrdersMutation,
    terminal,
    usuario,
  ]);

  const handleDeleteOrder = useCallback(() => {
    if (!routeParams) {
      return;
    }

    Alert.alert(
      'Deletar Pedido',
      'Você tem certeza que deseja deletar o pedido atual?',
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          onPress: async () => {
            try {
              setIsPerformingAction(true);
              await orderSummaryRepositoryRef.current.deleteById(routeParams.id);
              await queryClient.invalidateQueries({
                queryKey: ordersQueryKeys.all,
              });
              navigation.navigate('Menu');
            } catch (error) {
              logger.error('OrderSummary', 'Error while deleting order.', error);
              Alert.alert('Erro', 'Não foi possível deletar o pedido.');
            } finally {
              setIsPerformingAction(false);
            }
          },
          text: 'OK',
        },
      ],
    );
  }, [navigation, queryClient, routeParams]);

  const handleEditOrder = useCallback(async () => {
    if (!routeParams || !order) {
      return;
    }

    try {
      await syncOrderIntoDraft();
      navigation.navigate('Novo Pedido', {id: routeParams.id});
    } catch (error) {
      logger.error('OrderSummary', 'Error while opening order editor.', error);
      Alert.alert('Erro', 'Não foi possível abrir o pedido para edição.');
    }
  }, [navigation, order, routeParams, syncOrderIntoDraft]);

  const handleDuplicateOrder = useCallback(() => {
    Alert.alert(
      'Duplicar pedido',
      'Você tem certeza que deseja Duplicar o pedido atual?',
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          onPress: async () => {
            if (!order) {
              return;
            }

            await syncOrderIntoDraft();
            navigation.navigate('Novo Pedido');
          },
          text: 'OK',
        },
      ],
    );
  }, [navigation, order, syncOrderIntoDraft]);

  const handleGoBack = useCallback(() => {
    if (routeParams?.goBack) {
      navigation.pop(2);
      return;
    }

    navigation.goBack();
  }, [navigation, routeParams?.goBack]);

  const totalGross = useMemo(
    () =>
      order?.Itens.reduce(
        (currentTotal, item) =>
          currentTotal + item.Quantidade * item.ValorUnitario,
        0,
      ) ?? 0,
    [order?.Itens],
  );
  const totalNet = useMemo(
    () =>
      order?.MeiosPagamentos.reduce(
        (currentTotal, item) => currentTotal + item.ValorRecebido,
        0,
      ) ?? 0,
    [order?.MeiosPagamentos],
  );
  const products = useMemo<OrderSummaryDisplayProduct[]>(
    () =>
      (order?.Itens ?? []).map((product, index) => {
        const discountValue =
          product.ValorVendaDesconto !== product.ValorUnitario
            ? (product.ValorUnitario - product.ValorVendaDesconto) *
              product.Quantidade
            : 0;
        const discountPercent =
          product.ValorVendaDesconto !== product.ValorUnitario
            ? calculateDiscountPercent(
                product.ValorUnitario,
                product.ValorVendaDesconto,
              )
            : '0.00';

        return {
          id: `${product.CodigoProduto}-${index}`,
          description: product.Descricao,
          discountLabel:
            discountValue > 0
              ? `${discountValue.toFixed(2)} (${discountPercent}%)`
              : '0.00',
          quantityLabel: String(product.Quantidade),
          totalPriceLabel: `R$ ${(
            product.ValorVendaDesconto * product.Quantidade
          ).toFixed(2)}`,
          unitPriceLabel: `R$ ${product.ValorUnitario.toFixed(2)}`,
        };
      }),
    [order?.Itens],
  );
  const paymentMethods = useMemo<OrderSummaryDisplayPaymentMethod[]>(
    () =>
      (order?.MeiosPagamentos ?? []).map((paymentMethod, index) => ({
        id: `${paymentMethod.FormaPagamento.Descricao}-${index}`,
        amountLabel: `R$ ${paymentMethod.ValorRecebido.toFixed(2)}`,
        description: paymentMethod.FormaPagamento.Descricao,
      })),
    [order?.MeiosPagamentos],
  );
  const discountAmount = totalGross - totalNet;
  const discountPercentLabel =
    totalGross > 0 ? (((discountAmount / totalGross) * 100).toFixed(2)) : '0.00';
  const handleSharePdf = useCallback(async () => {
    if (!order) {
      return;
    }

    try {
      await exportOrderPdf(order);
    } catch (error) {
      logger.error('OrderSummary', 'Error while exporting order pdf.', error);
      Alert.alert('Erro', 'Não foi possível compartilhar o PDF.');
    }
  }, [exportOrderPdf, order]);

  return {
    data: {
      customerDocumentLabel: order?.Pessoa?.CNPJCPF ?? '',
      customerName: order?.Pessoa?.NomeFantasia ?? '',
      discountAmountLabel: `R$ ${discountAmount.toFixed(2)}`,
      discountPercentLabel,
      issuedAtLabel: formatOrderSummaryDate(order?.DataEmissao),
      order,
      paymentMethods,
      products,
      totalGross,
      totalGrossLabel: `R$ ${totalGross.toFixed(2)}`,
      totalNet,
      totalNetLabel: `R$ ${totalNet.toFixed(2)}`,
    },
    derivedState: {
      isSyncedOrder: !!order?.Codigo,
    },
    handlers: {
      handleDeleteOrder,
      handleDuplicateOrder,
      handleEditOrder,
      handleGoBack,
      handleSendOrder,
      handleSharePdf,
    },
    viewState: {
      isLoading:
        orderSummaryQuery.isLoading ||
        orderSummaryQuery.isFetching ||
        isPerformingAction ||
        sendOrdersMutation.isPending,
    },
  };
}

export {calculateDiscountPercent};
