import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {CondicaoPagamento} from '../../../../../../../../../sync/pagamentos/type';
type ModalSelectProp = {
  data: CondicaoPagamento[] | undefined;
  label: string;
  isActive: boolean;
  closeModal: (isActive: boolean) => void;
  onTextChange: (value: CondicaoPagamento) => void;
};

export default function ModalSelectCondicao({
  data,
  label,
  isActive,
  closeModal,
  onTextChange,
}: ModalSelectProp) {
  const handleOnChangeText = (value: CondicaoPagamento) => {
    onTextChange(value);
    closeModal(!isActive);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isActive && data && data.length > 1}
      onRequestClose={() => {
        closeModal(!isActive);
      }}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{label}</Text>
          {data &&
            data.length > 0 &&
            data.map(value => (
              <TouchableOpacity
                key={value.Codigo}
                style={styles.optionButton}
                onPress={() => handleOnChangeText(value)}>
                <Text style={[styles.modalText, styles.textStyle]}>
                  {`${value.Codigo} | ${value.IntervaloDias}/DIAS`}
                </Text>
              </TouchableOpacity>
            ))}
        </View>
      </View>
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
    fontSize: 16,
    marginBottom: 16,
    color: 'black',
    fontWeight: 'bold',
  },
  modalText: {
    marginBottom: 16,
    textAlign: 'left',
  },
  optionButton: {
    alignItems: 'flex-start',
    width: '100%',
    flexDirection: 'row',
  },
});
