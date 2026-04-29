import {StyleSheet} from 'react-native';

import {colors} from '@/modules/styles';

export const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    paddingBottom: 15,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    alignItems: 'center',
    width: '100%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    padding: 10,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  title: {
    backgroundColor: colors.arcGreen,
    width: '100%',
    alignItems: 'center',
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  label: {
    marginRight: 10,
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
