import {useNavigation, useRoute} from '@react-navigation/native';
import {useQueryClient} from '@tanstack/react-query';
import {Alert} from 'react-native';
import {useEffect, useRef, useState} from 'react';

import {CustomerEditRepository} from '@/modules/customers/repositories/customer-edit.repository';
import {useAppStorage} from '@/modules/storage/hooks/useAppStorage';
import {useAppSession} from '@/shared/hooks/useAppSession';

import {
  calculateDiscountPercent,
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

    console.error('Error while loading order summary', orderSummaryQuery.error);
    Alert.alert('Erro', 'Não foi possível carregar o pedido.');
  }, [orderSummaryQuery.error]);

  const resolveCustomerFromOrder = async () => {
    if (!order) {
      throw new Error('Pedido não carregado.');
    }

    if (order.Pessoa.Codigo) {
      return customerRepositoryRef.current.findByCode(order.Pessoa.id);
    }

    return customerRepositoryRef.current.findById(order.Pessoa.id);
  };

  const syncOrderIntoDraft = async () => {
    const editableCustomer = await resolveCustomerFromOrder();

    setClienteOnContext(mapEditableCustomerRecordToClienteDto(editableCustomer));
    setProdutosSelecionados(mapOrderSummaryProductsToDraft(order?.Itens ?? []));
  };

  const handleSendOrder = async () => {
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
      console.error('Error while sending order from summary', error);
      Alert.alert('Erro', 'Não foi possível enviar o pedido.');
    } finally {
      setIsPerformingAction(false);
    }
  };

  const handleDeleteOrder = () => {
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
              console.error('Error while deleting order', error);
              Alert.alert('Erro', 'Não foi possível deletar o pedido.');
            } finally {
              setIsPerformingAction(false);
            }
          },
          text: 'OK',
        },
      ],
    );
  };

  const handleEditOrder = async () => {
    if (!routeParams || !order) {
      return;
    }

    await syncOrderIntoDraft();
    navigation.navigate('Novo Pedido', {id: routeParams.id});
  };

  const handleDuplicateOrder = () => {
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
  };

  const handleGoBack = () => {
    if (routeParams?.goBack) {
      navigation.pop(2);
      return;
    }

    navigation.goBack();
  };

  const totalGross = order?.Itens.reduce(
    (currentTotal, item) => currentTotal + item.Quantidade * item.ValorUnitario,
    0,
  ) ?? 0;
  const totalNet = order?.MeiosPagamentos.reduce(
    (currentTotal, item) => currentTotal + item.ValorRecebido,
    0,
  ) ?? 0;

  return {
    data: {
      order,
      totalGross,
      totalNet,
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
      handleSharePdf: async () => {
        if (!order) {
          return;
        }

        await exportOrderPdf(order);
      },
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
