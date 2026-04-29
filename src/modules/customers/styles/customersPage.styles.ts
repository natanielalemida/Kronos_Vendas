import {StyleSheet} from 'react-native';

import {colors} from '@/modules/styles';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    width: '100%',
  },
  itemContainer: {
    padding: 15,
  },
  itemTopRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  itemCode: {
    color: colors.black,
    marginRight: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemDocument: {
    color: colors.black,
    marginRight: 5,
    fontSize: 14,
    fontWeight: 'bold',
  },
  itemDescription: {
    width: '85%',
    marginHorizontal: 10,
    fontSize: 16,
    color: colors.black,
    fontWeight: 'bold',
  },
  addressText: {
    color: colors.black,
    fontSize: 14,
  },
  emptyStateText: {
    color: colors.black,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});
