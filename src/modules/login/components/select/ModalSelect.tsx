import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {getEmpresa} from '../../../../storage/empresaStorage';
import {useEffect} from 'react';

type ModalSelectProp = {
  data: {NomeFantasia: string; Codigo: number}[];
  isActive: boolean;
  closeModal: (isActive: boolean) => void;
  onTextChange: (value: {NomeFantasia: string; Codigo: number}) => void;
};

export default function ModalSelect({
  data,
  isActive,
  closeModal,
  onTextChange,
}: ModalSelectProp) {
  const handleOnChangeText = (value: {
    NomeFantasia: string;
    Codigo: number;
  }) => {
    onTextChange(value);
    closeModal(!isActive);
  };

  const defaultValue = async () => {
    const codStore = await getEmpresa();
    const index = data.find(
      organizacao => organizacao.Codigo === Number(codStore),
    );

    if (!index) {
      return;
    }

    onTextChange(index);
  };

  useEffect(() => {
    defaultValue();
  }, [data]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isActive}
      onRequestClose={() => {
        closeModal(!isActive);
      }}>
      <TouchableOpacity
        style={styles.modalBackground}
        onPress={() => closeModal(!isActive)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Selecione uma organização</Text>
          {data.map(value => (
            <TouchableOpacity
              key={value.Codigo}
              style={{alignItems: 'flex-start'}}
              onPress={() => handleOnChangeText(value)}>
              <Text style={[styles.modalText, styles.textStyle]}>
                {value.NomeFantasia}
              </Text>
            </TouchableOpacity>
          ))}
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
    borderRadius: 8,
    padding: 35,
    alignItems: 'flex-start',
    width: '80%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  textStyle: {
    color: 'black',
    textAlign: 'left',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 16,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 16,
    textAlign: 'left',
  },
});
