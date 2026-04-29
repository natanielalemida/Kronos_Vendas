import {Ionicons} from '@expo/vector-icons';

export type HeaderProps = {
  label: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  leftColor?: string;
  leftSize?: number;
  rightColor?: string;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  rightSize?: number;
  rightButtonDisable?: boolean;
  leftButtonDisable?: boolean;
  onPressLeftIcon?: () => void;
  onPressRighttIcon?: () => void;
};
