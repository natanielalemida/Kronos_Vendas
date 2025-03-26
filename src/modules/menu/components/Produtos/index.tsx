import React from 'react';
import pako from 'pako';
import base64 from 'base64-js';
import { StyleSheet, Text, TouchableOpacity, View, FlatList, Image, Dimensions, ActivityIndicator } from 'react-native';
import Search from '../../../components/search';
import { useEffect, useState, useRef, useCallback } from 'react';
import UseGetProdutos from './hooks/useGetProdutos';
import { ProdutoDto } from '../../../../sync/products/type';
import { colors } from '../../../styles';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

export default function Produto() {
  const navigation = useNavigation();
  const { handleGetProdutos, produtos, isLoading } = UseGetProdutos();
  const [textFilter, setTextFilter] = useState<string>('');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const windowWidth = Dimensions.get('window').width;

  // Definir número de colunas baseado na quantidade de produtos
  const numColumns = produtos.length === 1 ? 1 : 2;
  // Criar chave única para o FlatList baseada no número de colunas
  const flatListKey = `flatlist_${numColumns}_${produtos.length}`;

  const decodeGzipToBase64 = (gzipBase64: string) => {
    try {
      const compressedData = base64.toByteArray(gzipBase64);
      const decompressedData = pako.inflate(compressedData);
      const base64String = base64.fromByteArray(decompressedData);
      return `data:image/png;base64,${base64String}`;
    } catch (error) {
      console.error('Erro ao descompactar a imagem:', error);
      return null;
    }
  };

  useFocusEffect(
    useCallback(() => {
      setTextFilter('');
      return () => {};
    }, []),
  );

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      handleGetProdutos(textFilter);
    }, 500);

    return () => {};
  }, [textFilter]);

  const renderItem = ({ item, index }: { item: ProdutoDto; index: number }) => {
    const isSingleItem = numColumns === 1;
    
    return (
      <TouchableOpacity
      onPress={() => navigation.navigate('ResumoPedido', { id: item.Codigo })}
      style={[
        styles.card,
        isSingleItem && styles.singleCard
      ]}
    >
        {/* Imagem do produto */}
        {item.images?.some(img => img.isDefault) ? (
          <View style={[
            styles.imageContainer,
            isSingleItem && styles.singleImageContainer
          ]}>
            <Image
              source={{ uri: decodeGzipToBase64(item.images[0].path) }}
              style={[
                styles.productImage,
                isSingleItem && styles.singleProductImage
              ]}
              resizeMode="contain"
            />
          </View>
        ) : (
          <View style={[
            styles.imageContainer,
            styles.noImageContainer,
            isSingleItem && styles.singleImageContainer
          ]}>
            <Text style={styles.noImageText}>Sem imagem</Text>
          </View>
        )}
        
        {/* Informações do produto */}
        <View style={[
          styles.infoContainer,
          isSingleItem && styles.singleInfoContainer
        ]}>
          <View style={styles.headerRow}>
            <Text style={[
              styles.productCode,
              isSingleItem && styles.singleProductCode
            ]}>{item.Codigo}</Text>
            <View style={[styles.stockBadge, item.Estoque > 0 ? styles.inStock : styles.outOfStock]}>
              <Text style={styles.stockText}>
                {item.Estoque > 0 ? `${item.Estoque} un` : 'ESGOTADO'}
              </Text>
            </View>
          </View>
          
          <Text style={[
            styles.productDescription,
            isSingleItem && styles.singleProductDescription
          ]} numberOfLines={2}>
            {item.Descricao}
          </Text>
          
          <View style={styles.detailsRow}>
            <Text style={[
              styles.detailText,
              isSingleItem && styles.singleDetailText
            ]}>{item.UnidadeMedida}</Text>
            <Text style={[
              styles.barcodeText,
              isSingleItem && styles.singleBarcodeText
            ]}>EAN: {item.CodigoDeBarras}</Text>
          </View>
          
          <View style={styles.priceContainer}>
            <View style={styles.priceBox}>
              <Text style={styles.priceLabel}>VAREJO</Text>
              <Text style={[
                styles.priceValue,
                isSingleItem && styles.singlePriceValue
              ]}>R$ {item.ValorVenda.toFixed(2)}</Text>
            </View>
            
            {item.ValorVendaAtacado > 0 && (
              <View style={[styles.priceBox, styles.atacadoBox]}>
                <Text style={styles.priceLabel}>ATACADO</Text>
                <Text style={[
                  styles.atacadoPriceValue,
                  isSingleItem && styles.singleAtacadoPriceValue
                ]}>R$ {item.ValorVendaAtacado.toFixed(2)}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading && produtos.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Carregando produtos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Search
          placeholder="Pesquisar produtos..."
          value={textFilter}
          onChangeText={setTextFilter}
          containerStyle={styles.searchContainer}
        />
      </View>
      
      {isLoading ? (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : null}
      
      <FlatList
        key={flatListKey} // Chave única que força recriação quando numColumns muda
        data={produtos}
        renderItem={renderItem}
        keyExtractor={item => item.Codigo.toString()}
        contentContainerStyle={[
          styles.listContent,
          isLoading && produtos.length > 0 ? styles.loadingOpacity : null
        ]}
        numColumns={numColumns}
        columnWrapperStyle={numColumns === 1 ? null : styles.columnWrapper}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum produto encontrado</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 12,
  },
  header: {
    paddingVertical: 16,
    backgroundColor: colors.white,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 12,
    textAlign: 'center',
  },
  searchContainer: {
    marginHorizontal: 0,
  },
  listContent: {
    paddingBottom: 20,
  },
  loadingOpacity: {
    opacity: 0.5,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  card: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.grayLight,
  },
  singleCard: {
    width: '90%',
    marginHorizontal: '5%',
    marginBottom: 20,
  },
  imageContainer: {
    width: '100%',
    height: 120,
    backgroundColor: colors.grayLighter,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.grayLight,
  },
  singleImageContainer: {
    height: 180,
  },
  noImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.grayLighter,
  },
  noImageText: {
    color: colors.gray,
    fontSize: 14,
    fontWeight: '500',
  },
  productImage: {
    width: '85%',
    height: '85%',
  },
  singleProductImage: {
    width: '90%',
    height: '90%',
  },
  infoContainer: {
    padding: 10,
  },
  singleInfoContainer: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  productCode: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.grayDark,
  },
  singleProductCode: {
    fontSize: 16,
  },
  productDescription: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 8,
    lineHeight: 18,
  },
  singleProductDescription: {
    fontSize: 18,
    height: 50,
    lineHeight: 22,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.grayDark,
  },
  singleDetailText: {
    fontSize: 14,
  },
  barcodeText: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.gray,
  },
  singleBarcodeText: {
    fontSize: 13,
  },
  stockBadge: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  inStock: {
    backgroundColor: colors.successLight,
  },
  outOfStock: {
    backgroundColor: colors.dangerLight,
  },
  stockText: {
    fontSize: 11,
    fontWeight: '600',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  priceBox: {
    flex: 1,
    padding: 6,
    borderRadius: 5,
    backgroundColor: colors.grayLighter,
    marginRight: 4,
  },
  atacadoBox: {
    backgroundColor: '#E6F7EE',
    marginRight: 0,
  },
  priceLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.grayDark,
    marginBottom: 2,
    textAlign: 'center',
  },
  priceValue: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primary,
    textAlign: 'center',
  },
  singlePriceValue: {
    fontSize: 18,
  },
  atacadoPriceValue: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.success,
    textAlign: 'center',
  },
  singleAtacadoPriceValue: {
    fontSize: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.grayDark,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
  },
});