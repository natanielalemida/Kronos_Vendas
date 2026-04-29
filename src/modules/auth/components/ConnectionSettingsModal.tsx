import React from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {useSetupConnectionSettingsModal} from '../hooks/useSetupConnectionSettingsModal';
import {ConnectionSettingsModalProps} from '../types/connection-settings.types';
import {styles} from '../styles/connectionSettingsModal.styles';

export function ConnectionSettingsModal({
  connectionId,
  isVisible,
  onClose,
}: ConnectionSettingsModalProps): React.JSX.Element {
  const {actions, form, isSaveDisabled, reset, save, testConnection} =
    useSetupConnectionSettingsModal({
      connectionId,
      isVisible,
      onClose,
    });

  return (
    <Modal
      animationType="slide"
      transparent
      visible={isVisible}
      onRequestClose={reset}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}>
        <TouchableOpacity onPress={reset} style={styles.modalBackground}>
          <View
            style={styles.modalContent}
            onStartShouldSetResponder={() => true}>
            <View style={styles.title}>
              <Text style={styles.modalTitle}>Configuraçôes de conexão</Text>
            </View>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>Host:</Text>
              <TextInput
                value={form.host}
                onChangeText={actions.setHost}
                style={styles.inputHost}
              />
            </View>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>Cod. Loja:</Text>
              <TextInput
                value={form.codStore}
                onChangeText={actions.setCodStore}
                keyboardType="numeric"
                style={styles.inputStore}
              />
            </View>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>Terminal:</Text>
              <TextInput
                value={form.terminal}
                onChangeText={actions.setTerminal}
                keyboardType="numeric"
                style={styles.inputTerminal}
              />
            </View>
            <TouchableOpacity
              style={[styles.buttonContainer, styles.warningButton]}
              onPress={testConnection}>
              <Text style={styles.buttonLabel}>Testar Conexão</Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={isSaveDisabled}
              style={[
                styles.buttonContainer,
                isSaveDisabled ? styles.disabledButton : styles.primaryButton,
              ]}
              onPress={save}>
              <Text style={styles.buttonLabel}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
}
