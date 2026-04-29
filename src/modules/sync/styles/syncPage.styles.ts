import {StyleSheet} from 'react-native';

import {colors, radius, spacing, typography} from '@/shared/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.white,
  },
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xl,
  },
  heroAnimation: {
    width: 156,
    height: 156,
  },
  progressAnimation: {
    width: 360,
    height: 72,
  },
  title: {
    ...typography.titleMd,
    color: colors.surface,
    marginTop: spacing.sm,
  },
  subtitle: {
    ...typography.bodyMd,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  progressText: {
    ...typography.bodyMd,
    color: colors.surface,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  lastSyncText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  actionsContainer: {
    gap: spacing.sm,
    paddingBottom: spacing.lg,
  },
  actionButton: {
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonSuccess: {
    backgroundColor: colors.success,
  },
  actionButtonInfo: {
    backgroundColor: colors.info,
  },
  actionButtonWarning: {
    backgroundColor: colors.warning,
  },
  actionButtonNeutral: {
    backgroundColor: colors.surface,
  },
  actionButtonDisabled: {
    opacity: 0.6,
  },
  actionLabel: {
    ...typography.bodyMd,
    color: colors.white,
    fontWeight: '600',
  },
});
