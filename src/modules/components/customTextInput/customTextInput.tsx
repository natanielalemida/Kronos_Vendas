import React from 'react';
import {TextInput, StyleSheet, TextInputProps} from 'react-native';

interface CustomTextInputProps extends TextInputProps {
  width?: string | number;
}

export default function CustomTextInput({
  width = '100%',
  ...props
}: CustomTextInputProps) {
  return <TextInput style={[styles.input, {width}]} {...props} />;
}

const styles = StyleSheet.create({
  input: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 16,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'black',
    marginHorizontal: 2,
    padding: 10,
  },
});
