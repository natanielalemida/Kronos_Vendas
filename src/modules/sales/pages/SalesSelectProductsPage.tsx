import {useNavigation} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {useLayoutEffect} from 'react';
import {ActivityIndicator, FlatList, Text, View} from 'react-native';

import Search from '@/modules/components/search';
import {ProductCard} from '@/modules/products/components/ProductCard';
import {colors} from '@/modules/styles';

import {SalesNavigatorHeaderButton} from '../components/SalesNavigatorHeaderButton';
import {SalesProductEditorModal} from '../components/SalesProductEditorModal';
import {useSetupSalesProductsSelectionPage} from '../hooks/useSetupSalesProductsSelectionPage';
import {salesSelectionPageStyles} from '../styles/salesSelectionPage.styles';
import {SalesPageNavigation} from '../types/sales-navigation.types';
import {ProductListItem} from '@/modules/products/types/product.types';

export function SalesSelectProductsPage() {
  const navigation = useNavigation() as SalesPageNavigation & {
    setOptions: (options: {
      headerShown?: boolean;
      headerRight?: (() => React.JSX.Element | null) | undefined;
    }) => void;
  };
  const {data, handlers, viewState} = useSetupSalesProductsSelectionPage();
  const keyExtractor = useCallback((item: ProductListItem) => {
    return item.Codigo.toString();
  }, []);
  const renderItem = useCallback(
    ({item}: {item: ProductListItem}) => (
      <ProductCard item={item} onPress={handlers.handleOpenEditor} />
    ),
    [handlers.handleOpenEditor],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: !viewState.shouldShowEditor,
      headerRight: viewState.shouldShowEditor
        ? undefined
        : () => (
            <SalesNavigatorHeaderButton
              iconName="checkmark-sharp"
              onPress={() => navigation.navigate('Menu')}
              confirm
            />
          ),
    });
  }, [navigation, viewState.shouldShowEditor]);

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
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={salesSelectionPageStyles.listContent}
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
            initialNumToRender={8}
            maxToRenderPerBatch={8}
            updateCellsBatchingPeriod={50}
            windowSize={7}
            removeClippedSubviews
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
