import {useMemo, useState} from 'react';

import {useDebouncedSearchText} from '@/modules/customers/hooks/useDebouncedSearchText';
import {useProductsQuery} from '@/modules/products/queries/products.query';
import {ProductListItem} from '@/modules/products/types/product.types';

import {salesSearchSchema} from '../schemas/sales.schema';
import {UseSetupSalesProductsSelectionPageResult} from '../types/sales-selection.types';

export function useSetupSalesProductsSelectionPage(): UseSetupSalesProductsSelectionPageResult {
  const [searchText, setSearchText] = useState('');
  const [selectedProductCode, setSelectedProductCode] = useState<number>();
  const debouncedSearchText = useDebouncedSearchText(searchText);
  const query = useProductsQuery(debouncedSearchText);
  const products = useMemo(() => query.data ?? [], [query.data]);
  const selectedProduct = products.find(
    product => product.Codigo === selectedProductCode,
  ) as ProductListItem | undefined;
  const handleSearchTextChange = (value: string) => {
    setSearchText(salesSearchSchema.parse({searchText: value}).searchText);
  };

  return {
    data: {
      isLoading: query.isLoading || query.isFetching,
      products,
      searchText,
      selectedProduct,
    },
    handlers: {
      handleCloseEditor: () => setSelectedProductCode(undefined),
      handleOpenEditor: productCode => setSelectedProductCode(productCode),
      handleSearchTextChange,
    },
    viewState: {
      shouldShowEditor: !!selectedProduct,
      shouldShowEmptyState: products.length === 0 && !query.isLoading,
      shouldShowInitialLoader: query.isLoading && products.length === 0,
      shouldShowOverlayLoader: query.isFetching && products.length > 0,
    },
  };
}
