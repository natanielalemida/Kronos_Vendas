import {Alert} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useEffect, useMemo, useState} from 'react';

import {FormaPagamento} from '@/modules/sync/types/payment-method-sync.types';
import {useAppSession} from '@/shared/hooks/useAppSession';

import {
  addDays,
  applyDiscountPercent,
  buildCheckoutDraft,
  calculateDiscountPercent,
  calculateGrossTotal,
  calculateNetTotal,
  calculatePaidAmount,
  clampDiscountPercent,
  clampNetTotal,
  formatCurrencyInput,
  formatDate,
  getRemainingPaymentAmount,
  removeSelectedPaymentMethod,
  sanitizeDecimalInput,
  splitAmount,
  upsertSelectedPaymentMethod,
} from '../helpers/sales-checkout.helpers';
import {formatCurrency} from '../helpers/sales-page.helpers';
import {useSaveSalesCheckoutMutation} from '../mutations/save-sales-checkout.mutation';
import {useSalesPaymentMethodsQuery} from '../queries/payment-methods.query';
import {
  salesCheckoutPaymentSelectionSchema,
  salesDraftRouteParamsSchema,
} from '../schemas/sales.schema';
import {
  SalesCheckoutPageNavigation,
  SalesCheckoutPageRoute,
} from '../types/sales-navigation.types';
import {UseSetupSalesCheckoutPageResult} from '../types/sales-checkout.types';

export function useSetupSalesCheckoutPage(): UseSetupSalesCheckoutPageResult {
  const navigation = useNavigation() as SalesCheckoutPageNavigation;
  const route = useRoute() as SalesCheckoutPageRoute;
  const routeParams = salesDraftRouteParamsSchema.parse(route.params ?? {});
  const {
    clienteOnContext,
    cleanPedido,
    finalizarVenda,
    formaPagamento,
    setFinalizarVenda,
    setFormaPagameto,
    setProdutosSelecionados,
    setValorPago,
    ProdutosSelecionados,
    usuario,
    valorPago,
  } = useAppSession();
  const paymentMethodsQuery = useSalesPaymentMethodsQuery();
  const saveSalesCheckoutMutation = useSaveSalesCheckoutMutation();
  const maxDiscountPercent = usuario?.DescontoMaximoVenda ?? 0;
  const [discountPercentInput, setDiscountPercentInput] = useState('0.00');
  const [netTotalInput, setNetTotalInput] = useState('0.00');
  const [note, setNote] = useState('');
  const [paymentAmountInput, setPaymentAmountInput] = useState('0.00');
  const [selectedPaymentMethodCode, setSelectedPaymentMethodCode] = useState<
    number | undefined
  >(undefined);
  const [selectedPaymentConditionCode, setSelectedPaymentConditionCode] =
    useState<number | undefined>(undefined);
  const [paymentMethodPendingDeletion, setPaymentMethodPendingDeletion] =
    useState<FormaPagamento | undefined>(undefined);
  const [isFinalizeModalVisible, setFinalizeModalVisible] = useState(false);
  const [isPaymentModalVisible, setPaymentModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

  useEffect(() => {
    const grossTotal = calculateGrossTotal(ProdutosSelecionados);
    const netTotal = calculateNetTotal(ProdutosSelecionados);
    const draftDiscountPercent =
      finalizarVenda?.Desconto ??
      calculateDiscountPercent({
        grossTotal,
        netTotal,
      });

    setDiscountPercentInput(formatCurrencyInput(draftDiscountPercent));
    setNetTotalInput(formatCurrencyInput(finalizarVenda?.ValorTotal ?? netTotal));
    setNote(finalizarVenda?.Observacao ?? '');
  }, [ProdutosSelecionados, finalizarVenda]);

  useEffect(() => {
    if (!finalizarVenda && ProdutosSelecionados.length > 0) {
      const grossTotal = calculateGrossTotal(ProdutosSelecionados);
      const netTotal = calculateNetTotal(ProdutosSelecionados);

      setDiscountPercentInput(
        formatCurrencyInput(
          calculateDiscountPercent({
            grossTotal,
            netTotal,
          }),
        ),
      );
      setNetTotalInput(formatCurrencyInput(netTotal));
      setFinalizeModalVisible(true);
    }
  }, [ProdutosSelecionados, finalizarVenda]);

  const selectedPaymentMethod = useMemo(() => {
    return paymentMethodsQuery.data?.find(
      paymentMethod => paymentMethod.Codigo === selectedPaymentMethodCode,
    );
  }, [paymentMethodsQuery.data, selectedPaymentMethodCode]);

  const selectedPaymentCondition = useMemo(() => {
    return selectedPaymentMethod?.CondicaoPagamento.find(
      paymentCondition => paymentCondition.Codigo === selectedPaymentConditionCode,
    );
  }, [selectedPaymentConditionCode, selectedPaymentMethod]);

  const selectedPaymentMethods = useMemo(() => {
    return (formaPagamento ?? []).map(paymentMethod => ({
      id: String(paymentMethod.Codigo),
      code: paymentMethod.Codigo,
      description: paymentMethod.Descricao,
      conditions: paymentMethod.CondicaoPagamento.map(paymentCondition => {
        const today = new Date();
        const scheduleLines = paymentMethod.IsPrazo
          ? splitAmount(
              paymentCondition.ValorPago ?? 0,
              paymentCondition.QtdeParcelas,
            ).map((amount, index) => {
              const dueDate = addDays(
                today,
                paymentCondition.QtdeDiasParcelaInicial +
                  index * paymentCondition.IntervaloDias,
              );

              return `${index + 1}/${paymentCondition.QtdeParcelas} • ${formatCurrency(
                amount,
              )} • ${formatDate(dueDate)}`;
            })
          : [];

        return {
          id: `${paymentMethod.Codigo}-${paymentCondition.Codigo}`,
          title: paymentMethod.IsPrazo
            ? `Condition ${paymentCondition.Codigo}`
            : `Condition ${paymentCondition.Codigo}`,
          amountLabel: formatCurrency(paymentCondition.ValorPago ?? 0),
          scheduleLines,
        };
      }),
      onPress: () => {
        setPaymentMethodPendingDeletion(paymentMethod);
        setDeleteModalVisible(true);
      },
    }));
  }, [formaPagamento]);

  const shouldAllowFinalize = useMemo(() => {
    if (!ProdutosSelecionados.length || !finalizarVenda) {
      return false;
    }

    return valorPago.toFixed(2) === finalizarVenda.ValorTotal.toFixed(2);
  }, [ProdutosSelecionados.length, finalizarVenda, valorPago]);

  const shouldAllowNewPayment = useMemo(() => {
    if (!ProdutosSelecionados.length || !finalizarVenda) {
      return false;
    }

    return valorPago.toFixed(2) !== finalizarVenda.ValorTotal.toFixed(2);
  }, [ProdutosSelecionados.length, finalizarVenda, valorPago]);

  const syncDraftFromDiscountPercent = (nextDiscountPercent: number) => {
    const clampedDiscountPercent = clampDiscountPercent(
      nextDiscountPercent,
      maxDiscountPercent,
    );
    const discountedProducts = applyDiscountPercent(
      ProdutosSelecionados,
      clampedDiscountPercent,
    );

    setProdutosSelecionados(discountedProducts);
    setFinalizarVenda(
      buildCheckoutDraft({
        products: discountedProducts,
        discountPercent: clampedDiscountPercent,
        note,
      }),
    );
    setDiscountPercentInput(formatCurrencyInput(clampedDiscountPercent));
    setNetTotalInput(formatCurrencyInput(calculateNetTotal(discountedProducts)));
  };

  const syncDraftFromNetTotal = (nextNetTotal: number) => {
    const grossTotal = calculateGrossTotal(ProdutosSelecionados);
    const clampedNetTotal = clampNetTotal({
      grossTotal,
      maxDiscountPercent,
      requestedNetTotal: nextNetTotal,
    });
    const nextDiscountPercent = calculateDiscountPercent({
      grossTotal,
      netTotal: clampedNetTotal,
    });
    const discountedProducts = applyDiscountPercent(
      ProdutosSelecionados,
      nextDiscountPercent,
    );

    setProdutosSelecionados(discountedProducts);
    setFinalizarVenda(
      buildCheckoutDraft({
        products: discountedProducts,
        discountPercent: nextDiscountPercent,
        note,
      }),
    );
    setDiscountPercentInput(formatCurrencyInput(nextDiscountPercent));
    setNetTotalInput(formatCurrencyInput(clampedNetTotal));
  };

  const syncDiscountPercentInput = () => {
    syncDraftFromDiscountPercent(sanitizeDecimalInput(discountPercentInput));
  };

  const syncNetTotalInput = () => {
    syncDraftFromNetTotal(sanitizeDecimalInput(netTotalInput));
  };

  const closeFinalizeModal = () => {
    setFinalizeModalVisible(false);
  };

  const confirmCheckoutDraft = () => {
    setFinalizarVenda(
      buildCheckoutDraft({
        products: ProdutosSelecionados,
        discountPercent: sanitizeDecimalInput(discountPercentInput),
        note,
      }),
    );
    closeFinalizeModal();
  };

  const openFinalizeModal = () => {
    const grossTotal = calculateGrossTotal(ProdutosSelecionados);
    const netTotal = calculateNetTotal(ProdutosSelecionados);

    setDiscountPercentInput(
      formatCurrencyInput(
        calculateDiscountPercent({
          grossTotal,
          netTotal,
        }),
      ),
    );
    setNetTotalInput(formatCurrencyInput(netTotal));
    setFinalizeModalVisible(true);
  };

  const closePaymentModal = () => {
    setPaymentModalVisible(false);
    setSelectedPaymentMethodCode(undefined);
    setSelectedPaymentConditionCode(undefined);
    setPaymentAmountInput('0.00');
  };

  const openPaymentModal = () => {
    const remainingAmount = getRemainingPaymentAmount({
      checkout: finalizarVenda,
      paidAmount: valorPago,
    });

    setPaymentAmountInput(formatCurrencyInput(remainingAmount));
    setPaymentModalVisible(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalVisible(false);
    setPaymentMethodPendingDeletion(undefined);
  };

  const confirmDeletePaymentMethod = () => {
    if (!paymentMethodPendingDeletion) {
      closeDeleteModal();
      return;
    }

    const nextPaymentMethods = removeSelectedPaymentMethod({
      paymentMethods: formaPagamento ?? [],
      paymentMethodCode: paymentMethodPendingDeletion.Codigo,
    });

    setFormaPagameto(nextPaymentMethods);
    setValorPago(calculatePaidAmount(nextPaymentMethods));
    closeDeleteModal();
  };

  const confirmPaymentMethod = () => {
    if (!selectedPaymentMethod || !selectedPaymentCondition) {
      Alert.alert(
        'Campos obrigatórios',
        'Selecione a forma e a condição de pagamento.',
      );
      return;
    }

    const remainingAmount = getRemainingPaymentAmount({
      checkout: finalizarVenda,
      paidAmount: valorPago,
    });
    const requestedAmount = sanitizeDecimalInput(paymentAmountInput);
    const amount = Math.min(remainingAmount, requestedAmount || remainingAmount);
    const paymentSelection = salesCheckoutPaymentSelectionSchema.parse({
      paymentMethodCode: selectedPaymentMethod.Codigo,
      paymentConditionCode: selectedPaymentCondition.Codigo,
      amount,
    });

    const nextPaymentMethods = upsertSelectedPaymentMethod({
      paymentMethods: formaPagamento ?? [],
      paymentMethod: selectedPaymentMethod,
      paymentCondition: selectedPaymentCondition,
      amount: paymentSelection.amount,
    });

    setFormaPagameto(nextPaymentMethods);
    setValorPago(calculatePaidAmount(nextPaymentMethods));
    closePaymentModal();
  };

  const confirmFinalizeSale = async () => {
    if (!finalizarVenda) {
      closeFinalizeModal();
      return;
    }

    const saleId = await saveSalesCheckoutMutation.mutateAsync({
      customerCode: clienteOnContext?.Codigo || clienteOnContext?.id,
      note,
      orderId: routeParams.id,
      paymentMethods: formaPagamento ?? [],
      products: ProdutosSelecionados,
    });

    cleanPedido();
    closeFinalizeModal();
    navigation.navigate('resumoPedidoNavigation', {
      id: saleId,
      goBack: true,
      idCliente: !clienteOnContext?.Codigo ? clienteOnContext?.id : null,
    });
  };

  const setSelectedPaymentMethod = (value: FormaPagamento) => {
    setSelectedPaymentMethodCode(value.Codigo);
    setSelectedPaymentConditionCode(value.CondicaoPagamento[0]?.Codigo);
  };

  const setSelectedPaymentCondition = (value: NonNullable<typeof selectedPaymentCondition>) => {
    setSelectedPaymentConditionCode(value.Codigo);
  };

  return {
    data: {
      discountPercentInput,
      grossTotalLabel: formatCurrency(calculateGrossTotal(ProdutosSelecionados)),
      netTotalInput,
      note,
      paidAmountLabel: formatCurrency(valorPago),
      paymentMethods: paymentMethodsQuery.data ?? [],
      remainingAmountLabel: formatCurrency(
        getRemainingPaymentAmount({
          checkout: finalizarVenda,
          paidAmount: valorPago,
        }),
      ),
      selectedPaymentCondition,
      selectedPaymentMethod,
      selectedPaymentMethods,
      totalAmountLabel: formatCurrency(finalizarVenda?.ValorTotal ?? 0),
    },
    handlers: {
      closeDeleteModal,
      closeFinalizeModal,
      closePaymentModal,
      confirmCheckoutDraft,
      confirmDeletePaymentMethod,
      confirmFinalizeSale,
      confirmPaymentMethod,
      openFinalizeModal,
      openPaymentModal,
      setDiscountPercentInput,
      setNetTotalInput,
      setNote: value => {
        setNote(value);
        setFinalizarVenda(
          buildCheckoutDraft({
            products: ProdutosSelecionados,
            discountPercent: sanitizeDecimalInput(discountPercentInput),
            note: value,
          }),
        );
      },
      setPaymentAmountInput,
      setSelectedPaymentCondition,
      setSelectedPaymentMethod,
      syncDiscountPercentInput,
      syncNetTotalInput,
    },
    modalState: {
      paymentAmountInput,
      paymentMethodPendingDeletion,
      setDeleteModalVisible,
    },
    viewState: {
      isDeleteModalVisible,
      isFinalizeModalVisible,
      isPaymentModalVisible,
      isSaving: saveSalesCheckoutMutation.isPending,
      shouldAllowFinalize,
      shouldAllowNewPayment,
      shouldShowConditionSelector:
        (selectedPaymentMethod?.CondicaoPagamento.length ?? 0) > 1,
      shouldShowEmptyState: selectedPaymentMethods.length === 0,
    },
  };
}
