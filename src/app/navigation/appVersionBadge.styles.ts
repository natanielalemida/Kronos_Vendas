import {StyleSheet} from 'react-native';

import {colors} from '@/shared/theme/tokens/colors';

export const appVersionBadgeStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 35,
    right: 20,
    zIndex: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  text: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
});
