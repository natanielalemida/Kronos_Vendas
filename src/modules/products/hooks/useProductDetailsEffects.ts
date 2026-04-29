import {useEffect} from 'react';

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
        console.error('Error while loading product details', error);
        setProduct(undefined);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [fetchProductById, productCode, setLoading, setProduct]);
}
