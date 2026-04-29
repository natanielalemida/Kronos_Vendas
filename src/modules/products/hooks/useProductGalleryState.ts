import {useProductGalleryStore} from '../stores/useProductGalleryStore';

export function useProductGalleryState() {
  return {
    selectedIndex: useProductGalleryStore(state => state.selectedIndex),
    setSelectedIndex: useProductGalleryStore(state => state.setSelectedIndex),
  };
}
