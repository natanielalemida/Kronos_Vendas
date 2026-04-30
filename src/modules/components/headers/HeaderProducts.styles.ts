import {StyleSheet} from 'react-native';

import {spacing} from '@/shared/theme';

import {colors} from '../../styles';

export const headerProductsStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.headerPrimary,
    alignItems: 'flex-end',
    flexDirection: 'row',
    minHeight: 96,
    justifyContent: 'space-between',
    paddingTop: spacing.xxl,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    width: '100%',
  },
  leftContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftButton: {
    paddingRight: spacing.sm,
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
    paddingRight: spacing.sm,
  },
});
