import {Dispatch, MutableRefObject, SetStateAction} from 'react';

import {ProductsNavigation} from './products-navigation.types';
import {ProductDetails, ProductListItem} from './product.types';

export type FetchProducts = (textFilter?: string) => Promise<ProductListItem[]>;
export type FetchProductById = (
  productCode: number,
) => Promise<ProductDetails | null>;

export type UseProductsPageEffectsParams = {
  debounceRef: MutableRefObject<NodeJS.Timeout | null>;
  fetchProducts: FetchProducts;
  searchText: string;
  setProducts: Dispatch<SetStateAction<ProductListItem[]>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
};

export type UseProductsPageHandlersParams = {
  navigation: ProductsNavigation;
  setSearchText: (value: string) => void;
};

export type UseProductDetailsEffectsParams = {
  fetchProductById: FetchProductById;
  productCode?: number;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setProduct: Dispatch<SetStateAction<ProductDetails | undefined>>;
};

export type UseProductGalleryStateResult = {
  selectedIndex: number;
  setSelectedIndex: Dispatch<SetStateAction<number>>;
};
