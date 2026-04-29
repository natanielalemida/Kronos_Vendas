import {StyleSheet} from 'react-native';

import {colors} from '../../styles';

export const headerStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.arcGreen,
    alignItems: 'flex-end',
    flexDirection: 'row',
    minHeight: '11%',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    width: '100%',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '65%',
    marginTop: 20,
  },
  label: {
    color: colors.white,
    fontSize: 18,
  },
  iconButton: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
