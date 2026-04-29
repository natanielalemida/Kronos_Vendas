import {StyleSheet} from 'react-native';

import {colors} from '@/modules/styles';
import {radius, spacing, typography} from '@/shared/theme';

export const customerActionsModalStyles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalCard: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    maxHeight: '80%',
    paddingBottom: spacing.md,
    width: '80%',
  },
  content: {
    padding: spacing.md,
    width: '100%',
  },
  title: {
    ...typography.titleMd,
    color: colors.black,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  actionButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    width: '100%',
  },
  actionLabel: {
    ...typography.bodyMd,
    color: colors.black,
  },
  cancelButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  cancelLabel: {
    ...typography.bodyMd,
    color: colors.cancelButton,
    fontWeight: '500',
  },
});
