import {DimensionValue, StyleSheet} from 'react-native';

export const customTextInputStyles = StyleSheet.create({
  input: {
    width: '100%',
  },
});

export function getCustomTextInputWidthStyle(width: DimensionValue) {
  return {width};
}
