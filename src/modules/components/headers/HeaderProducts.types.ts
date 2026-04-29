import {Ionicons} from '@expo/vector-icons';

export type HeaderProductsProps = {
  label: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  leftColor?: string;
  leftSize?: number;
  rightColor?: string;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  rightSize?: number;
  rightColor2?: string;
  rightIcon2?: keyof typeof Ionicons.glyphMap;
  rightSize2?: number;
  onPressLeftIcon?: () => void;
  onPressRightIcon?: () => void;
  onPressRightIcon2?: () => void;
};
