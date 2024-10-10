import React, {forwardRef} from 'react';
import {TextInput, StyleSheet, TextInputProps} from 'react-native';
import {colors} from '../../styles';

interface CustomTextInputProps extends TextInputProps {
  width?: string | number;
}

const CustomTextInput = forwardRef<TextInput, CustomTextInputProps>(
  ({width = '100%', ...props}, ref) => {
    return (
      <TextInput
        style={{width}}
        {...props}
        ref={ref}
        placeholderTextColor={colors.black}
      />
    );
  },
);

export default CustomTextInput;
