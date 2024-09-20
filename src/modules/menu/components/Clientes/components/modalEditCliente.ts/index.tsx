import {StyleSheet} from 'react-native';
import {Modal, Text, TouchableOpacity, View} from 'react-native';
import {ModalType} from './type';
import UseEditUser from './hooks/useEditUser';
import {useCliente} from '../../context/clientContext';
import {ShowIf} from '../../../../../components/showIf';

export default function ModalEditCliente({
  cliente,
  isActive,
  setActive,
}: ModalType) {
  const {form, setForm} = useCliente();

  const {handleRemove, handleEditUser} = UseEditUser({setActive, setForm});

  return (
    <Modal
      animationType="slide"
      transparent={true}
      statusBarTranslucent
      visible={isActive}
      onRequestClose={() => {
        setActive(!isActive);
      }}>
      <TouchableOpacity
        style={styles.modalBackground}
        onPress={() => setActive(!isActive)}>
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
            <ShowIf condition={cliente.isSincronizado === 0}>
              <View style={{width: '100%'}}>
                <TouchableOpacity
                  style={{padding: 10, width: '100%'}}
                  onPress={() => handleEditUser(cliente)}>
                  <Text style={styles.modalTitle}>Alterar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{padding: 10, width: '100%'}}
                  onPress={() => handleRemove(cliente)}>
                  <Text style={styles.modalTitle}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </ShowIf>
            <ShowIf condition={cliente.isSincronizado === 1}>
              <View style={{width: '100%'}}>
                <TouchableOpacity
                  style={{padding: 10, width: '100%'}}
                  onPress={() => handleEditUser(cliente)}>
                  <Text style={styles.modalTitle}>Visualizar</Text>
                </TouchableOpacity>
              </View>
            </ShowIf>
            <TouchableOpacity
              style={{
                alignSelf: 'flex-end',
              }}
              onPress={() => setActive(!isActive)}>
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
