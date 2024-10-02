import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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

  const renderOption = (value: CondicaoPagamento) => (
    <TouchableOpacity
      key={value.Codigo}
      style={styles.optionButton}
      onPress={() => handleOnChangeText(value)}>
      <Text style={[styles.modalText, styles.textStyle]}>
        {value.QtdeParcelas >= 1
          ? `${value.Codigo} - Quantidade Parcelas: ${value.QtdeParcelas} - dias primeiro pagamento ${value.QtdeDiasParcelaInicial}/DIAS - segunda parcela em ${value.IntervaloDias}/DIAS`
          : `${value.Codigo} | ${value.IntervaloDias}/DIAS`}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isActive && data && data.length > 1}
      onRequestClose={() => {
        closeModal(!isActive);
      }}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{label}</Text>
          <ScrollView
            contentContainerStyle={styles.scrollContentContainer}
            style={styles.scrollView}>
            {data && data.length > 0 && data.map(value => renderOption(value))}
          </ScrollView>
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
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    width: '80%',
    maxWidth: 400,
    maxHeight: '70%', // Limite a altura para permitir rolagem
  },
  scrollView: {
    width: '100%',
    maxHeight: '100%', // Isso ajudará a garantir que o ScrollView tenha espaço para rolar
  },
  scrollContentContainer: {
    flexGrow: 1, // Garante que o conteúdo dentro do ScrollView ocupe o espaço necessário
  },
  modalTitle: {
    fontSize: 16,
    marginBottom: 16,
    color: 'black',
    fontWeight: 'bold',
  },
  optionButton: {
    alignItems: 'flex-start',
    width: '100%',
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalText: {
    marginBottom: 16,
    textAlign: 'left',
  },
});
