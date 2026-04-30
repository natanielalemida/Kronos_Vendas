import React, {useCallback} from 'react';
import {ActivityIndicator, FlatList, Text, View} from 'react-native';

import Search from '@/modules/components/search';
import {colors} from '@/modules/styles';

import {ProductCard} from '../components/ProductCard';
import {useSetupProductsPage} from '../hooks/useSetupProductsPage';
import {styles} from '../styles/productsPage.styles';
import {ProductListItem} from '../types/product.types';

export default function ProductsPage() {
  const {data, handlers, viewState} = useSetupProductsPage();
  const keyExtractor = useCallback((item: ProductListItem) => {
    return item.Codigo.toString();
  }, []);
  const renderItem = useCallback(
    ({item}: {item: ProductListItem}) => (
      <ProductCard item={item} onPress={handlers.handleOpenProductDetails} />
    ),
    [handlers.handleOpenProductDetails],
  );

  if (viewState.shouldShowInitialLoader) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Carregando produtos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchWrapper}>
        <Search
          placeholder="Pesquisar produtos..."
          value={data.searchText}
          onChangeText={handlers.handleSearchTextChange}
        />
      </View>

      {viewState.shouldShowOverlayLoader ? (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : null}

      <FlatList
        data={data.products}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={[
          styles.listContent,
          viewState.shouldShowOverlayLoader ? styles.loadingOpacity : null,
        ]}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        updateCellsBatchingPeriod={50}
        windowSize={7}
        removeClippedSubviews
        ListEmptyComponent={
          viewState.shouldShowEmptyState ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhum produto encontrado</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}
