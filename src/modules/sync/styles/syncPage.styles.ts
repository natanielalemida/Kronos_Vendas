import {StyleSheet} from 'react-native';

import {colors, radius, spacing, typography} from '@/shared/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  contentContainer: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  statusCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  statusCopy: {
    flex: 1,
  },
  statusAnimation: {
    width: 56,
    height: 56,
  },
  statusTitle: {
    ...typography.titleMd,
    color: colors.surface,
  },
  statusDescription: {
    ...typography.bodyMd,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  lastSyncText: {
    ...typography.caption,
    color: '#64748B',
    marginTop: spacing.md,
  },
  progressSection: {
    marginTop: spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  progressTitle: {
    ...typography.bodyMd,
    color: colors.surface,
    flex: 1,
    fontWeight: '600',
  },
  progressPercentage: {
    ...typography.bodyMd,
    color: '#0F766E',
    fontWeight: '700',
  },
  progressTrack: {
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
    marginTop: spacing.md,
  },
  progressFill: {
    height: '100%',
    borderRadius: radius.pill,
    backgroundColor: '#0F766E',
  },
  progressCaption: {
    ...typography.caption,
    color: '#64748B',
    marginTop: spacing.sm,
  },
  errorText: {
    ...typography.bodyMd,
    color: colors.error,
    marginTop: spacing.sm,
  },
  primaryActionCard: {
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderWidth: 1,
    backgroundColor: colors.white,
  },
  primaryActionTitle: {
    ...typography.bodyMd,
    color: colors.surface,
    fontWeight: '700',
  },
  primaryActionDescription: {
    ...typography.caption,
    color: '#64748B',
    marginTop: spacing.xs,
  },
  primaryActionFooter: {
    marginTop: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  primaryActionFooterText: {
    ...typography.caption,
    color: '#166534',
    fontWeight: '700',
  },
  section: {
    gap: spacing.xs,
  },
  sectionTitle: {
    ...typography.caption,
    color: '#64748B',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  secondaryActionsContainer: {
    gap: spacing.sm,
  },
  secondaryActionCard: {
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    backgroundColor: colors.white,
  },
  secondaryActionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  secondaryActionTitle: {
    ...typography.bodyMd,
    color: colors.surface,
    fontWeight: '600',
  },
  actionCardSuccess: {
    borderColor: '#BBF7D0',
  },
  actionCardInfo: {
    borderColor: '#BFDBFE',
  },
  actionCardWarning: {
    borderColor: '#FED7AA',
  },
  actionCardNeutral: {
    borderColor: '#CBD5E1',
  },
  secondaryActionDot: {
    width: 12,
    height: 12,
    borderRadius: radius.pill,
  },
  actionBadgeSuccess: {
    backgroundColor: '#166534',
  },
  actionBadgeInfo: {
    backgroundColor: '#1D4ED8',
  },
  actionBadgeWarning: {
    backgroundColor: '#C2410C',
  },
  actionBadgeNeutral: {
    backgroundColor: '#334155',
  },
  actionCardDisabled: {
    opacity: 0.55,
  },
  stepsContainer: {
    gap: spacing.sm,
    paddingBottom: spacing.lg,
  },
  stepCard: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  stepCopy: {
    flex: 1,
  },
  stepLabel: {
    ...typography.bodyMd,
    color: colors.surface,
    fontWeight: '600',
  },
  stepMessage: {
    ...typography.caption,
    color: '#64748B',
    marginTop: spacing.xxs,
  },
  stepStatusBadge: {
    backgroundColor: '#E2E8F0',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  stepStatusText: {
    ...typography.caption,
    color: '#334155',
    fontWeight: '700',
  },
});
