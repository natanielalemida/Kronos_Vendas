import React from 'react';
import {Modal, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {useAppSession} from '@/shared/hooks/useAppSession';

import {menuSalesDraftActionsModalStyles as styles} from '../styles/menuSalesDraftActionsModal.styles';
import {
  MenuSalesDraftActionsModalProps,
  MenuSalesDraftNavigation,
} from '../types/menu-router.types';

export function MenuSalesDraftActionsModal({
  isActive,
  setIsActive,
}: MenuSalesDraftActionsModalProps): React.JSX.Element {
  const {cleanPedido} = useAppSession();
  const navigation = useNavigation() as MenuSalesDraftNavigation;

  const handleClose = () => {
    setIsActive(false);
  };

  const handleCancelCurrentOrder = () => {
    cleanPedido();
    handleClose();
  };

  const handleChangeCustomer = () => {
    handleClose();
    navigation.navigate('ListClientes', {
      screen: 'SelectClientes',
    });
  };

  return (
    <Modal
      animationType="slide"
      transparent
      statusBarTranslucent
      visible={isActive}
      onRequestClose={handleClose}>
      <TouchableOpacity style={styles.overlay} onPress={handleClose}>
        <View style={styles.content}>
          <TouchableOpacity
            onPress={handleChangeCustomer}
            style={styles.actionButton}>
            <Text style={styles.actionLabel}>Trocar cliente</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleCancelCurrentOrder}
            style={styles.actionButton}>
            <Text style={styles.actionLabel}>Cancelar Pedido Atual</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
