import {StyleSheet} from 'react-native';

import {colors} from '@/modules/styles';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flexInput: {
    flex: 1,
  },
  input: {
    color: colors.black,
    height: 40,
    paddingLeft: 12,
  },
  inputContainer: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    flex: 1,
    flexDirection: 'row',
  },
  inputIcon: {
    paddingRight: 8,
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
});
