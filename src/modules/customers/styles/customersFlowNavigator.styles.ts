import {StyleSheet} from 'react-native';

import {colors} from '@/modules/styles';

export const customersFlowNavigatorStyles = StyleSheet.create({
  iconLeft: {
    marginLeft: 10,
  },
});

export const customersFlowNavigatorTheme = {
  headerStyle: {backgroundColor: colors.arcGreen},
  headerTintColor: '#fff',
  tabBarActiveTintColor: '#fff',
  tabBarInactiveTintColor: 'gray',
  tabBarStyle: {backgroundColor: colors.arcGreen},
};
