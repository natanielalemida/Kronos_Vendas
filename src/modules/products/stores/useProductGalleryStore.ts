import {create} from 'zustand';

type ProductGalleryStore = {
  selectedIndex: number;
  setSelectedIndex: (value: number) => void;
};

export const useProductGalleryStore = create<ProductGalleryStore>(set => ({
  selectedIndex: 0,
  setSelectedIndex: value => set({selectedIndex: value}),
}));
