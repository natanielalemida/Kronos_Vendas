import {StyleSheet} from 'react-native';

import {colors} from '@/modules/styles';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    width: '100%',
  },
  input: {
    color: colors.black,
    height: 40,
  },
  listContent: {
    padding: 10,
  },
  suggestion: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    color: colors.black,
    padding: 10,
  },
  suggestionsContainer: {
    backgroundColor: colors.white,
    borderColor: '#ccc',
    borderRadius: 5,
    borderWidth: 1,
    marginTop: 5,
  },
});
