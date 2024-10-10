export type HeaderProps = {
  label: string;
  leftIcon?: string;
  leftColor?: string;
  leftSize?: number;
  rightColor?: string;
  rightIcon?: string;
  rightSize?: number;
  rightButtonDisable?: boolean;
  leftButtonDisable?: boolean;
  onPressLeftIcon?: () => void;
  onPressRighttIcon?: () => void;
};
