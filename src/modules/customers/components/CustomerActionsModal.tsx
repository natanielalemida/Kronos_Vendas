import React from 'react';
import {Modal, Text, TouchableOpacity, View} from 'react-native';

import {ShowIf} from '@/modules/components/showIf';

import {useCustomerEditActions} from '../hooks/useCustomerEditActions';
import {customerActionsModalStyles} from '../styles/customerActionsModal.styles';
import {CustomerActionsModalProps} from '../types/customer-edit.types';

export function CustomerActionsModal({
  customer,
  isVisible,
  onClose,
}: CustomerActionsModalProps) {
  const {handlers, viewState} = useCustomerEditActions({
    customer,
    onClose,
  });

  return (
    <Modal
      animationType="slide"
      transparent
      statusBarTranslucent
      visible={isVisible}
      onRequestClose={() => onClose(false)}>
      <TouchableOpacity
        style={customerActionsModalStyles.modalBackdrop}
        onPress={() => onClose(false)}>
        <View style={customerActionsModalStyles.modalCard}>
          <View style={customerActionsModalStyles.content}>
            <Text style={customerActionsModalStyles.title}>
              O que deseja fazer?
            </Text>

            <ShowIf condition={!viewState.isSyncedCustomer}>
              <View>
                <TouchableOpacity
                  style={customerActionsModalStyles.actionButton}
                  onPress={() => {
                    handlers.handleEditCustomer().catch(console.error);
                  }}>
                  <Text style={customerActionsModalStyles.actionLabel}>
                    Alterar
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={customerActionsModalStyles.actionButton}
                  onPress={handlers.handleDeleteCustomer}>
                  <Text style={customerActionsModalStyles.actionLabel}>
                    Excluir
                  </Text>
                </TouchableOpacity>
              </View>
            </ShowIf>

            <ShowIf condition={viewState.isSyncedCustomer}>
              <TouchableOpacity
                style={customerActionsModalStyles.actionButton}
                onPress={() => {
                  handlers.handleEditCustomer().catch(console.error);
                }}>
                <Text style={customerActionsModalStyles.actionLabel}>
                  Visualizar
                </Text>
              </TouchableOpacity>
            </ShowIf>

            <TouchableOpacity
              style={customerActionsModalStyles.cancelButton}
              onPress={() => onClose(false)}>
              <Text style={customerActionsModalStyles.cancelLabel}>
                CANCELAR
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
