import {StyleSheet} from 'react-native';
import {colors} from '../../styles';

export const searchStyles = StyleSheet.create({
  container: {
    width: '90%',
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.grayLight,
    borderRadius: 30,
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.black,
  },
  clearButton: {},
});
