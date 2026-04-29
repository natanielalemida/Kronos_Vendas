import {Ionicons} from '@expo/vector-icons';
import React from 'react';
import {Modal, Switch, Text, TouchableOpacity, View} from 'react-native';

import {useSetupLocalParametersModal} from '../hooks/useSetupLocalParametersModal';
import {styles} from '../styles/localParametersModal.styles';
import {LocalParametersModalProps} from '../types/local-parameters.types';

export function LocalParametersModal({
  isVisible,
  onClose,
}: LocalParametersModalProps): React.JSX.Element {
  const {biometricsEnabled, handlers} = useSetupLocalParametersModal();

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <TouchableOpacity style={styles.modalBackground} onPress={onClose}>
        <View style={styles.modalContent}>
          <View style={styles.title}>
            <Text style={styles.modalTitle}>Parâmetros Locais</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={25} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.labelContainer}>
            <Text style={styles.label}>Usar Biometria para login</Text>
            <Switch
              value={biometricsEnabled}
              onValueChange={value => {
                handlers.setBiometricsEnabled(value).catch(console.error);
              }}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
