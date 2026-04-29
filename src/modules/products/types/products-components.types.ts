import {ProductDetails, ProductListItem} from './product.types';

export type ProductCardProps = {
  item: ProductListItem;
  onPress: (productCode: number) => void;
};

export type ProductGalleryProps = {
  images: ProductDetails['images'];
  selectedIndex: number;
  onChangeIndex: (index: number) => void;
};
