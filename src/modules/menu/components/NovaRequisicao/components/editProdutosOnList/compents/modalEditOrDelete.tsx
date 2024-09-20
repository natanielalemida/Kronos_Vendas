import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ModalEditOrDeleteProps} from './type';
import {useCliente} from '../../../../Clientes/context/clientContext';
export default function ModalDeleteOrEdit({
  isModalActive,
  produto,
  setModalActive,
  setIsEditing,
}: ModalEditOrDeleteProps) {
  const {ProdutosSelecionados, setProdutosSelecionados} = useCliente();

  const handleRemoveProduto = () => {
    const newArray = ProdutosSelecionados.filter(
      produtoSelecionado => produtoSelecionado.Codigo !== produto?.Codigo,
    );
    setProdutosSelecionados(newArray);
    setModalActive(false);
  };

  const handleRemove = () => {
    Alert.alert(
      'Deletar item',
      'Após deletadar, o item será perdido, deseja continuar?',
      [
        {
          text: 'Cancelar',
          onPress: () => {},
          style: 'cancel',
        },
        {text: 'OK', onPress: () => handleRemoveProduto()},
      ],
    );
  };

  const handleEdit = () => {
    // Feche o modal ativo primeiro
    setModalActive(false);

    setTimeout(() => {
      setIsEditing(true);
    }, 200);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      statusBarTranslucent
      visible={isModalActive}
      onRequestClose={() => {
        setModalActive(false);
      }}>
      <TouchableOpacity
        style={styles.modalBackground}
        onPress={() => setModalActive(false)}>
        <View style={styles.modalContent}>
          <View
            style={{
              width: '100%',
              padding: 10,
            }}>
            <Text
              style={{
                fontSize: 18,
                paddingHorizontal: 25,
                padding: 10,
                color: 'black',
                width: '100%',
              }}>
              O que deseja fazer?
            </Text>
            <View style={{width: '100%'}}>
              <TouchableOpacity
                style={{padding: 10, width: '100%'}}
                onPress={() => handleEdit()}>
                <Text style={styles.modalTitle}>Alterar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{padding: 10, width: '100%'}}
                onPress={handleRemove}>
                <Text style={styles.modalTitle}>Excluir</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={{
                alignSelf: 'flex-end',
              }}
              onPress={() => setModalActive(false)}>
              <Text
                style={{
                  fontSize: 16,
                  color: 'red',
                  width: '100%',
                  fontWeight: '500',
                  paddingHorizontal: 10,
                }}>
                CANCELAR
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    paddingBottom: 15,
    borderRadius: 8,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 16,
    width: '100%',
    padding: 5,
    marginHorizontal: 10,
    color: 'black',
  },
});
