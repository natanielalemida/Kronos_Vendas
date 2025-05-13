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
import Clientes from '../components/Clientes';
import {useCliente} from '../components/Clientes/context/clientContext';
import Sincronizacao from '../components/sync';
import Configuracoes from '../components/Configuracoes';
import Pedidos from '../components/Pedidos/pedidos';
import ModalFilterMenu from '../components/Pedidos/components/modalFilterMenu';
import Exit from './exit';
import {ShowIf} from '../../components/showIf';
import ListaProdutosResumo from '../components/Produtos/router/routerProdutos';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const {usuario} = useCliente();
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{paddingTop: 0, paddingBottom: 35}}>
      <View style={styles.userBar}>
        <View>
          <Text style={styles.userTextPhoto}>{usuario?.Login}</Text>
          <Text style={styles.userText}>Kronos vendas</Text>
        </View>
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 100,
            backgroundColor: colors.white,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            style={{width: 40, height: 40}}
            source={{
              uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png',
            }}
          />
        </View>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

export default function Menu() {
  const [isModalActive, setIsModalActive] = React.useState(false);

  const {clienteOnContext, isSyncing, ProdutosSelecionados} = useCliente();

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
              <Icon name="menu" size={24} style={{padding: 10}} color={colors.white} />
            </TouchableOpacity>
          ),
        })}
        drawerContent={props => <CustomDrawerContent {...props} />}>
        <Drawer.Screen
          name="Novo Pedido"
          component={NovaRequisicao}
          options={{
            headerRight: () => (
              <ShowIf
                condition={
                  !!clienteOnContext?.NomeFantasia ||
                  ProdutosSelecionados.length > 0
                }>
                <TouchableOpacity
                  onPress={() => setIsModalActive(!isModalActive)}
                  style={{paddingHorizontal: 10}}>
                  <Icon
                    name="ellipsis-vertical-sharp"
                    size={24}
                    color={colors.white}
                    onPress={() => setIsModalActive(!isModalActive)}
                    style={{marginRight: 16}}
                  />
                </TouchableOpacity>
              </ShowIf>
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
            headerShown: false,
          })}
        />

        <Drawer.Screen
          name="Produtos"
          component={ListaProdutosResumo}
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
              <Icon name="person-outline" color={color} style={{padding: 10}} size={size} />
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
            drawerStyle: {marginBottom: 20}, // Adiciona margem inferior
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
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    backgroundColor: colors.arcGreen, // Cor de fundo azul
    padding: 16,
    minHeight: '14%',
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
    padding: 10,
    marginRight: 16, // Espaçamento entre o ícone e a borda direita
  },
});
