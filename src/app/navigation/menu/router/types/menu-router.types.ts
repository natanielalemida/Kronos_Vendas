import {DrawerContentComponentProps} from '@react-navigation/drawer';
import {DrawerNavigationOptions} from '@react-navigation/drawer';
import {ClienteDto} from '@/modules/sync/types/customer-sync.types';
import {Dispatch, SetStateAction} from 'react';
import {Ionicons} from '@expo/vector-icons';

export type MenuDrawerParamList = {
  'Novo Pedido': undefined;
  Pedidos: undefined;
  Produtos: undefined;
  Clientes: undefined;
  Configurações: undefined;
  Sincronização: undefined;
  Sair: undefined;
};

export type DrawerIconProps = {
  color: string;
  size: number;
};

export type MenuNavigationAdapter = {
  toggleDrawer: () => void;
  navigate: (routeName: string) => void;
};

export type DrawerScreenOptionsInput = {
  navigation: MenuNavigationAdapter;
  isSyncing: boolean;
};

export type NewOrderOptionsInput = {
  clienteOnContext: ClienteDto | undefined;
  produtosSelecionadosLength: number;
  onToggleModal: () => void;
};

export type CustomDrawerContentProps = DrawerContentComponentProps;
export type MenuDrawerScreenOptions = DrawerNavigationOptions;

export type UseSetupMenuRouterResult = {
  clienteOnContext: ClienteDto | undefined;
  isModalActive: boolean;
  isSyncing: boolean;
  produtosSelecionadosLength: number;
  setIsModalActive: Dispatch<SetStateAction<boolean>>;
  handleToggleFilterModal: () => void;
};

export type MenuDrawerContentComponentProps = CustomDrawerContentProps & {
  version: string;
};

export type MenuDrawerIconComponentProps = DrawerIconProps & {
  name: keyof typeof Ionicons.glyphMap;
  hasBottomPadding?: boolean;
};

export type MenuDrawerToggleButtonProps = {
  disabled: boolean;
  onPress: () => void;
};

export type MenuSalesDraftActionsModalProps = {
  isActive: boolean;
  setIsActive: (value: boolean) => void;
};

export type MenuSalesDraftNavigation = {
  navigate: (routeName: string, params?: Record<string, unknown>) => void;
};

export type MenuHeaderActionButtonProps = {
  iconName: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  variant?: 'default' | 'compact';
};

export type ExitScreenNavigation = {
  navigate: (routeName: 'Login') => void;
};

export type ExitScreenProps = {
  navigation: ExitScreenNavigation;
};
