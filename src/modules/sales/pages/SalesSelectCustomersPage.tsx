import React from 'react';
import {FlatList, Text, View} from 'react-native';

import Search from '@/modules/components/search';
import {CustomerListItem} from '@/modules/customers/components/CustomerListItem';
import {salesSelectionPageStyles} from '@/modules/sales/styles/salesSelectionPage.styles';

import {useSetupSalesCustomersSelectionPage} from '../hooks/useSetupSalesCustomersSelectionPage';

export function SalesSelectCustomersPage() {
  const {data, handlers, viewState} = useSetupSalesCustomersSelectionPage();

  return (
    <View style={salesSelectionPageStyles.container}>
      <Search
        placeholder="Pesquisar..."
        value={data.searchText}
        onChangeText={handlers.handleSearchTextChange}
      />

      <View style={salesSelectionPageStyles.content}>
        {viewState.shouldShowEmptyState ? (
          <Text style={salesSelectionPageStyles.emptyText}>
            Nenhum cliente encontrado.
          </Text>
        ) : (
          <FlatList
            data={data.customers}
            renderItem={({item, index}) => (
              <CustomerListItem
                customer={item}
                index={index}
                onPress={handlers.handleSelectCustomer}
              />
            )}
            keyboardShouldPersistTaps="always"
            keyExtractor={item => `${item.Codigo}`}
          />
        )}
      </View>
    </View>
  );
}
