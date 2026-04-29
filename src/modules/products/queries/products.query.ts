import {useQuery} from '@tanstack/react-query';

import {ProductController} from '../controllers/product.controller';
import {productsQueryKeys} from '../query-keys/products.query-keys';
import {productsFilterSchema} from '../schemas/products.schema';
import {ProductDetails, ProductListItem} from '../types/product.types';

const controller = new ProductController();

export function useProductsQuery(searchText: string) {
  const parsedFilter = productsFilterSchema.parse({searchText});

  return useQuery<ProductListItem[], Error>({
    queryFn: async (): Promise<ProductListItem[]> =>
      controller.fetchProducts(parsedFilter.searchText),
    queryKey: productsQueryKeys.list(parsedFilter.searchText),
    staleTime: 1000 * 30,
  });
}

export function useProductDetailsQuery(productCode?: number) {
  return useQuery<ProductDetails | null, Error>({
    enabled: productCode !== undefined,
    queryFn: () => controller.fetchProductById(productCode as number),
    queryKey:
      productCode !== undefined
        ? productsQueryKeys.details(productCode)
        : [...productsQueryKeys.all, 'details', 'empty'],
    staleTime: 1000 * 60,
  });
}
