import {useEffect} from 'react';

import {logger} from '@/shared/utils/logger';

import {UseProductDetailsEffectsParams} from '../types/products-hooks.types';

export function useProductDetailsEffects({
  fetchProductById,
  productCode,
  setLoading,
  setProduct,
}: UseProductDetailsEffectsParams) {
  useEffect(() => {
    if (!productCode) {
      setProduct(undefined);
      return;
    }

    setLoading(true);
    fetchProductById(productCode)
      .then(result => {
        setProduct(result ?? undefined);
      })
      .catch(error => {
        logger.error(
          'ProductDetails',
          'Error while loading product details.',
          error,
        );
        setProduct(undefined);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [fetchProductById, productCode, setLoading, setProduct]);
}
