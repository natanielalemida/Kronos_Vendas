import {useRef, useState} from 'react';

import {ProductController} from '../controllers/product.controller';
import {ProductListItem} from '../types/product.types';

export function useProductsPageState() {
  const controllerRef = useRef(new ProductController());
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [searchText, setSearchText] = useState('');

  return {
    query: {
      fetchProducts: controllerRef.current.fetchProducts.bind(
        controllerRef.current,
      ),
      isLoading,
      products,
      setLoading,
      setProducts,
    },
    search: {
      debounceRef,
      searchText,
      setSearchText,
    },
  };
}
