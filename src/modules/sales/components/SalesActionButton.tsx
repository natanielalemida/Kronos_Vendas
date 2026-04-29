import {Ionicons} from '@expo/vector-icons';
import {Text, TouchableOpacity} from 'react-native';

import {colors} from '@/modules/styles';

import {newOrderPageStyles} from '../styles/newOrderPage.styles';
import {SalesActionButtonProps} from '../types/sales-page.types';

export function SalesActionButton({
  iconName,
  label,
  onPress,
}: SalesActionButtonProps) {
  return (
    <TouchableOpacity style={newOrderPageStyles.actionButton} onPress={onPress}>
      <Ionicons name={iconName} size={25} color={colors.white} />
      <Text style={newOrderPageStyles.actionButtonLabel}>{label}</Text>
    </TouchableOpacity>
  );
}
