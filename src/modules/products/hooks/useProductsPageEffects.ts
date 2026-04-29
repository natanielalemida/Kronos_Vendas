import {useEffect} from 'react';

import {UseProductsPageEffectsParams} from '../types/products-hooks.types';

const SEARCH_DEBOUNCE_DELAY = 500;

export function useProductsPageEffects({
  debounceRef,
  fetchProducts,
  searchText,
  setLoading,
  setProducts,
}: UseProductsPageEffectsParams) {
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      setLoading(true);
      fetchProducts(searchText)
        .then(result => {
          setProducts(result);
        })
        .catch(error => {
          console.error('Error while loading products', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }, SEARCH_DEBOUNCE_DELAY);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [debounceRef, fetchProducts, searchText, setLoading, setProducts]);
}
