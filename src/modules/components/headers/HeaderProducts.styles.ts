import {StyleSheet} from 'react-native';
import {colors} from '../../styles';

export const headerProductsStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.arcGreen,
    alignItems: 'flex-end',
    flexDirection: 'row',
    height: '11%',
    justifyContent: 'space-between',
    paddingTop: 25,
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: '100%',
  },
  leftContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftButton: {
    paddingRight: 15,
    paddingTop: 1,
  },
  label: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '500',
  },
  rightContainer: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  rightIcon: {
    marginTop: 5,
    paddingRight: 15,
  },
});
