import {StyleSheet} from 'react-native';

import {spacing} from '@/shared/theme';

import {colors} from '../../styles';

export const headerStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.headerPrimary,
    alignItems: 'flex-end',
    flexDirection: 'row',
    minHeight: 96,
    paddingTop: spacing.xxl,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    justifyContent: 'space-between',
    width: '100%',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '65%',
  },
  label: {
    color: colors.white,
    fontSize: 18,
  },
  iconButton: {
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
