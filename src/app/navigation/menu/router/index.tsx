import {StatusBar} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {CustomersPage} from '@/modules/customers';
import {OrdersPage} from '@/modules/orders';
import {ProductsPage} from '@/modules/products';
import {SettingsPage} from '@/modules/settings';
import {SyncPage} from '@/modules/sync';
import {NewOrderPage} from '@/modules/sales';
import {colors} from '@/modules/styles';

import Exit from './exit';
import {
  DrawerScreenOptionsInput,
  MenuDrawerParamList,
} from './types/menu-router.types';
import {MenuDrawerContent} from './components/MenuDrawerContent';
import {useSetupMenuRouter} from './hooks/useSetupMenuRouter';
import {
  getClientsOptions,
  getDrawerScreenOptions,
  getExitOptions,
  getNewOrderOptions,
  getOrdersOptions,
  getProductsOptions,
  getSettingsOptions,
  getSyncOptions,
} from './menu-router.options';
import {MenuSalesDraftActionsModal} from './components/MenuSalesDraftActionsModal';

// pega versão do package.json
import {version} from '../../../../../package.json';

const Drawer = createDrawerNavigator<MenuDrawerParamList>();

export default function Menu() {
  const {
    clienteOnContext,
    isModalActive,
    isSyncing,
    produtosSelecionadosLength,
    setIsModalActive,
    handleToggleFilterModal,
  } = useSetupMenuRouter();

  return (
    <>
      <MenuSalesDraftActionsModal
        isActive={isModalActive}
        setIsActive={setIsModalActive}
      />
      <StatusBar backgroundColor={colors.arcGreen} barStyle="light-content" />
      <Drawer.Navigator
        initialRouteName="Novo Pedido"
        screenOptions={({
          navigation,
        }: {
          navigation: DrawerScreenOptionsInput['navigation'];
        }) => getDrawerScreenOptions({navigation, isSyncing})}
        drawerContent={props => (
          <MenuDrawerContent {...props} version={version} />
        )}>
        <Drawer.Screen
          name="Novo Pedido"
          component={NewOrderPage}
          options={getNewOrderOptions({
            clienteOnContext,
            produtosSelecionadosLength,
            onToggleModal: handleToggleFilterModal,
          })}
        />
        <Drawer.Screen
          name="Pedidos"
          component={OrdersPage}
          options={getOrdersOptions()}
        />
        <Drawer.Screen
          name="Produtos"
          component={ProductsPage}
          options={getProductsOptions()}
        />
        <Drawer.Screen
          name="Clientes"
          component={CustomersPage}
          options={({
            navigation,
          }: {
            navigation: DrawerScreenOptionsInput['navigation'];
          }) => getClientsOptions(navigation)}
        />
        <Drawer.Screen
          name="Configurações"
          component={SettingsPage}
          options={getSettingsOptions()}
        />
        <Drawer.Screen
          name="Sincronização"
          component={SyncPage}
          options={getSyncOptions()}
        />
        <Drawer.Screen
          name="Sair"
          component={Exit}
          options={getExitOptions()}
        />
      </Drawer.Navigator>
    </>
  );
}
