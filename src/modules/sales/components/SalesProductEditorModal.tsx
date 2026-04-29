import {Ionicons} from '@expo/vector-icons';
import React from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {colors} from '@/modules/styles';

import {useSetupSalesProductEditorModal} from '../hooks/useSetupSalesProductEditorModal';
import {salesProductEditorModalStyles} from '../styles/salesProductEditorModal.styles';
import {
  SalesProductEditorModalProps,
  SalesProductStockDetails,
} from '../types/sales-selection.types';

export function SalesProductEditorModal(props: SalesProductEditorModalProps) {
  const {data, handlers, viewState} = useSetupSalesProductEditorModal(props);
  const productWithStock = props.product as SalesProductStockDetails | undefined;

  return (
    <Modal
      animationType="slide"
      transparent
      statusBarTranslucent
      visible={viewState.shouldShowModal}
      onRequestClose={props.onClose}>
      <View style={salesProductEditorModalStyles.modalBackdrop}>
        <KeyboardAvoidingView
          behavior="padding"
          style={salesProductEditorModalStyles.modalCard}>
          <Text style={salesProductEditorModalStyles.modalTitle}>
            {props.product?.Descricao}
          </Text>

          {viewState.canToggleWholesale ? (
            <View style={salesProductEditorModalStyles.rowBetween}>
              <Text style={salesProductEditorModalStyles.sectionLabel}>
                Valor atacado
              </Text>
              <Switch
                value={viewState.isWholesaleActive}
                onValueChange={handlers.setWholesaleActive}
              />
            </View>
          ) : null}

          <View style={salesProductEditorModalStyles.infoGrid}>
            <View style={salesProductEditorModalStyles.infoCard}>
              <Text style={salesProductEditorModalStyles.infoLabel}>Estoque</Text>
              <Text style={salesProductEditorModalStyles.infoValue}>
                {productWithStock?.Estoque ?? '-'}
              </Text>
            </View>
            <View style={salesProductEditorModalStyles.infoCard}>
              <Text style={salesProductEditorModalStyles.infoLabel}>
                Valor base
              </Text>
              <Text style={salesProductEditorModalStyles.infoValue}>
                {data.basePriceLabel}
              </Text>
            </View>
          </View>

          <View style={salesProductEditorModalStyles.formSection}>
            <Text style={salesProductEditorModalStyles.fieldLabel}>
              Valor da venda
            </Text>
            <TextInput
              keyboardType="decimal-pad"
              style={salesProductEditorModalStyles.fieldInput}
              value={data.unitPriceInput}
              onChangeText={handlers.setUnitPriceInput}
              onEndEditing={handlers.handleSyncUnitPrice}
            />
          </View>

          <View style={salesProductEditorModalStyles.formSection}>
            <Text style={salesProductEditorModalStyles.fieldLabel}>
              Desconto (%)
            </Text>
            <TextInput
              keyboardType="decimal-pad"
              style={salesProductEditorModalStyles.fieldInput}
              value={data.discountInput}
              onChangeText={handlers.setDiscountInput}
              onEndEditing={handlers.handleSyncDiscount}
            />
          </View>

          <View style={salesProductEditorModalStyles.formSection}>
            <Text style={salesProductEditorModalStyles.fieldLabel}>Quantidade</Text>
            <View style={salesProductEditorModalStyles.quantityRow}>
              <TouchableOpacity onPress={handlers.handleDecreaseQuantity}>
                <Ionicons
                  name="remove-circle-sharp"
                  size={30}
                  color={colors.cancelButton}
                />
              </TouchableOpacity>
              <TextInput
                value={data.quantityInput}
                onChangeText={handlers.handleQuantityInputChange}
                keyboardType="decimal-pad"
                style={salesProductEditorModalStyles.quantityInput}
              />
              <TouchableOpacity onPress={handlers.handleIncreaseQuantity}>
                <Ionicons
                  name="add-circle-sharp"
                  size={30}
                  color={colors.arcGreen}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={salesProductEditorModalStyles.formSection}>
            <Text style={salesProductEditorModalStyles.fieldLabel}>Observação</Text>
            <TextInput
              value={data.note}
              onChangeText={handlers.setNote}
              multiline
              style={[
                salesProductEditorModalStyles.fieldInput,
                salesProductEditorModalStyles.noteInput,
              ]}
            />
          </View>

          <View style={salesProductEditorModalStyles.totalRow}>
            <Text style={salesProductEditorModalStyles.totalLabel}>Total</Text>
            <Text style={salesProductEditorModalStyles.totalValue}>
              {data.totalPriceLabel}
            </Text>
          </View>

          <View style={salesProductEditorModalStyles.actionsRow}>
            {viewState.canDelete ? (
              <TouchableOpacity
                onPress={handlers.handleDelete}
                style={salesProductEditorModalStyles.deleteButton}>
                <Ionicons name="trash-outline" size={22} color={colors.white} />
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity
              onPress={props.onClose}
              style={salesProductEditorModalStyles.cancelButton}>
              <Ionicons name="close-circle-sharp" size={24} color={colors.white} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handlers.handleConfirm}
              style={salesProductEditorModalStyles.confirmButton}>
              <Ionicons
                name="checkmark-circle-sharp"
                size={24}
                color={colors.white}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
