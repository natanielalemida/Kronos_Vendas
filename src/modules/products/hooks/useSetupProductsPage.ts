import {useNavigation} from '@react-navigation/native';

import {useProductsPageHandlers} from './useProductsPageHandlers';
import {useDebouncedSearchText} from '@/modules/customers/hooks/useDebouncedSearchText';

import {useProductsQuery} from '../queries/products.query';
import {useProductsPageStore} from '../stores/useProductsPageStore';
import {ProductsNavigation} from '../types/products-navigation.types';
import {UseSetupProductsPageResult} from '../types/products-page.types';
import {ProductListItem} from '../types/product.types';

export function useSetupProductsPage(): UseSetupProductsPageResult {
  const navigation = useNavigation() as ProductsNavigation;
  const searchText = useProductsPageStore(state => state.searchText);
  const setSearchText = useProductsPageStore(state => state.setSearchText);
  const debouncedSearchText = useDebouncedSearchText(searchText);
  const query = useProductsQuery(debouncedSearchText);
  const products = (query.data ?? []) as ProductListItem[];

  const handlers = useProductsPageHandlers({
    navigation,
    setSearchText,
  });

  return {
    data: {
      isLoading: query.isLoading || query.isFetching,
      products,
      searchText,
    },
    handlers,
    viewState: {
      shouldShowEmptyState: products.length === 0 && !query.isLoading,
      shouldShowInitialLoader: query.isLoading && products.length === 0,
      shouldShowOverlayLoader: query.isFetching && products.length > 0,
    },
  };
}
