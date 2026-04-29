import {useRef, useState} from 'react';

import {ProductController} from '../controllers/product.controller';
import {ProductDetails} from '../types/product.types';

export function useProductDetailsState() {
  const controllerRef = useRef(new ProductController());
  const [isLoading, setLoading] = useState(false);
  const [product, setProduct] = useState<ProductDetails>();

  return {
    query: {
      fetchProductById: controllerRef.current.fetchProductById.bind(
        controllerRef.current,
      ),
      isLoading,
      product,
      setLoading,
      setProduct,
    },
  };
}
