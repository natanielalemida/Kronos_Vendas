import {
  Modal,
  TouchableOpacity,
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {styles} from './styles';
import { colors } from '../../../styles';
import UseSetup from './hooks/useSetup';
import UseSaveSettingsOnStorage from './hooks/useSaveSettingsOnStorage';

type ModalSelectType = {
  isActive: boolean;
  id?: number;
  closeModal: () => void;
};

export default function ModalSelectHost({
  isActive,
  id,
  closeModal,
}: ModalSelectType) {

  const { saveOrUpdateSetting, getById } = UseSaveSettingsOnStorage({});

  const {codStore, host, terminal, setCodLoja, setHost, setTerminal} = UseSetup({getById, id})


  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isActive}
      onRequestClose={() => closeModal()}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
        <TouchableOpacity
          onPress={() => closeModal()}
          style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <View style={styles.title}>
              <Text style={styles.modalTitle}>Configuraçôes de conexão</Text>
            </View>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>Host:</Text>
              <TextInput
                value={host}
                onChangeText={(value: string) => setHost(value)}
                style={styles.inputHost}
              />
            </View>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>Cod. Loja:</Text>
              <TextInput
                value={codStore}
                onChangeText={(value: string) => setCodLoja(value)}
                keyboardType="numeric"
                style={styles.inputStore}
              />
            </View>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>Terminal:</Text>
              <TextInput
                value={terminal}
                onChangeText={(value: string) => setTerminal(value)}
                keyboardType="numeric"
                style={styles.inputTerminal}
              />
            </View>
            <TouchableOpacity
              style={[styles.buttonContainer, {backgroundColor: colors.yellow}]}
              onPress={() => saveOrUpdateSetting({codStore, host, terminal, id})}>
              <Text style={styles.buttonLabel}>Testar Conexão</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => saveOrUpdateSetting({codStore, host, terminal, id}, closeModal)}>
              <Text style={styles.buttonLabel}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
}
