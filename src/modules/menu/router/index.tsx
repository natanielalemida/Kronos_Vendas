import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors} from '../../styles';
import NovaRequisicao from '../components/NovaRequisicao';
import Produto from '../components/Produtos';
import Clientes from '../components/Clientes';
import {useCliente} from '../components/Clientes/context/clientContext';
import Sincronizacao from '../components/sync';
import Configuracoes from '../components/Configuracoes';
import Pedidos from '../components/Pedidos/pedidos';
import ModalFilterMenu from '../components/Pedidos/components/modalFilterMenu';
import UseRepository from '../components/Pedidos/hooks/useRepository';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';
import Exit from './exit';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const {usuario} = useCliente();
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.userBar}>
        <View>
          <Text style={styles.userTextPhoto}>{usuario?.Login}</Text>
          <Text style={styles.userText}>Kronos vendas</Text>
        </View>
        <Image
          style={{width: 50, height: 50, borderRadius: 100}}
          source={{
            uri: 'https://img.freepik.com/vetores-gratis/gato-bonito-sentado-ilustracao-em-vetor-icone-dos-desenhos-animados-conceito-de-icone-de-natureza-animal-isolado-de-vetor-premium-estilo-de-desenho-animado-plano_138676-4148.jpg',
          }}
        />
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

export default function Menu() {
  const [isModalActive, setIsModalActive] = React.useState(false);

  const {clienteOnContext, isSyncing} = useCliente();
  const userName = clienteOnContext?.NomeFantasia
    ? clienteOnContext.NomeFantasia
    : 'Novo Pedido';

  return (
    <>
      <ModalFilterMenu
        isActive={isModalActive}
        setIsActive={setIsModalActive}
      />
      <StatusBar backgroundColor={colors.arcGreen} barStyle="light-content" />
      <Drawer.Navigator
        initialRouteName="Nova Requisição"
        screenOptions={({navigation}) => ({
          ...style,
          headerLeft: () => (
            <TouchableOpacity
              disabled={isSyncing}
              style={{marginLeft: 16}}
              onPress={() => navigation.toggleDrawer()}>
              <Icon name="menu" size={24} color={colors.white} />
            </TouchableOpacity>
          ),
        })}
        drawerContent={props => <CustomDrawerContent {...props} />}>
        <Drawer.Screen
          name="Novo Pedido"
          component={NovaRequisicao}
          options={{
            headerTitle: userName,
            headerRight: () => (
              <TouchableOpacity
                disabled={!clienteOnContext}
                onPress={() => setIsModalActive(true)}>
                <Icon
                  name="ellipsis-vertical-sharp"
                  size={24}
                  color={colors.white}
                  style={{marginRight: 16}}
                />
              </TouchableOpacity>
            ),
            drawerIcon: ({color, size}) => (
              <Icon name="document-text-outline" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen
          name="Pedidos"
          component={Pedidos}
          options={({navigation}) => ({
            drawerIcon: ({color, size}) => (
              <Icon name="cart-outline" color={color} size={size} />
            ),
            headerShown: false, // Esconde a barra de navegação
          })}
        />
        <Drawer.Screen
          name="Produtos"
          component={Produto}
          options={{
            drawerIcon: ({color, size}) => (
              <Icon name="pricetag-outline" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen
          name="Clientes"
          component={Clientes}
          options={({navigation}) => ({
            drawerIcon: ({color, size}) => (
              <Icon name="person-outline" color={color} size={size} />
            ),
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate('RouterCliente')}
                style={styles.headerButton}>
                <Icon name="add-outline" size={24} color={colors.white} />
              </TouchableOpacity>
            ),
          })}
        />
        <Drawer.Screen
          name="Configurações"
          component={Configuracoes}
          options={{
            drawerIcon: ({color, size}) => (
              <Icon name="settings-outline" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen
          name="Sincronização"
          component={Sincronizacao}
          options={{
            drawerIcon: ({color, size}) => (
              <Icon name="sync-outline" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen
          name="Sair"
          component={Exit}
          options={({navigation}) => ({
            drawerIcon: ({color, size}) => (
              <Icon name="exit-outline" color={color} size={size} />
            ),
            drawerLabel: 'Sair',
          })}
        />
      </Drawer.Navigator>
    </>
  );
}

const style = {
  headerStyle: {
    backgroundColor: colors.arcGreen,
  },
  drawerStyle: {backgroundColor: colors.arcGreen400},
  headerTintColor: colors.white,
};

const styles = StyleSheet.create({
  userBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.arcGreen, // Cor de fundo azul
    padding: 16,
    marginTop: -4,
  },
  userText: {
    color: colors.white, // Cor do texto branca
    fontWeight: 'bold',
  },
  userTextPhoto: {
    color: colors.white, // Cor do texto branca
    fontWeight: 'bold',
    fontSize: 16,
  },
  headerButton: {
    marginRight: 16, // Espaçamento entre o ícone e a borda direita
  },
});
