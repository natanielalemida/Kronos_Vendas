import {StyleSheet} from 'react-native';

import {colors} from '@/modules/styles';
import {spacing, typography} from '@/shared/theme';

export const salesSelectionPageStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
  },
  searchWrapper: {
    alignSelf: 'center',
  },
  content: {
    flex: 1,
  },
  listContent: {
    paddingBottom: spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    zIndex: 1,
  },
  loadingText: {
    ...typography.bodyMd,
    color: colors.black,
    marginTop: spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  emptyText: {
    ...typography.bodyMd,
    color: colors.black,
    textAlign: 'center',
  },
});
