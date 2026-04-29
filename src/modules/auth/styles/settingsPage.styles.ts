import {StyleSheet} from 'react-native';

import {colors} from '@/modules/styles';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.arcGreen400,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    borderRadius: 16,
    elevation: 2,
    width: '90%',
    marginTop: 15,
  },
  optionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
  },
  optionButtonIcon: {
    marginRight: 15,
  },
  optionButtonTextContainer: {
    width: '100%',
  },
  optionButtonTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'black',
  },
  optionButtonDetail: {
    color: 'black',
  },
});
