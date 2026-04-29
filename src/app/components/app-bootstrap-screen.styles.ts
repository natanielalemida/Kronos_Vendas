import {StyleSheet} from 'react-native';

import {colors} from '@/shared/theme/tokens/colors';

export const appBootstrapScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 24,
  },
  title: {
    marginTop: 16,
    color: colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    marginTop: 8,
    color: colors.error,
    textAlign: 'center',
  },
});
