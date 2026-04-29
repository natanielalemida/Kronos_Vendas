import {FontAwesome5} from '@expo/vector-icons';
import {Text, View} from 'react-native';

import {colors} from '@/modules/styles';
import {ShowIf} from '@/modules/components/showIf';

import {newOrderPageStyles} from '../styles/newOrderPage.styles';
import {SalesCustomerSummaryCardProps} from '../types/sales-page.types';

export function SalesCustomerSummaryCard({
  customer,
  onOpenHistory,
}: SalesCustomerSummaryCardProps) {
  return (
    <View style={newOrderPageStyles.customerCard}>
      <View style={newOrderPageStyles.customerHeader}>
        <Text style={newOrderPageStyles.customerTitle}>Cliente</Text>
        <ShowIf condition={!!customer.id}>
          <FontAwesome5
            name="history"
            size={25}
            color={colors.black}
            onPress={onOpenHistory}
          />
        </ShowIf>
      </View>

      <View style={newOrderPageStyles.customerRow}>
        <Text style={newOrderPageStyles.customerLabel}>Nome:</Text>
        <Text style={newOrderPageStyles.customerValue}>{customer.name}</Text>
      </View>

      <View style={newOrderPageStyles.customerRow}>
        <Text style={newOrderPageStyles.customerLabel}>
          {customer.document ? 'Documento:' : 'CPF:'}
        </Text>
        <Text style={newOrderPageStyles.customerValue}>
          {customer.document}
        </Text>
      </View>

      {customer.addressLines.map(addressLine => (
        <View key={addressLine} style={newOrderPageStyles.customerRow}>
          <Text style={newOrderPageStyles.customerLabel}>Endereço:</Text>
          <Text style={newOrderPageStyles.addressValue}>{addressLine}</Text>
        </View>
      ))}
    </View>
  );
}
