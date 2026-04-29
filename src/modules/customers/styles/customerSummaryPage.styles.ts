import {StyleSheet} from 'react-native';

import {colors} from '@/modules/styles';

export const styles = StyleSheet.create({
  column: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 10,
  },
  infoColumn: {
    flex: 1,
  },
  infoContainer: {
    marginBottom: 8,
  },
  infoText: {
    color: colors.black,
    marginBottom: 6,
  },
  label: {
    color: colors.grayDark,
    fontSize: 12,
    marginBottom: 2,
  },
  row: {
    marginBottom: 16,
  },
  sectionDivider: {
    backgroundColor: colors.grayLight,
    height: 1,
    marginBottom: 12,
  },
  sectionTitle: {
    color: colors.black,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  spaceBetweenRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusColumn: {
    alignItems: 'flex-end',
    width: '40%',
  },
  syncedStatus: {
    color: colors.arcGreen,
    fontWeight: '500',
  },
  unsyncedStatus: {
    color: colors.cancelButton,
    fontWeight: '500',
  },
});
