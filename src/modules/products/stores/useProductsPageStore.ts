import {create} from 'zustand';

type ProductsPageStore = {
  searchText: string;
  setSearchText: (value: string) => void;
};

export const useProductsPageStore = create<ProductsPageStore>(set => ({
  searchText: '',
  setSearchText: value => set({searchText: value}),
}));
