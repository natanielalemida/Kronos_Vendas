import {Ionicons} from '@expo/vector-icons';
import {TouchableOpacity} from 'react-native';

import {colors} from '@/modules/styles';

import {menuRouterStyles} from '../styles/menuRouter.styles';
import {MenuDrawerToggleButtonProps} from '../types/menu-router.types';

export function MenuDrawerToggleButton({
  disabled,
  onPress,
}: MenuDrawerToggleButtonProps) {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={menuRouterStyles.drawerToggleButton}
      onPress={onPress}>
      <Ionicons
        name="menu"
        size={24}
        style={menuRouterStyles.drawerToggleIcon}
        color={colors.white}
      />
    </TouchableOpacity>
  );
}
