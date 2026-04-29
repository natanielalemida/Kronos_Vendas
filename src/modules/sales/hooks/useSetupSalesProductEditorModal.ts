import {useEffect, useMemo, useState} from 'react';

import {useAppSession} from '@/shared/hooks/useAppSession';

import {
  applyDiscountPercent,
  buildSelectedProductDraft,
  calculateDiscountPercent,
  clampUnitPrice,
  formatDecimalInput,
  getSelectedProductBasePrice,
  inferWholesaleSelection,
  sanitizeDecimalInput,
  sanitizeQuantityInput,
} from '../helpers/sales-selection.helpers';
import {formatCurrency} from '../helpers/sales-page.helpers';
import {
  SalesProductEditorModalProps,
  UseSetupSalesProductEditorModalResult,
} from '../types/sales-selection.types';

export function useSetupSalesProductEditorModal({
  isEditing,
  isVisible,
  onClose,
  product,
}: SalesProductEditorModalProps): UseSetupSalesProductEditorModalResult {
  const {setProdutosSelecionados, usuario} = useAppSession();
  const maxDiscountPercent = usuario?.DescontoMaximoVenda ?? 0;
  const [discountInput, setDiscountInput] = useState('0.00');
  const [note, setNote] = useState('');
  const [quantityInput, setQuantityInput] = useState('1');
  const [isWholesaleActive, setWholesaleActive] = useState(false);
  const [unitPriceInput, setUnitPriceInput] = useState('0.00');

  useEffect(() => {
    if (!product || !isVisible) {
      return;
    }

    const inferredWholesale = inferWholesaleSelection(product);
    const initialUnitPrice =
      'ValorVendaDesconto' in product
        ? product.ValorVendaDesconto
        : getSelectedProductBasePrice(product, inferredWholesale);
    const initialBasePrice = getSelectedProductBasePrice(product, inferredWholesale);

    setWholesaleActive(inferredWholesale);
    setQuantityInput(
      'Quantidade' in product ? String(product.Quantidade) : '1',
    );
    setNote('Observacao' in product ? product.Observacao : '');
    setUnitPriceInput(formatDecimalInput(initialUnitPrice));
    setDiscountInput(
      formatDecimalInput(
        calculateDiscountPercent({
          basePrice: initialBasePrice,
          unitPrice: initialUnitPrice,
        }),
      ),
    );
  }, [isVisible, product]);

  const quantity = useMemo(() => {
    const parsedQuantity = sanitizeDecimalInput(quantityInput);
    return parsedQuantity > 0 ? parsedQuantity : 1;
  }, [quantityInput]);

  const basePrice = useMemo(() => {
    if (!product) {
      return 0;
    }

    return getSelectedProductBasePrice(product, isWholesaleActive);
  }, [isWholesaleActive, product]);

  const unitPrice = useMemo(() => {
    return clampUnitPrice({
      basePrice,
      requestedUnitPrice: sanitizeDecimalInput(unitPriceInput),
      maxDiscountPercent,
    });
  }, [basePrice, maxDiscountPercent, unitPriceInput]);

  const syncUnitPrice = () => {
    setUnitPriceInput(formatDecimalInput(unitPrice));
    setDiscountInput(
      formatDecimalInput(
        calculateDiscountPercent({
          basePrice,
          unitPrice,
        }),
      ),
    );
  };

  const syncDiscount = () => {
    const nextUnitPrice = applyDiscountPercent({
      basePrice,
      discountPercent: sanitizeDecimalInput(discountInput),
      maxDiscountPercent,
    });

    setDiscountInput(
      formatDecimalInput(
        calculateDiscountPercent({
          basePrice,
          unitPrice: nextUnitPrice,
        }),
      ),
    );
    setUnitPriceInput(formatDecimalInput(nextUnitPrice));
  };

  const handleConfirm = () => {
    if (!product) {
      onClose();
      return;
    }

    const nextProduct = buildSelectedProductDraft({
      product,
      quantity,
      note,
      unitPrice,
      isWholesaleActive,
    });

    setProdutosSelecionados(currentProducts => {
      const currentProductIndex = currentProducts.findIndex(
        currentProduct => currentProduct.Codigo === nextProduct.Codigo,
      );

      if (currentProductIndex === -1) {
        return [...currentProducts, nextProduct];
      }

      return currentProducts.map((currentProduct, index) =>
        index === currentProductIndex ? nextProduct : currentProduct,
      );
    });
    onClose();
  };

  const handleDelete = () => {
    if (!product) {
      onClose();
      return;
    }

    setProdutosSelecionados(currentProducts =>
      currentProducts.filter(
        currentProduct => currentProduct.Codigo !== product.Codigo,
      ),
    );
    onClose();
  };

  return {
    data: {
      basePriceLabel: formatCurrency(basePrice),
      discountInput,
      note,
      quantityInput,
      selectedUnitPriceLabel: formatCurrency(unitPrice),
      totalPriceLabel: formatCurrency(unitPrice * quantity),
      unitPriceInput,
    },
    handlers: {
      handleConfirm,
      handleDecreaseQuantity: () =>
        setQuantityInput(currentValue =>
          formatDecimalInput(Math.max(sanitizeDecimalInput(currentValue) - 1, 1)),
        ),
      handleDelete,
      handleIncreaseQuantity: () =>
        setQuantityInput(currentValue =>
          formatDecimalInput(sanitizeDecimalInput(currentValue) + 1),
        ),
      handleQuantityInputChange: value =>
        setQuantityInput(
          sanitizeQuantityInput(value, product?.PermiteFracionar ?? false) || '1',
        ),
      handleSyncDiscount: syncDiscount,
      handleSyncUnitPrice: syncUnitPrice,
      setDiscountInput,
      setNote,
      setUnitPriceInput,
      setWholesaleActive,
    },
    viewState: {
      canDelete: !!isEditing,
      canToggleWholesale: !!product?.VendeProdutoNoAtacado,
      isWholesaleActive,
      shouldShowModal: isVisible && !!product,
    },
  };
}
