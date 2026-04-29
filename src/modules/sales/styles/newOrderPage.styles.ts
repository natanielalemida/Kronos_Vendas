import {StyleSheet} from 'react-native';

import {radius, spacing, typography} from '@/shared/theme';
import {colors} from '@/modules/styles';

export const newOrderPageStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: colors.arcGreen400,
  },
  content: {
    flex: 1,
  },
  customerCard: {
    marginTop: spacing.xs,
    marginHorizontal: spacing.xs,
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
  },
  sectionTitle: {
    ...typography.titleMd,
    fontSize: 18,
    lineHeight: 24,
    color: colors.white,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  customerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  customerTitle: {
    ...typography.titleMd,
    fontSize: 18,
    lineHeight: 24,
    color: colors.black,
  },
  customerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  customerLabel: {
    ...typography.bodyMd,
    color: colors.black,
    fontWeight: '700',
  },
  customerValue: {
    ...typography.bodyMd,
    color: colors.black,
    flexShrink: 1,
    textAlign: 'right',
  },
  addressValue: {
    ...typography.caption,
    color: colors.black,
    flexShrink: 1,
    textAlign: 'right',
  },
  itemContainer: {
    padding: spacing.md,
  },
  itemTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  itemLeft: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  itemCode: {
    ...typography.bodyMd,
    color: colors.black,
    fontWeight: '700',
  },
  itemDescription: {
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
  itemBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  itemDetailsLeft: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  itemText: {
    ...typography.caption,
    color: colors.black,
  },
  itemNote: {
    ...typography.caption,
    color: colors.black,
    marginTop: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    backgroundColor: colors.arcGreen,
    padding: spacing.md,
    alignItems: 'center',
  },
  footerSide: {
    flex: 1,
  },
  footerSideLeft: {
    alignItems: 'flex-start',
  },
  footerSideRight: {
    alignItems: 'flex-end',
  },
  actionButton: {
    padding: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonLabel: {
    ...typography.caption,
    color: colors.white,
    marginTop: spacing.xs,
  },
  totalContainer: {
    alignItems: 'center',
  },
  totalText: {
    ...typography.bodyMd,
    color: colors.white,
    fontWeight: '700',
  },
});
