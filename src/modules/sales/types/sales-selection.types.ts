import {Dispatch, SetStateAction} from 'react';

import {CustomerListItem} from '@/modules/customers/types/customer-list.types';
import {ProductListItem} from '@/modules/products/types/product.types';
import {ProdutoBodyCreateQtAndObsDto} from '@/modules/sync/types/product-sync.types';

export type SalesEditableProduct = ProductListItem | ProdutoBodyCreateQtAndObsDto;
export type SalesProductStockDetails = {
  Estoque?: number;
};

export type UseSetupSalesCustomersSelectionPageResult = {
  data: {
    customers: CustomerListItem[];
    isLoading: boolean;
    searchText: string;
  };
  handlers: {
    handleSearchTextChange: (value: string) => void;
    handleSelectCustomer: (customer: CustomerListItem) => void;
  };
  viewState: {
    shouldShowEmptyState: boolean;
  };
};

export type SalesProductEditorModalProps = {
  isEditing?: boolean;
  isVisible: boolean;
  onClose: () => void;
  product?: SalesEditableProduct;
};

export type UseSetupSalesProductEditorModalResult = {
  data: {
    basePriceLabel: string;
    discountInput: string;
    note: string;
    quantityInput: string;
    selectedUnitPriceLabel: string;
    totalPriceLabel: string;
    unitPriceInput: string;
  };
  handlers: {
    handleConfirm: () => void;
    handleDecreaseQuantity: () => void;
    handleDelete: () => void;
    handleIncreaseQuantity: () => void;
    handleQuantityInputChange: (value: string) => void;
    handleSyncDiscount: () => void;
    handleSyncUnitPrice: () => void;
    setDiscountInput: Dispatch<SetStateAction<string>>;
    setNote: Dispatch<SetStateAction<string>>;
    setUnitPriceInput: Dispatch<SetStateAction<string>>;
    setWholesaleActive: Dispatch<SetStateAction<boolean>>;
  };
  viewState: {
    canDelete: boolean;
    canToggleWholesale: boolean;
    isWholesaleActive: boolean;
    shouldShowModal: boolean;
  };
};

export type UseSetupSalesProductsSelectionPageResult = {
  data: {
    isLoading: boolean;
    products: ProductListItem[];
    searchText: string;
    selectedProduct?: ProductListItem;
  };
  handlers: {
    handleCloseEditor: () => void;
    handleOpenEditor: (productCode: number) => void;
    handleSearchTextChange: (value: string) => void;
  };
  viewState: {
    shouldShowEditor: boolean;
    shouldShowEmptyState: boolean;
    shouldShowInitialLoader: boolean;
    shouldShowOverlayLoader: boolean;
  };
};

export type SalesSelectedEditableProductItem = {
  id: string;
  code: number;
  description: string;
  quantityLabel: string;
  totalPriceLabel: string;
  unitPriceLabel: string;
  onPress: () => void;
};

export type UseSetupSalesEditProductsPageResult = {
  data: {
    products: SalesSelectedEditableProductItem[];
    searchText: string;
    selectedProduct?: ProdutoBodyCreateQtAndObsDto;
  };
  handlers: {
    handleCloseEditor: () => void;
    handleOpenEditor: (productCode: number) => void;
    handleSearchTextChange: (value: string) => void;
  };
  viewState: {
    shouldShowEditor: boolean;
    shouldShowEmptyState: boolean;
  };
};
