import {StyleSheet} from 'react-native';

import {colors} from '@/modules/styles';

export const ordersFilterModalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
  },
  modalContainer: {
    position: 'absolute',
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 8,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalPosition: {
    alignSelf: 'flex-end',
    right: 10,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionContent: {
    flexDirection: 'row',
  },
  optionIcon: {
    paddingHorizontal: 10,
  },
  optionLabel: {
    color: colors.black,
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
});

export function getOrdersFilterModalTopStyle(top: number) {
  return {
    top,
  };
}
