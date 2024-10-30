import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import {TouchableOpacity, View, StyleSheet} from 'react-native';
import CriarOuEditarUsuario from '../components/criarOuEditarUsuario';
import Endereco from '../components/criarOuEditarUsuario/endereco';
import Resumo from '../components/criarOuEditarUsuario/resumo';
import {colors} from '../../../../styles';
import UseSaveOrEdit from '../components/criarOuEditarUsuario/hooks/useSaveOrEdit';
import {useCliente} from '../context/clientContext';
import {useRoute} from '@react-navigation/native';
import Pedidos from '../../Pedidos/pedidos';
import PedidosCliente from '../../Pedidos/pedidosCliente';

const Tab = createBottomTabNavigator();

const HeaderLeft = React.memo(({onPress}) => (
  <TouchableOpacity onPress={onPress}>
    <Ionicons
      name="chevron-back"
      size={25}
      color="#fff"
      style={styles.iconLeft}
    />
  </TouchableOpacity>
));

const HeaderRight = React.memo(({isSincronizado}) => {
  if (!isSincronizado || isSincronizado === 0) {
    return (
      <View style={styles.headerRightContainer}>
        <TouchableOpacity>
          <Ionicons name="checkmark-outline" size={25} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  }

  return null;
});

const ScreenOptions = ({route, form}) => ({
  tabBarIcon: ({color, size}) => {
    const icons = {
      CriarOuEditarUsuario: 'person-outline',
      Endereco: 'location-outline',
      Resumo: 'clipboard-outline',
    };
    return <Ionicons name={icons[route.name]} size={size} color={color} />;
  },
  tabBarActiveTintColor: '#fff',
  tabBarInactiveTintColor: 'gray',
  tabBarStyle: {backgroundColor: colors.arcGreen},
  tabBarButton: props =>
    form.isSincronizado === 1 && route.name !== 'Resumo' ? null : (
      <TouchableOpacity {...props} />
    ),
});

export default function RouterCliente() {
  const {handleClearForm} = UseSaveOrEdit();
  const {form} = useCliente();
  const route = useRoute();
  const {params} = route;
  const {setClienteOnContextActive} = params || {};

  return (
    <Tab.Navigator
      initialRouteName={form.id ? 'Resumo' : 'CriarOuEditarUsuario'}
      screenOptions={props => ScreenOptions({...props, form})}>
      {!form.isSincronizado && (
        <>
          <Tab.Screen
            name="CriarOuEditarUsuario"
            component={CriarOuEditarUsuario}
            options={{
              title: 'Cliente',
              headerStyle: {backgroundColor: colors.arcGreen},
              headerTintColor: '#fff',
              headerLeft: () => <HeaderLeft onPress={handleClearForm} />,
            }}
          />
          <Tab.Screen
            name="Endereco"
            component={Endereco}
            options={{
              title: 'Endereço',
              headerStyle: {backgroundColor: colors.arcGreen},
              headerTintColor: '#fff',
              headerLeft: () => <HeaderLeft onPress={handleClearForm} />,
            }}
          />
        </>
      )}
      <Tab.Screen
        name="Resumo"
        component={Resumo}
        options={{
          headerShown: false,
          tabBarLabel: 'Resumo',
          tabBarIcon: ({color, size}) => (
            <Ionicons name="clipboard-outline" size={size} color={color} />
          ),
        }}
        initialParams={{setClienteOnContextActive}}
      />

      {!!form.id && (
        <Tab.Screen
          name="Histórico"
          component={PedidosCliente}
          options={{
            headerShown: false,
            tabBarLabel: 'Histórico',
            tabBarIcon: ({color, size}) => (
              <FontAwesome name="history" size={size} color={color} />
            ),
          }}
          initialParams={{clienteId: form.id}}
        />
      )}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconLeft: {
    marginLeft: 10,
  },
  iconRight: {
    marginRight: 15,
  },
  headerRightContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
  },
});
