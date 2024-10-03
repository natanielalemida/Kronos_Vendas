import {Text, TouchableOpacity} from 'react-native';
import {View} from 'react-native';
import {Modal} from 'react-native';
import {useCliente} from '../../../Clientes/context/clientContext';
import {useNavigation} from '@react-navigation/native';
import {ShowIf} from '../../../../../components/showIf';

export default function ModalFilterMenu({isActive, setIsActive}) {
  const {cleanPedido, clearAllContext, clienteOnContext} = useCliente();
  const navigation = useNavigation();

  const cancelarPedidoAtual = () => {
    cleanPedido();
    setIsActive(!isActive);
  };

  const loggout = () => {
    clearAllContext();
    navigation.navigate('Login');
  };

  const trocarCliente = () => {
    //@ts-ignore
    navigation.navigate('ListClientes', {
      screen: 'SelectClientes',
    });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      statusBarTranslucent
      visible={isActive}
      onRequestClose={() => setIsActive(!isActive)}>
      <TouchableOpacity
        style={{padding: 5, paddingTop: 40, flex: 1}}
        onPress={() => setIsActive(!isActive)}>
        <View
          style={{
            padding: 15,
            backgroundColor: '#303030',
            alignSelf: 'flex-end',
          }}>
          <ShowIf condition={!!clienteOnContext}>
            <TouchableOpacity
              onPress={trocarCliente}
              style={{paddingVertical: 10}}>
              <Text style={{color: 'white'}}>Trocar cliente</Text>
            </TouchableOpacity>
          </ShowIf>

          <ShowIf condition={!!clienteOnContext}>
            <TouchableOpacity
              onPress={cancelarPedidoAtual}
              style={{paddingVertical: 10}}>
              <Text style={{color: 'white'}}>Cancelar Pedido Atual</Text>
            </TouchableOpacity>
          </ShowIf>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
