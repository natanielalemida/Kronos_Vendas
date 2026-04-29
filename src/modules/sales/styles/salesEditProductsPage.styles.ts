import {StyleSheet} from 'react-native';

import {colors} from '@/modules/styles';
import {radius, spacing, typography} from '@/shared/theme';

export const salesEditProductsPageStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...typography.bodyMd,
    color: colors.black,
  },
  itemCard: {
    backgroundColor: colors.grayList,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    padding: spacing.md,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  itemCode: {
    ...typography.bodyMd,
    color: colors.black,
    fontWeight: '700',
  },
  itemTitle: {
    ...typography.bodyMd,
    color: colors.black,
    flex: 1,
    fontWeight: '700',
  },
  itemPrice: {
    ...typography.bodyMd,
    color: colors.black,
    fontWeight: '700',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  itemMeta: {
    ...typography.caption,
    color: colors.black,
  },
});
