import {ScrollView, StatusBar, Text, View} from 'react-native';

import {ShowIf} from '@/modules/components/showIf';
import {colors} from '@/modules/styles';

import {SalesActionButton} from '../components/SalesActionButton';
import {SalesCustomerSummaryCard} from '../components/SalesCustomerSummaryCard';
import {SalesSelectedProductItem} from '../components/SalesSelectedProductItem';
import {useSetupNewOrderPage} from '../hooks/useSetupNewOrderPage';
import {newOrderPageStyles} from '../styles/newOrderPage.styles';

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

  return (
    <View style={newOrderPageStyles.container}>
      <StatusBar backgroundColor={colors.arcGreen} barStyle="light-content" />

      <View style={newOrderPageStyles.content}>
        <SalesCustomerSummaryCard
          customer={customerSummary}
          onOpenHistory={handleOpenCustomerHistory}
        />

        <Text style={newOrderPageStyles.sectionTitle}>Itens</Text>

        <ScrollView>
          {selectedProducts.map(product => (
            <SalesSelectedProductItem key={product.id} product={product} />
          ))}
        </ScrollView>
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
