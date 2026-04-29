import React from 'react';
import {ActivityIndicator, FlatList, Text, View} from 'react-native';

import Search from '@/modules/components/search';
import {ProductCard} from '@/modules/products/components/ProductCard';
import {colors} from '@/modules/styles';

import {SalesProductEditorModal} from '../components/SalesProductEditorModal';
import {useSetupSalesProductsSelectionPage} from '../hooks/useSetupSalesProductsSelectionPage';
import {salesSelectionPageStyles} from '../styles/salesSelectionPage.styles';

export function SalesSelectProductsPage() {
  const {data, handlers, viewState} = useSetupSalesProductsSelectionPage();

  return (
    <View style={salesSelectionPageStyles.container}>
      <View style={salesSelectionPageStyles.searchWrapper}>
        <Search
          placeholder="Pesquisar produtos..."
          value={data.searchText}
          onChangeText={handlers.handleSearchTextChange}
        />
      </View>

      <SalesProductEditorModal
        isVisible={viewState.shouldShowEditor}
        product={data.selectedProduct}
        onClose={handlers.handleCloseEditor}
      />

      {viewState.shouldShowInitialLoader ? (
        <View style={salesSelectionPageStyles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={salesSelectionPageStyles.loadingText}>
            Carregando produtos...
          </Text>
        </View>
      ) : (
        <>
          {viewState.shouldShowOverlayLoader ? (
            <View style={salesSelectionPageStyles.loadingOverlay}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : null}

          <FlatList
            data={data.products}
            renderItem={({item}) => (
              <ProductCard
                item={item}
                onPress={handlers.handleOpenEditor}
              />
            )}
            keyExtractor={item => item.Codigo.toString()}
            contentContainerStyle={salesSelectionPageStyles.listContent}
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              viewState.shouldShowEmptyState ? (
                <View style={salesSelectionPageStyles.emptyContainer}>
                  <Text style={salesSelectionPageStyles.emptyText}>
                    Nenhum produto encontrado
                  </Text>
                </View>
              ) : null
            }
          />
        </>
      )}
    </View>
  );
}
