import {ViewStyle} from 'react-native';

export type ShowIfProps = {
  condition: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
};
