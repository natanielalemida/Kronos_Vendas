import React, {useCallback} from 'react';
import {FlatList, Text, View} from 'react-native';

import Search from '@/modules/components/search';
import {CustomerActionsModal} from '@/modules/customers/components/CustomerActionsModal';

import {CustomerListItem} from '../components/CustomerListItem';
import {useSetupCustomersPage} from '../hooks/useSetupCustomersPage';
import {styles} from '../styles/customersPage.styles';
import {CustomerListItem as CustomerListItemData} from '../types/customer-list.types';

export default function CustomersPage() {
  const {data, handlers, viewState} = useSetupCustomersPage();
  const keyExtractor = useCallback((item: CustomerListItemData) => {
    return `${item.Codigo}`;
  }, []);
  const renderItem = useCallback(
    ({
      item,
      index,
    }: {
      item: CustomerListItemData;
      index: number;
    }) => (
      <CustomerListItem
        customer={item}
        index={index}
        onPress={handlers.handleOpenCustomerActions}
      />
    ),
    [handlers.handleOpenCustomerActions],
  );

  return (
    <View style={styles.container}>
      <Search
        placeholder="Pesquisar..."
        value={data.searchText}
        onChangeText={handlers.handleSearchTextChange}
      />

      <CustomerActionsModal
        customer={data.selectedCustomer}
        isVisible={viewState.isModalVisible}
        onClose={handlers.handleModalVisibilityChange}
      />

      <View style={styles.content}>
        {viewState.shouldShowEmptyState ? (
          <Text style={styles.emptyStateText}>Nenhum cliente encontrado.</Text>
        ) : (
          <FlatList
            data={data.customers}
            renderItem={renderItem}
            keyboardShouldPersistTaps="always"
            keyExtractor={keyExtractor}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={50}
            windowSize={7}
            removeClippedSubviews
          />
        )}
      </View>
    </View>
  );
}
