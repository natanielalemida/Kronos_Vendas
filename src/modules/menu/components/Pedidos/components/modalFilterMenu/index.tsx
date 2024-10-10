import {Text, TouchableOpacity} from 'react-native';
import {View} from 'react-native';
import {Modal} from 'react-native';
import {useCliente} from '../../../Clientes/context/clientContext';
import {useNavigation} from '@react-navigation/native';
import {ShowIf} from '../../../../../components/showIf';

export default function ModalFilterMenu({isActive, setIsActive}) {
  const {cleanPedido} = useCliente();
  const navigation = useNavigation();

  const cancelarPedidoAtual = () => {
    cleanPedido();
    setIsActive(false);
  };

  const trocarCliente = () => {
    setIsActive(false);
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
      onRequestClose={() => setIsActive(false)}>
      <TouchableOpacity
        style={{padding: 5, paddingTop: 40, flex: 1}}
        onPress={() => setIsActive(false)}>
        <View
          style={{
            padding: 15,
            backgroundColor: '#303030',
            alignSelf: 'flex-end',
          }}>
          <TouchableOpacity
            onPress={trocarCliente}
            style={{paddingVertical: 10}}>
            <Text style={{color: 'white'}}>Trocar cliente</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={cancelarPedidoAtual}
            style={{paddingVertical: 10}}>
            <Text style={{color: 'white'}}>Cancelar Pedido Atual</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
