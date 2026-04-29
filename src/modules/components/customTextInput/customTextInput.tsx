import React, {forwardRef} from 'react';
import {TextInput} from 'react-native';
import {colors} from '../../styles';
import {
  customTextInputStyles,
  getCustomTextInputWidthStyle,
} from './customTextInput.styles';
import {CustomTextInputProps} from './customTextInput.types';

const CustomTextInput = forwardRef<TextInput, CustomTextInputProps>(
  ({width = '100%', style, ...props}, ref) => {
    return (
      <TextInput
        style={[
          customTextInputStyles.input,
          getCustomTextInputWidthStyle(width),
          style,
        ]}
        {...props}
        ref={ref}
        placeholderTextColor={colors.black}
      />
    );
  },
);

CustomTextInput.displayName = 'CustomTextInput';

export default CustomTextInput;
