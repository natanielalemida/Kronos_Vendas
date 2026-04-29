import {StyleSheet} from 'react-native';

import {colors} from '@/modules/styles';

export const styles = StyleSheet.create({
  checkboxButton: {
    height: 30,
    marginLeft: 15,
    width: 30,
  },
  checkboxContainer: {
    backgroundColor: undefined,
    padding: 0,
    paddingRight: 30,
  },
  container: {
    flex: 1,
  },
  flexInput: {
    flex: 1,
  },
  input: {
    color: colors.black,
    flex: 1,
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
  numberContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
});
