import {useNavigation, useRoute} from '@react-navigation/native';

import {useProductDetailsQuery} from '../queries/products.query';
import {productRouteParamsSchema} from '../schemas/products.schema';
import {
  ProductDetailsRouteParams,
  ProductsNavigation,
} from '../types/products-navigation.types';
import {UseSetupProductDetailsPageResult} from '../types/products-page.types';

export function useSetupProductDetailsPage(): UseSetupProductDetailsPageResult {
  const navigation = useNavigation() as ProductsNavigation;
  const route = useRoute();
  const {params} = route as {params?: ProductDetailsRouteParams};
  const parsedParams = productRouteParamsSchema.safeParse(params);
  const productCode = parsedParams.success ? parsedParams.data.id : undefined;
  const query = useProductDetailsQuery(productCode);

  return {
    data: {
      product: query.data ?? undefined,
    },
    handlers: {
      handleGoBack: () => navigation.goBack(),
    },
    viewState: {
      isLoading: query.isLoading || query.isFetching,
      isNotFound: !query.isLoading && !query.data,
    },
  };
}
