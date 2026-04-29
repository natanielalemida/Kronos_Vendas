import {Ionicons} from '@expo/vector-icons';
import React from 'react';
import {Modal, Switch, Text, TouchableOpacity, View} from 'react-native';

import {colors} from '@/modules/styles';

import {
  getOrdersFilterModalTopStyle,
  ordersFilterModalStyles,
} from '../styles/ordersFilterModal.styles';
import {OrdersFilterModalProps} from '../types/orders-components.types';

export function OrdersFilterModal({
  onClose,
  options,
  position,
  setOptions,
  visible,
}: OrdersFilterModalProps): React.JSX.Element {
  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent
      onRequestClose={onClose}>
      <TouchableOpacity
        onPress={onClose}
        style={ordersFilterModalStyles.backdrop}>
        <View
          style={[
            ordersFilterModalStyles.modalContainer,
            ordersFilterModalStyles.modalPosition,
            getOrdersFilterModalTopStyle(position.y),
          ]}>
          <View style={ordersFilterModalStyles.optionRow}>
            <View style={ordersFilterModalStyles.optionContent}>
              <Ionicons
                name="cloud-upload-outline"
                size={25}
                color={colors.confirmButton}
                style={ordersFilterModalStyles.optionIcon}
              />
              <Text style={ordersFilterModalStyles.optionLabel}>
                Sincronizados
              </Text>
            </View>
            <Switch
              value={options.syncds}
              onValueChange={() =>
                setOptions(currentValue => ({
                  ...currentValue,
                  syncds: !currentValue.syncds,
                }))
              }
            />
          </View>
          <View style={ordersFilterModalStyles.optionRow}>
            <View style={ordersFilterModalStyles.optionContent}>
              <Ionicons
                name="cloud-offline-outline"
                size={25}
                color={colors.cancelButton}
                style={ordersFilterModalStyles.optionIcon}
              />
              <Text style={ordersFilterModalStyles.optionLabel}>
                Não sincronizados
              </Text>
            </View>
            <Switch
              value={options.notSyncd}
              onValueChange={() =>
                setOptions(currentValue => ({
                  ...currentValue,
                  notSyncd: !currentValue.notSyncd,
                }))
              }
            />
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
