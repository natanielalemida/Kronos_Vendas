import {DimensionValue, TextInput} from 'react-native';
import {Control, FieldPath} from 'react-hook-form';

import {LoginFormValues} from './login-form.types';

export type AuthInputProps = {
  control: Control<LoginFormValues>;
  errorMessage?: string;
  inputWidth?: DimensionValue;
  leftColor?: string;
  leftIcon?: keyof typeof import('@expo/vector-icons').Ionicons.glyphMap;
  leftSize?: number;
  name: FieldPath<LoginFormValues>;
  onEndEditing?: () => void;
  onFocus?: () => void;
  onPressRightIcon?: () => void;
  password?: boolean;
  placeholder?: string;
  rightColor?: string;
  rightIcon?: keyof typeof import('@expo/vector-icons').Ionicons.glyphMap;
  rightSize?: number;
  targetFocusField?: string;
};

export type AuthInputRef = TextInput;

export type UseAuthInputFocusParams = {
  placeholder?: string;
  targetFocusField?: string;
};
