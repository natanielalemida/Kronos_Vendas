import {Text, TouchableOpacity} from 'react-native';
import {View} from 'react-native';
import {Modal} from 'react-native';
import {useCliente} from '../../../Clientes/context/clientContext';
import {useNavigation} from '@react-navigation/native';

export default function ModalFilterMenu({isActive, setIsActive}) {
  const {cleanPedido, clearAllContext} = useCliente();
  const navigation = useNavigation();

  const cancelarPedidoAtual = () => {
    cleanPedido();
    setIsActive(!isActive);
  };

  const loggout = () => {
    clearAllContext();
    navigation.navigate('Login');
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
          <TouchableOpacity
            onPress={cancelarPedidoAtual}
            style={{paddingVertical: 10}}>
            <Text style={{color: 'white'}}>Cancelar Pedido Atual</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={loggout} style={{paddingVertical: 10}}>
            <Text style={{color: 'white'}}>Sair</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
