import {UseProductsPageHandlersParams} from '../types/products-hooks.types';

export function useProductsPageHandlers({
  navigation,
  setSearchText,
}: UseProductsPageHandlersParams) {
  return {
    handleOpenProductDetails: (productCode: number) => {
      navigation.navigate('ResumoPedido', {id: productCode});
    },
    handleSearchTextChange: setSearchText,
  };
}
