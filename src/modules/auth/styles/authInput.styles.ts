import {DimensionValue, Dimensions, StyleSheet} from 'react-native';
import {colors} from '@/modules/styles';

const {height, width} = Dimensions.get('window');

export const styles = StyleSheet.create({
  fieldContainer: {
    marginVertical: height * 0.004,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: width * 0.013,
    height: height * 0.07,
    paddingRight: width * 0.04,
    borderRadius: width * 0.021,
    borderWidth: 1,
    borderColor: 'black',
  },
  inputContainerError: {
    borderColor: colors.danger,
  },
  leftIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: height * 0.06,
    width: width * 0.4,
  },
  leftIcon: {
    paddingHorizontal: width * 0.027,
  },
  textField: {
    width: '80%',
  },
  labelText: {
    width: '80%',
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    marginTop: 4,
    paddingHorizontal: width * 0.01,
  },
  textFieldDark: {
    color: colors.black,
  },
  fieldContainerFullWidth: {
    width: '100%',
  },
  labelTextDark: {
    color: colors.black,
  },
});

export function getAuthInputWidthStyle(inputWidth: DimensionValue) {
  return {width: inputWidth};
}
