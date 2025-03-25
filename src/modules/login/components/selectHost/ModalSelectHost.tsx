import {
  Modal,
  TouchableOpacity,
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {styles} from './styles';
import {colors} from '../../../styles';
import UseSetup from './hooks/useSetup';
import UseSaveSettingsOnStorage from './hooks/useSaveSettingsOnStorage';
import ApiInstace from '../../../../api/ApiInstace';
import {useEffect, useState} from 'react';
import {useSaveSettings} from './hooks';

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


  const {saveOrUpdateSetting, getConnections, getById, connections} =
    UseSaveSettingsOnStorage({});

  const {codStore, host, terminal, setCodLoja, setHost, setTerminal} = UseSetup(
    {getById, id},
  );

  const handleCleanModal = () => {
    setCodLoja('')
    setHost('')
    setTerminal('')
    setIsDisabled(true)
    closeModal()
  }

  const {handleSave} = useSaveSettings({
    closeModal: handleCleanModal,
  });

  const [isDisabled, setIsDisabled] = useState(true);

  const saveOrEdit = async () => {
    const newId = id ? id : Date.now()
    const isEdditing = id ? true : false
    await saveOrUpdateSetting({codStore, host, terminal, id: newId, isEdditing});
    if (!id) {
      handleSave({codStore, host, terminal, id: newId});
      return;
    }
    handleSave({codStore, host, id, terminal});
  };

  const testarConexao = async () => {
    if (!host || !terminal || !codStore) {
      Alert.alert('Campos obrigatorios', 'Por favor, preencha todos os campos');
      return;
    }
    const result = await ApiInstace.openLocalUrl(host);

    if (!result) {
      Alert.alert('Falha', 'Não foi possivel conectar com o servidor');
      setIsDisabled(true);
      return;
    }

    setIsDisabled(false);
  };

  useEffect(() => {
    getConnections();
  }, [isActive]);
  

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isActive}
      onRequestClose={() => handleCleanModal()}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <TouchableOpacity
          onPress={() => handleCleanModal()}
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
              onPress={() => testarConexao()}>
              <Text style={styles.buttonLabel}>Testar Conexão</Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={isDisabled}
              style={[
                styles.buttonContainer,
                {
                  backgroundColor: isDisabled
                    ? colors.graySearch
                    : colors.arcGreen,
                },
              ]}
              onPress={() => saveOrEdit()}>
              <Text style={styles.buttonLabel}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
}
