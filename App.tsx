import 'react-native-gesture-handler';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Login from './src/modules/login/Login';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Settings from './src/modules/login/Settings';
import { NavigationContainer } from '@react-navigation/native';
import Menu from './src/modules/menu/router';
import RouterCliente from './src/modules/menu/components/Clientes/router/routerClientes';
import Toast from 'react-native-toast-message';
import { ClienteProvider } from './src/modules/menu/components/Clientes/context/clientContext';
import ListAndSelectClientes from './src/modules/menu/components/NovaRequisicao/router/routerClientes';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';
import ResumoPedido from './src/modules/menu/components/Pedidos/components/resumoPedido/resumoPedido';
import PedidosCliente from './src/modules/menu/components/Pedidos/pedidosCliente';
import ConexaoAtual from './src/modules/login/ConexaoAtual';
import ProdutoCatalogo from './src/modules/menu/components/Produtos/catalogo';

const Stack = createNativeStackNavigator();

// Defina a versão do aplicativo aqui
const APP_VERSION = '1.2.2';

// Componente que exibe a versão
const VersionBadge = () => (
  <View style={styles.versionContainer}>
    <Text style={styles.versionText}>v{APP_VERSION}</Text>
  </View>
);

// Componente que envolve todas as telas com o badge de versão
const AppWithVersion = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.appContainer}>
    <VersionBadge />
    {children}
  </View>
);

function App(): React.JSX.Element {
  return (
    <AutocompleteDropdownContextProvider>
      <NavigationContainer>
        <ClienteProvider>
          <AppWithVersion>
            <Stack.Navigator>
              <Stack.Screen
                name="Login"
                component={Login}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Settings"
                component={Settings}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Conexoes"
                component={ConexaoAtual}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="ResumoPedido"
                component={ProdutoCatalogo}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="PedidosCliente"
                component={PedidosCliente}
                options={{ headerShown: false }}
              />
              <Stack.Group>
                <Stack.Screen
                  name="Menu"
                  component={Menu}
                  options={{ headerShown: false }}
                />
              </Stack.Group>
              <Stack.Group>
                <Stack.Screen
                  name="resumoPedidoNavigation"
                  component={ResumoPedido}
                  options={{ headerShown: false }}
                />
              </Stack.Group>
              <Stack.Group>
                <Stack.Screen
                  name="ListClientes"
                  component={ListAndSelectClientes}
                  options={{ headerShown: false }}
                />
              </Stack.Group>
              <Stack.Group>
                <Stack.Screen
                  name="RouterCliente"
                  component={RouterCliente}
                  options={{ headerShown: false }}
                />
              </Stack.Group>
            </Stack.Navigator>
          </AppWithVersion>
        </ClienteProvider>
      </NavigationContainer>
      <Toast />
    </AutocompleteDropdownContextProvider>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    position: 'relative',
  },
  versionContainer: {
    position: 'absolute',
    top: 35, // Ajuste conforme a necessidade
    right: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    zIndex: 999,
  },
  versionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default App;