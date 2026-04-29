import React from 'react';
import {Modal, Text, TouchableOpacity, View} from 'react-native';

import {OrganizationSelectModalProps} from '../types/organization-select.types';
import {styles} from '../styles/organizationSelect.styles';

export function OrganizationSelectModal({
  data,
  isVisible,
  onClose,
  onSelect,
}: OrganizationSelectModalProps): React.JSX.Element {
  return (
    <Modal
      animationType="slide"
      transparent
      visible={isVisible}
      onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalBackground} onPress={onClose}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Selecione uma organização</Text>
          {data.map(value => (
            <TouchableOpacity
              key={value.Codigo}
              style={styles.optionButton}
              onPress={() => onSelect(value)}>
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
