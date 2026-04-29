import {StyleSheet} from 'react-native';

import {colors} from '@/modules/styles';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
  },
  filterIcon: {
    paddingHorizontal: 10,
  },
  scrollContainer: {
    width: '100%',
  },
  itemContainer: {
    width: '100%',
    padding: 15,
  },
  itemTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemCode: {
    fontSize: 14,
    color: colors.black,
    fontWeight: 'bold',
  },
  itemDescription: {
    width: '62%',
    fontSize: 14,
    color: colors.black,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 14,
    color: colors.black,
    fontWeight: 'bold',
  },
  bottomRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  labelText: {
    color: colors.black,
  },
  itemMetaContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
  },
  syncContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  syncLabel: {
    fontWeight: 'bold',
    color: colors.black,
  },
  checkboxContainer: {
    backgroundColor: undefined,
    padding: 0,
    marginRight: -1,
  },
});
