import React from 'react';
import {TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

import {customersFlowNavigatorStyles} from '../styles/customersFlowNavigator.styles';
import {CustomersFlowBackButtonProps} from '../types/customers-router.types';

const CustomersFlowBackButtonBase = ({
  onPress,
}: CustomersFlowBackButtonProps) => (
  <TouchableOpacity onPress={onPress}>
    <Ionicons
      name="chevron-back"
      size={25}
      color="#fff"
      style={customersFlowNavigatorStyles.iconLeft}
    />
  </TouchableOpacity>
);

CustomersFlowBackButtonBase.displayName = 'CustomersFlowBackButton';

export const CustomersFlowBackButton = React.memo(CustomersFlowBackButtonBase);
