import {StyleSheet} from 'react-native';

import {colors} from '@/modules/styles';
import {radius, spacing, typography} from '@/shared/theme';

export const salesProductEditorModalStyles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
    padding: spacing.lg,
  },
  modalCard: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    maxHeight: '90%',
    overflow: 'hidden',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  scrollContent: {
    paddingBottom: spacing.md,
  },
  modalTitle: {
    ...typography.titleMd,
    color: colors.black,
    marginBottom: spacing.md,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionLabel: {
    ...typography.bodyMd,
    color: colors.black,
    fontWeight: '700',
  },
  infoGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  infoCard: {
    flex: 1,
    backgroundColor: colors.grayList,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  infoLabel: {
    ...typography.caption,
    color: colors.black,
  },
  infoValue: {
    ...typography.bodyMd,
    color: colors.black,
    fontWeight: '700',
    marginTop: spacing.xs,
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
    borderColor: colors.grayLight,
    borderRadius: radius.md,
    color: colors.black,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  noteInput: {
    minHeight: 64,
    textAlignVertical: 'top',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.grayLight,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: colors.grayLight,
    borderRadius: radius.md,
    color: colors.black,
    flex: 1,
    marginHorizontal: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    textAlign: 'center',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  totalLabel: {
    ...typography.bodyMd,
    color: colors.black,
    fontWeight: '700',
  },
  totalValue: {
    ...typography.bodyMd,
    color: colors.black,
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    paddingBottom: spacing.xs,
  },
  cancelButton: {
    alignItems: 'center',
    backgroundColor: colors.cancelButton,
    borderRadius: radius.md,
    justifyContent: 'center',
    minWidth: 56,
    paddingVertical: spacing.sm,
  },
  confirmButton: {
    alignItems: 'center',
    backgroundColor: colors.arcGreen,
    borderRadius: radius.md,
    justifyContent: 'center',
    minWidth: 56,
    paddingVertical: spacing.sm,
  },
  deleteButton: {
    alignItems: 'center',
    backgroundColor: colors.danger,
    borderRadius: radius.md,
    justifyContent: 'center',
    minWidth: 56,
    paddingVertical: spacing.sm,
  },
});
