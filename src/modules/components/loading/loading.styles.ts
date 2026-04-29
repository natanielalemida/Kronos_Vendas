import {StyleSheet} from 'react-native';
import {colors} from '@/modules/styles';

export const loadingStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginMessage: {
    color: colors.white,
  },
});
