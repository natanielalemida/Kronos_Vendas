import {StyleSheet} from 'react-native';

import {colors} from '@/modules/styles';
import {radius, spacing, typography} from '@/shared/theme';

export const salesCheckoutPageStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.arcGreen400,
  },
  content: {
    padding: spacing.md,
    gap: spacing.md,
  },
  emptyState: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  emptyStateTitle: {
    ...typography.titleMd,
    color: colors.black,
    marginBottom: spacing.xs,
  },
  emptyStateText: {
    ...typography.bodyMd,
    color: colors.black,
  },
  paymentCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  paymentCardHeader: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  paymentCardCode: {
    ...typography.bodyMd,
    color: colors.black,
    fontWeight: '700',
  },
  paymentCardTitle: {
    ...typography.bodyMd,
    color: colors.black,
    flex: 1,
    fontWeight: '700',
  },
  paymentConditionBlock: {
    paddingTop: spacing.xs,
  },
  paymentConditionTitle: {
    ...typography.caption,
    color: colors.black,
    fontWeight: '700',
  },
  paymentConditionAmount: {
    ...typography.bodyMd,
    color: colors.black,
    marginTop: spacing.xs,
  },
  paymentConditionLine: {
    ...typography.caption,
    color: colors.black,
    marginTop: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.arcGreen,
    padding: spacing.md,
  },
  totalContainer: {
    flex: 1,
    alignItems: 'center',
  },
  totalLabel: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '700',
  },
  totalValue: {
    ...typography.bodyMd,
    color: colors.white,
    fontWeight: '700',
  },
  actionsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.md,
  },
  footerAction: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerActionLabel: {
    ...typography.caption,
    color: colors.white,
    marginTop: spacing.xs,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    padding: spacing.lg,
  },
  finalizeModal: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  deleteModal: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  deleteModalText: {
    ...typography.bodyMd,
    color: colors.black,
    marginBottom: spacing.md,
  },
  deleteModalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalTitle: {
    ...typography.titleMd,
    color: colors.black,
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  summaryLabel: {
    ...typography.bodyMd,
    color: colors.black,
    fontWeight: '700',
  },
  summaryValue: {
    ...typography.bodyMd,
    color: colors.black,
  },
  formSection: {
    marginBottom: spacing.md,
  },
  fieldLabel: {
    ...typography.caption,
    color: colors.black,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  fieldInput: {
    borderWidth: 1,
    borderColor: colors.graySearch,
    borderRadius: radius.md,
    color: colors.black,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  textAreaInput: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  modalActionButton: {
    backgroundColor: colors.arcGreen,
    borderRadius: radius.md,
    minWidth: 132,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalActionButtonCancel: {
    backgroundColor: colors.danger,
  },
  modalActionLabel: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  paymentModalContainer: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colors.white,
  },
  selectorChip: {
    borderWidth: 1,
    borderColor: colors.arcGreen,
    borderRadius: radius.pill,
    marginRight: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  selectorChipActive: {
    backgroundColor: colors.arcGreen,
  },
  selectorChipLabel: {
    ...typography.caption,
    color: colors.arcGreen,
    fontWeight: '700',
  },
  selectorChipLabelActive: {
    color: colors.white,
  },
  summaryCard: {
    backgroundColor: colors.grayList,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
});
