import React from 'react';
import {Text, View} from 'react-native';

import {salesSelectionPageStyles} from '../styles/salesSelectionPage.styles';

export function SalesSummaryPage() {
  return (
    <View style={salesSelectionPageStyles.emptyContainer}>
      <Text style={salesSelectionPageStyles.emptyText}>Resumo</Text>
    </View>
  );
}
