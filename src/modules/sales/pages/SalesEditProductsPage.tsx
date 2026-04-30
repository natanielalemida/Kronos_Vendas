import React, {useCallback} from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';

import Search from '@/modules/components/search';

import {SalesProductEditorModal} from '../components/SalesProductEditorModal';
import {useSetupSalesEditProductsPage} from '../hooks/useSetupSalesEditProductsPage';
import {salesEditProductsPageStyles} from '../styles/salesEditProductsPage.styles';
import {SalesSelectedEditableProductItem} from '../types/sales-selection.types';

export function SalesEditProductsPage() {
  const {data, handlers, viewState} = useSetupSalesEditProductsPage();
  const {handleCloseEditor, handleOpenEditor, handleSearchTextChange} = handlers;
  const keyExtractor = useCallback((item: SalesSelectedEditableProductItem) => {
    return item.id;
  }, []);
  const renderItem = useCallback(
    ({item}: {item: SalesSelectedEditableProductItem}) => (
      <TouchableOpacity
        onPress={() => handleOpenEditor(item.code)}
        style={salesEditProductsPageStyles.itemCard}>
        <View style={salesEditProductsPageStyles.itemHeader}>
          <Text style={salesEditProductsPageStyles.itemCode}>{item.code}</Text>
          <Text style={salesEditProductsPageStyles.itemTitle}>
            {item.description}
          </Text>
          <Text style={salesEditProductsPageStyles.itemPrice}>
            {item.unitPriceLabel}
          </Text>
        </View>
        <View style={salesEditProductsPageStyles.itemFooter}>
          <Text style={salesEditProductsPageStyles.itemMeta}>
            Qtd. {item.quantityLabel}
          </Text>
          <Text style={salesEditProductsPageStyles.itemMeta}>
            Total: {item.totalPriceLabel}
          </Text>
        </View>
      </TouchableOpacity>
    ),
    [handleOpenEditor],
  );

  return (
    <View style={salesEditProductsPageStyles.container}>
      <Search
        placeholder="Pesquisar..."
        value={data.searchText}
        onChangeText={handleSearchTextChange}
      />

      <SalesProductEditorModal
        isEditing
        isVisible={viewState.shouldShowEditor}
        product={data.selectedProduct}
        onClose={handleCloseEditor}
      />

      {viewState.shouldShowEmptyState ? (
        <View style={salesEditProductsPageStyles.emptyState}>
          <Text style={salesEditProductsPageStyles.emptyText}>
            Nenhum item selecionado.
          </Text>
        </View>
      ) : (
        <FlatList
          data={data.products}
          keyboardShouldPersistTaps="always"
          keyExtractor={keyExtractor}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}
