import React from 'react';
import {FlatList, Text, View} from 'react-native';

import Search from '@/modules/components/search';
import {CustomerActionsModal} from '@/modules/customers/components/CustomerActionsModal';

import {CustomerListItem} from '../components/CustomerListItem';
import {useSetupCustomersPage} from '../hooks/useSetupCustomersPage';
import {styles} from '../styles/customersPage.styles';

export default function CustomersPage() {
  const {data, handlers, viewState} = useSetupCustomersPage();

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
            renderItem={({item, index}) => (
              <CustomerListItem
                customer={item}
                index={index}
                onPress={handlers.handleOpenCustomerActions}
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
