import {Ionicons} from '@expo/vector-icons';
import {TouchableOpacity} from 'react-native';

import {colors} from '@/modules/styles';

import {salesFlowNavigatorStyles} from '../styles/salesFlowNavigator.styles';
import {SalesNavigatorHeaderButtonProps} from '../types/sales-navigation.types';

export function SalesNavigatorHeaderButton({
  iconName,
  onPress,
  compact,
  confirm,
}: SalesNavigatorHeaderButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={salesFlowNavigatorStyles.headerButton}>
      <Ionicons
        name={iconName}
        size={24}
        color={colors.white}
        style={
          confirm
            ? salesFlowNavigatorStyles.confirmIcon
            : compact
            ? salesFlowNavigatorStyles.compactIcon
            : undefined
        }
      />
    </TouchableOpacity>
  );
}
