import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {MunicipioSelectDto} from './type';
import {useState} from 'react';
import useFilter from '../../../hooks/useFilter';
import SearchMunicipio from './search';

type ModalSelectProp = {
  data: MunicipioSelectDto[] | undefined;
  label: string;
  isActive: boolean;
  closeModal: (isActive: boolean) => void;
  onTextChange: (value: MunicipioSelectDto) => void;
};

export default function ModalSelect({
  data,
  label,
  isActive,
  closeModal,
  onTextChange,
}: ModalSelectProp) {
  const [textFilter, setTextFilter] = useState<string>('');

  const handleOnChangeText = (value: MunicipioSelectDto) => {
    onTextChange(value);
    closeModal(!isActive);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isActive}
      onRequestClose={() => {
        closeModal(!isActive);
      }}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{label}</Text>
          {/* <SearchMunicipio
            placeholder="Pesquisar..."
            value={textFilter}
            onChangeText={setTextFilter}
          /> */}
          <ScrollView>
            {data &&
              data.length > 0 &&
              data.map(value => (
                <TouchableOpacity
                  key={value.Codigo}
                  style={{alignItems: 'flex-start', width: '100%'}}
                  onPress={() => handleOnChangeText(value)}>
                  <Text style={[styles.modalText, styles.textStyle]}>
                    {value.MunicipioNome}
                  </Text>
                </TouchableOpacity>
              ))}
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
});
