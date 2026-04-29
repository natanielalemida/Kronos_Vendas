import {Text, TouchableOpacity, View} from 'react-native';

import {ShowIf} from '@/modules/components/showIf';

import {getSelectedProductContainerStyle} from '../helpers/sales-page.helpers';
import {newOrderPageStyles} from '../styles/newOrderPage.styles';
import {SalesSelectedProductItemProps} from '../types/sales-page.types';

export function SalesSelectedProductItem({
  product,
}: SalesSelectedProductItemProps) {
  return (
    <TouchableOpacity
      style={[
        newOrderPageStyles.itemContainer,
        getSelectedProductContainerStyle(product.backgroundColor),
      ]}
      onPress={product.onPress}>
      <View style={newOrderPageStyles.itemTopRow}>
        <View style={newOrderPageStyles.itemLeft}>
          <Text style={newOrderPageStyles.itemCode}>{product.code}</Text>
          <Text style={newOrderPageStyles.itemDescription}>
            {product.description}
          </Text>
        </View>
        <Text style={newOrderPageStyles.itemPrice}>
          {product.unitPriceLabel}
        </Text>
      </View>

      <View style={newOrderPageStyles.itemBottomRow}>
        <View style={newOrderPageStyles.itemDetailsLeft}>
          <Text style={newOrderPageStyles.itemText}>
            Qtd. {product.quantity}
          </Text>
          <Text style={newOrderPageStyles.itemText}>X</Text>
          <Text style={newOrderPageStyles.itemText}>
            {product.unitPriceLabel}
          </Text>
        </View>
        <Text style={newOrderPageStyles.itemText}>
          Total: {product.totalPriceLabel}
        </Text>
      </View>

      <ShowIf condition={!!product.note}>
        <Text style={newOrderPageStyles.itemNote}>{product.note}</Text>
      </ShowIf>
    </TouchableOpacity>
  );
}
