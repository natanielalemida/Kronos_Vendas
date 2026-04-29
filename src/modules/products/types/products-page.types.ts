import {ProductDetails, ProductListItem} from './product.types';

export type UseSetupProductsPageResult = {
  data: {
    isLoading: boolean;
    products: ProductListItem[];
    searchText: string;
  };
  handlers: {
    handleOpenProductDetails: (productCode: number) => void;
    handleSearchTextChange: (value: string) => void;
  };
  viewState: {
    shouldShowEmptyState: boolean;
    shouldShowInitialLoader: boolean;
    shouldShowOverlayLoader: boolean;
  };
};

export type UseSetupProductDetailsPageResult = {
  data: {
    product?: ProductDetails;
  };
  handlers: {
    handleGoBack: () => void;
  };
  viewState: {
    isLoading: boolean;
    isNotFound: boolean;
  };
};
