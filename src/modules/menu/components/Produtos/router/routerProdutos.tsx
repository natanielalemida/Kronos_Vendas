import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {colors} from '../../../../styles';
import {StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {useCliente} from '../../Clientes/context/clientContext';
import Produto from '..';
import ProdutoCatalogo from '../catalogo';

const Stack = createNativeStackNavigator();

export default function ListaProdutosResumo() {
  const navigation = useNavigation();
  const {setClienteOnContext} = useCliente();

  return (
    <Stack.Navigator>
      {/* <Stack.Screen
        name="SelectClientes"
        component={SelectClientes}
        options={{
          title: 'Clientes',
          headerStyle: {
            backgroundColor: colors.arcGreen,
          },
          headerTintColor: '#fff',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.headerButton}>
              <Icon name="arrow-back-outline" size={24} color={colors.white} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('RouterCliente', {
                  setClienteOnContextActive: true,
                })
              }
              style={styles.headerButton}>
              <Icon name="add-outline" size={24} color={colors.white} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="SelectProdutos"
        component={SelectProdutos}
        options={{
          title: 'Produtos',
          headerStyle: {
            backgroundColor: colors.arcGreen,
          },
          headerTintColor: '#fff',
          headerRight: () => (
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => navigation.navigate('Menu')}>
              <Icon name="checkmark-sharp" size={24} color={colors.white} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="EditarProdutos"
        component={EditarProdutoNaLista}
        options={{
          title: 'Confirmar itens',
          headerStyle: {
            backgroundColor: colors.arcGreen,
          },
          headerTintColor: '#fff',
          headerRight: () => (
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() =>
                navigation.navigate('ListClientes', {
                  screen: 'FormaPagamento',
                })
              }>
              <Icon name="checkmark-sharp" size={24} color={colors.white} />
            </TouchableOpacity>
          ),
        }}
      /> */}
      <Stack.Screen
        name="ListaProdutosInit"
        component={Produto}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    marginRight: 16, // Espaçamento entre o ícone e a borda direita
  },
});
