import {StyleSheet} from 'react-native';

import {colors} from '@/modules/styles';

export const menuSalesDraftActionsModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    padding: 5,
    paddingTop: 40,
  },
  content: {
    alignSelf: 'flex-end',
    backgroundColor: colors.grayDark,
    padding: 15,
  },
  actionButton: {
    paddingVertical: 10,
  },
  actionLabel: {
    color: colors.white,
  },
});
