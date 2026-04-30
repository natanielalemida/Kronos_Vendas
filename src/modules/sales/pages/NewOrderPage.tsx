import React, {useCallback} from 'react';
import {FlatList, StatusBar, Text, View} from 'react-native';

import {ShowIf} from '@/modules/components/showIf';
import {colors} from '@/modules/styles';

import {SalesActionButton} from '../components/SalesActionButton';
import {SalesCustomerSummaryCard} from '../components/SalesCustomerSummaryCard';
import {SalesSelectedProductItem} from '../components/SalesSelectedProductItem';
import {useSetupNewOrderPage} from '../hooks/useSetupNewOrderPage';
import {newOrderPageStyles} from '../styles/newOrderPage.styles';
import {SalesProductListItem} from '../types/sales-page.types';

export function NewOrderPage() {
  const {
    customerSummary,
    hasSelectedCustomer,
    hasSelectedProducts,
    selectedProducts,
    totalPriceLabel,
    handleOpenCustomerHistory,
    handleOpenCustomers,
    handleOpenProducts,
    handleGoToCheckout,
  } = useSetupNewOrderPage();
  const keyExtractor = useCallback(
    (item: SalesProductListItem) => item.id,
    [],
  );
  const renderItem = useCallback(
    ({item}: {item: SalesProductListItem}) => (
      <SalesSelectedProductItem product={item} />
    ),
    [],
  );

  return (
    <View style={newOrderPageStyles.container}>
      <StatusBar
        backgroundColor={colors.headerPrimary}
        barStyle="light-content"
      />

      <View style={newOrderPageStyles.content}>
        <FlatList
          data={selectedProducts}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListHeaderComponent={
            <>
              <SalesCustomerSummaryCard
                customer={customerSummary}
                onOpenHistory={handleOpenCustomerHistory}
              />
              <Text style={newOrderPageStyles.sectionTitle}>Itens</Text>
            </>
          }
          contentContainerStyle={newOrderPageStyles.itemsListContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          initialNumToRender={6}
          maxToRenderPerBatch={6}
          updateCellsBatchingPeriod={50}
          windowSize={5}
          removeClippedSubviews
        />
      </View>

      <View style={newOrderPageStyles.footer}>
        <View
          style={[
            newOrderPageStyles.footerSide,
            newOrderPageStyles.footerSideLeft,
          ]}>
          <ShowIf condition={hasSelectedCustomer}>
            <SalesActionButton
              iconName="add-sharp"
              label="Produtos"
              onPress={handleOpenProducts}
            />
          </ShowIf>
          <ShowIf condition={!hasSelectedCustomer}>
            <SalesActionButton
              iconName="people-sharp"
              label="Clientes"
              onPress={handleOpenCustomers}
            />
          </ShowIf>
        </View>

        <View style={newOrderPageStyles.totalContainer}>
          <Text style={newOrderPageStyles.totalText}>Total</Text>
          <Text style={newOrderPageStyles.totalText}>{totalPriceLabel}</Text>
        </View>

        <View
          style={[
            newOrderPageStyles.footerSide,
            newOrderPageStyles.footerSideRight,
          ]}>
          <ShowIf condition={hasSelectedProducts}>
            <SalesActionButton
              iconName="checkmark-circle-sharp"
              label="Finalizar"
              onPress={handleGoToCheckout}
            />
          </ShowIf>
        </View>
      </View>
    </View>
  );
}
