import {Ionicons} from '@expo/vector-icons';
import {TouchableOpacity} from 'react-native';

import {colors} from '@/modules/styles';

import {menuRouterStyles} from '../styles/menuRouter.styles';
import {MenuHeaderActionButtonProps} from '../types/menu-router.types';

export function MenuHeaderActionButton({
  iconName,
  onPress,
  variant = 'default',
}: MenuHeaderActionButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={
        variant === 'compact'
          ? menuRouterStyles.headerRightButton
          : menuRouterStyles.headerButton
      }>
      <Ionicons
        name={iconName}
        size={24}
        color={colors.white}
        style={
          variant === 'compact' ? menuRouterStyles.headerRightIcon : undefined
        }
      />
    </TouchableOpacity>
  );
}
