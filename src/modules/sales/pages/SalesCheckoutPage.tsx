import {Ionicons} from '@expo/vector-icons';
import React from 'react';
import {
  Button,
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {colors} from '@/modules/styles';

import {useSetupSalesCheckoutPage} from '../hooks/useSetupSalesCheckoutPage';
import {salesCheckoutPageStyles} from '../styles/salesCheckoutPage.styles';

export function SalesCheckoutPage() {
  const {data, handlers, modalState, viewState} = useSetupSalesCheckoutPage();

  return (
    <View style={salesCheckoutPageStyles.container}>
      <StatusBar backgroundColor={colors.arcGreen} barStyle="light-content" />

      <Modal
        animationType="slide"
        transparent
        statusBarTranslucent
        visible={viewState.isFinalizeModalVisible}
        onRequestClose={handlers.closeFinalizeModal}>
        <View style={salesCheckoutPageStyles.modalBackdrop}>
          <View style={salesCheckoutPageStyles.finalizeModal}>
            <Text style={salesCheckoutPageStyles.modalTitle}>Finalização da venda</Text>

            <View style={salesCheckoutPageStyles.summaryRow}>
              <Text style={salesCheckoutPageStyles.summaryLabel}>Valor bruto</Text>
              <Text style={salesCheckoutPageStyles.summaryValue}>
                {data.grossTotalLabel}
              </Text>
            </View>

            <View style={salesCheckoutPageStyles.formSection}>
              <Text style={salesCheckoutPageStyles.fieldLabel}>Desconto (%)</Text>
              <TextInput
                value={data.discountPercentInput}
                onChangeText={handlers.setDiscountPercentInput}
                onEndEditing={handlers.syncDiscountPercentInput}
                keyboardType="decimal-pad"
                style={salesCheckoutPageStyles.fieldInput}
              />
            </View>

            <View style={salesCheckoutPageStyles.formSection}>
              <Text style={salesCheckoutPageStyles.fieldLabel}>Valor total</Text>
              <TextInput
                value={data.netTotalInput}
                onChangeText={handlers.setNetTotalInput}
                onEndEditing={handlers.syncNetTotalInput}
                keyboardType="decimal-pad"
                style={salesCheckoutPageStyles.fieldInput}
              />
            </View>

            <View style={salesCheckoutPageStyles.formSection}>
              <Text style={salesCheckoutPageStyles.fieldLabel}>Observação</Text>
              <TextInput
                value={data.note}
                onChangeText={handlers.setNote}
                style={[
                  salesCheckoutPageStyles.fieldInput,
                  salesCheckoutPageStyles.textAreaInput,
                ]}
                multiline
              />
            </View>

            <View style={salesCheckoutPageStyles.modalActions}>
              <TouchableOpacity
                style={salesCheckoutPageStyles.modalActionButton}
                onPress={handlers.closeFinalizeModal}>
                <Ionicons name="close-circle-sharp" size={24} color={colors.white} />
                <Text style={salesCheckoutPageStyles.modalActionLabel}>
                  Cancelar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={salesCheckoutPageStyles.modalActionButton}
                onPress={handlers.confirmCheckoutDraft}>
                <Ionicons
                  name="checkmark-circle-sharp"
                  size={24}
                  color={colors.white}
                />
                <Text style={salesCheckoutPageStyles.modalActionLabel}>
                  Confirmar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={viewState.isPaymentModalVisible}
        animationType="slide"
        onRequestClose={handlers.closePaymentModal}>
        <View style={salesCheckoutPageStyles.paymentModalContainer}>
          <View style={salesCheckoutPageStyles.formSection}>
            <Text style={salesCheckoutPageStyles.fieldLabel}>Forma de pagamento</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {data.paymentMethods.map(paymentMethod => (
                <TouchableOpacity
                  key={paymentMethod.Codigo}
                  style={[
                    salesCheckoutPageStyles.selectorChip,
                    data.selectedPaymentMethod?.Codigo === paymentMethod.Codigo
                      ? salesCheckoutPageStyles.selectorChipActive
                      : undefined,
                  ]}
                  onPress={() => handlers.setSelectedPaymentMethod(paymentMethod)}>
                  <Text
                    style={[
                      salesCheckoutPageStyles.selectorChipLabel,
                      data.selectedPaymentMethod?.Codigo === paymentMethod.Codigo
                        ? salesCheckoutPageStyles.selectorChipLabelActive
                        : undefined,
                    ]}>
                    {paymentMethod.Descricao}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {viewState.shouldShowConditionSelector ? (
            <View style={salesCheckoutPageStyles.formSection}>
              <Text style={salesCheckoutPageStyles.fieldLabel}>
                Condição de pagamento
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {data.selectedPaymentMethod?.CondicaoPagamento.map(condition => (
                  <TouchableOpacity
                    key={condition.Codigo}
                    style={[
                      salesCheckoutPageStyles.selectorChip,
                      data.selectedPaymentCondition?.Codigo === condition.Codigo
                        ? salesCheckoutPageStyles.selectorChipActive
                        : undefined,
                    ]}
                    onPress={() => handlers.setSelectedPaymentCondition(condition)}>
                    <Text
                      style={[
                        salesCheckoutPageStyles.selectorChipLabel,
                        data.selectedPaymentCondition?.Codigo === condition.Codigo
                          ? salesCheckoutPageStyles.selectorChipLabelActive
                          : undefined,
                      ]}>
                      {`Condição ${condition.Codigo}`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          ) : null}

          <View style={salesCheckoutPageStyles.formSection}>
            <Text style={salesCheckoutPageStyles.fieldLabel}>Valor do pagamento</Text>
            <TextInput
              value={modalState.paymentAmountInput}
              onChangeText={handlers.setPaymentAmountInput}
              keyboardType="decimal-pad"
              style={salesCheckoutPageStyles.fieldInput}
            />
          </View>

          <View style={salesCheckoutPageStyles.summaryCard}>
            <Text style={salesCheckoutPageStyles.summaryLabel}>
              Restante: {data.remainingAmountLabel}
            </Text>
          </View>

          <View style={salesCheckoutPageStyles.modalActions}>
            <TouchableOpacity
              style={salesCheckoutPageStyles.modalActionButton}
              onPress={handlers.closePaymentModal}>
              <Ionicons name="close-circle-sharp" size={24} color={colors.white} />
              <Text style={salesCheckoutPageStyles.modalActionLabel}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={salesCheckoutPageStyles.modalActionButton}
              onPress={handlers.confirmPaymentMethod}>
              <Ionicons
                name="checkmark-circle-sharp"
                size={24}
                color={colors.white}
              />
              <Text style={salesCheckoutPageStyles.modalActionLabel}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={viewState.isDeleteModalVisible}
        transparent
        animationType="slide"
        onRequestClose={handlers.closeDeleteModal}>
        <View style={salesCheckoutPageStyles.modalBackdrop}>
          <View style={salesCheckoutPageStyles.deleteModal}>
            <Text style={salesCheckoutPageStyles.modalTitle}>
              Remover pagamento
            </Text>
            <Text style={salesCheckoutPageStyles.deleteModalText}>
              {modalState.paymentMethodPendingDeletion?.Descricao}
            </Text>
            <View style={salesCheckoutPageStyles.deleteModalActions}>
              <Button
                title="Excluir"
                color={colors.cancelButton}
                onPress={handlers.confirmDeletePaymentMethod}
              />
              <Button title="Cancelar" onPress={handlers.closeDeleteModal} />
            </View>
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={salesCheckoutPageStyles.content}>
        {viewState.shouldShowEmptyState ? (
          <View style={salesCheckoutPageStyles.emptyState}>
            <Text style={salesCheckoutPageStyles.emptyStateTitle}>
              Nenhum pagamento adicionado
            </Text>
            <Text style={salesCheckoutPageStyles.emptyStateText}>
              Adicione os meios de pagamento para concluir a venda.
            </Text>
          </View>
        ) : (
          data.selectedPaymentMethods.map(paymentMethod => (
            <TouchableOpacity
              key={paymentMethod.id}
              style={salesCheckoutPageStyles.paymentCard}
              onPress={paymentMethod.onPress}>
              <View style={salesCheckoutPageStyles.paymentCardHeader}>
                <Text style={salesCheckoutPageStyles.paymentCardCode}>
                  {paymentMethod.code}
                </Text>
                <Text style={salesCheckoutPageStyles.paymentCardTitle}>
                  {paymentMethod.description}
                </Text>
              </View>

              {paymentMethod.conditions.map(condition => (
                <View
                  key={condition.id}
                  style={salesCheckoutPageStyles.paymentConditionBlock}>
                  <Text style={salesCheckoutPageStyles.paymentConditionTitle}>
                    {condition.title}
                  </Text>
                  <Text style={salesCheckoutPageStyles.paymentConditionAmount}>
                    {condition.amountLabel}
                  </Text>
                  {condition.scheduleLines.map(scheduleLine => (
                    <Text
                      key={scheduleLine}
                      style={salesCheckoutPageStyles.paymentConditionLine}>
                      {scheduleLine}
                    </Text>
                  ))}
                </View>
              ))}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <View style={salesCheckoutPageStyles.footer}>
        <View style={salesCheckoutPageStyles.totalContainer}>
          <Text style={salesCheckoutPageStyles.totalLabel}>Total</Text>
          <Text style={salesCheckoutPageStyles.totalValue}>{data.totalAmountLabel}</Text>
        </View>
        <View style={salesCheckoutPageStyles.totalContainer}>
          <Text style={salesCheckoutPageStyles.totalLabel}>Pago</Text>
          <Text style={salesCheckoutPageStyles.totalValue}>{data.paidAmountLabel}</Text>
        </View>
        <View style={salesCheckoutPageStyles.actionsContainer}>
          {viewState.shouldAllowNewPayment ? (
            <TouchableOpacity
              style={salesCheckoutPageStyles.footerAction}
              onPress={handlers.openPaymentModal}>
              <Ionicons name="add-sharp" size={24} color={colors.white} />
              <Text style={salesCheckoutPageStyles.footerActionLabel}>Pagamento</Text>
            </TouchableOpacity>
          ) : null}

          {viewState.shouldAllowFinalize ? (
            <TouchableOpacity
              style={salesCheckoutPageStyles.footerAction}
              onPress={handlers.confirmFinalizeSale}>
              <Ionicons
                name="checkmark-circle-sharp"
                size={24}
                color={colors.white}
              />
              <Text style={salesCheckoutPageStyles.footerActionLabel}>Finalizar</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  );
}
