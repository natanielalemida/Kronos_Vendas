import {Modal, TouchableOpacity, View, Text, TextInput} from 'react-native';
import {useState} from 'react';
import {styles} from './styles';
import {useSaveSettings, UseSettingsRepository} from './hooks';

type ModalSelectType = {
  isActive: boolean;
  closeModal: () => void;
};

export default function ModalSelectHost({
  isActive,
  closeModal,
}: ModalSelectType) {
  const {host, codStore, terminal, id, setHost, setCodStore, setTerminal} =
    UseSettingsRepository({isActive});

  const {handleSave} = useSaveSettings({
    host,
    codStore,
    terminal,
    id,
    closeModal,
  });

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isActive}
      onRequestClose={() => closeModal()}>
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
              onChangeText={(value: string) => setCodStore(value)}
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
          <TouchableOpacity style={styles.buttonContainer} onPress={handleSave}>
            <Text style={styles.buttonLabel}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
