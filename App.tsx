import 'react-native-gesture-handler';
import Login from './src/modules/login/Login';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Settings from './src/modules/login/Settings';
import {NavigationContainer} from '@react-navigation/native';
import Menu from './src/modules/menu/router';
import RouterCliente from './src/modules/menu/components/Clientes/router/routerClientes';
import {colors} from './src/modules/styles';
import Toast from 'react-native-toast-message';
import {ClienteProvider} from './src/modules/menu/components/Clientes/context/clientContext';
import ListAndSelectClientes from './src/modules/menu/components/NovaRequisicao/router/routerClientes';
import {AutocompleteDropdownContextProvider} from 'react-native-autocomplete-dropdown';
import ResumoPedido from './src/modules/menu/components/Pedidos/components/resumoPedido/resumoPedido';
import PedidosCliente from './src/modules/menu/components/Pedidos/pedidosCliente';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    <AutocompleteDropdownContextProvider>
      <NavigationContainer>
        <ClienteProvider>
          <Stack.Navigator>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Settings"
              component={Settings}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="PedidosCliente"
              component={PedidosCliente}
              options={{headerShown: false}}
            />
            <Stack.Group>
              <Stack.Screen
                name="Menu"
                component={Menu}
                options={{headerShown: false}}
              />
            </Stack.Group>
            <Stack.Group>
              <Stack.Screen
                name="resumoPedidoNavigation"
                component={ResumoPedido}
                options={{headerShown: false}}
              />
            </Stack.Group>
            <Stack.Group>
              <Stack.Screen
                name="ListClientes"
                component={ListAndSelectClientes}
                options={{headerShown: false}}
              />
            </Stack.Group>
            <Stack.Group>
              <Stack.Screen
                name="RouterCliente"
                component={RouterCliente}
                options={{headerShown: false}}
              />
            </Stack.Group>
          </Stack.Navigator>
        </ClienteProvider>
      </NavigationContainer>
      <Toast />
    </AutocompleteDropdownContextProvider>
  );
}

export default App;
