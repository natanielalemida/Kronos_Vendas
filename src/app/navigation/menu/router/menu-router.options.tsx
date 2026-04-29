import {DrawerNavigationOptions} from '@react-navigation/drawer';
import {ShowIf} from '@/modules/components/showIf';

import {MenuDrawerIcon} from './components/MenuDrawerIcon';
import {MenuDrawerToggleButton} from './components/MenuDrawerToggleButton';
import {MenuHeaderActionButton} from './components/MenuHeaderActionButton';
import {menuRouterScreenBaseStyles} from './styles/menuRouter.styles';
import {
  DrawerScreenOptionsInput,
  NewOrderOptionsInput,
} from './types/menu-router.types';

export function getDrawerScreenOptions({
  navigation,
  isSyncing,
}: DrawerScreenOptionsInput): DrawerNavigationOptions {
  return {
    ...menuRouterScreenBaseStyles,
    headerLeft: () => (
      <MenuDrawerToggleButton
        disabled={isSyncing}
        onPress={() => navigation.toggleDrawer()}
      />
    ),
  };
}

export function getNewOrderOptions({
  clienteOnContext,
  produtosSelecionadosLength,
  onToggleModal,
}: NewOrderOptionsInput): DrawerNavigationOptions {
  return {
    headerRight: () => (
      <ShowIf
        condition={
          !!clienteOnContext?.NomeFantasia || produtosSelecionadosLength > 0
        }>
        <MenuHeaderActionButton
          iconName="ellipsis-vertical-sharp"
          onPress={onToggleModal}
          variant="compact"
        />
      </ShowIf>
    ),
    drawerIcon: props => (
      <MenuDrawerIcon {...props} name="document-text-outline" />
    ),
  };
}

export function getClientsOptions(
  navigation: DrawerScreenOptionsInput['navigation'],
): DrawerNavigationOptions {
  return {
    drawerIcon: props => <MenuDrawerIcon {...props} name="person-outline" />,
    headerRight: () => (
      <MenuHeaderActionButton
        iconName="add-outline"
        onPress={() => navigation.navigate('RouterCliente')}
      />
    ),
  };
}

export function getOrdersOptions(): DrawerNavigationOptions {
  return {
    drawerIcon: props => <MenuDrawerIcon {...props} name="cart-outline" />,
    headerShown: false,
  };
}

export function getProductsOptions(): DrawerNavigationOptions {
  return {
    drawerIcon: props => <MenuDrawerIcon {...props} name="pricetag-outline" />,
  };
}

export function getSettingsOptions(): DrawerNavigationOptions {
  return {
    drawerIcon: props => <MenuDrawerIcon {...props} name="settings-outline" />,
  };
}

export function getSyncOptions(): DrawerNavigationOptions {
  return {
    drawerIcon: props => <MenuDrawerIcon {...props} name="sync-outline" />,
  };
}

export function getExitOptions(): DrawerNavigationOptions {
  return {
    drawerIcon: props => (
      <MenuDrawerIcon {...props} name="exit-outline" hasBottomPadding />
    ),
    drawerLabel: 'Sair',
  };
}
