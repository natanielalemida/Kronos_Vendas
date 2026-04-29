import {Ionicons} from '@expo/vector-icons';

import {menuRouterStyles} from '../styles/menuRouter.styles';
import {MenuDrawerIconComponentProps} from '../types/menu-router.types';

export function MenuDrawerIcon({
  color,
  size,
  name,
  hasBottomPadding,
}: MenuDrawerIconComponentProps) {
  return (
    <Ionicons
      name={name}
      color={color}
      size={size}
      style={hasBottomPadding ? menuRouterStyles.exitIcon : undefined}
    />
  );
}
