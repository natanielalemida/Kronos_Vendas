import React from 'react';
import pako from 'pako';
import base64 from 'base64-js';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {useEffect, useState, useRef, useCallback} from 'react';
import UseGetProdutos from './hooks/useGetProdutos';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import UseModal from './hooks/useModal';
import ModalVenda from './components/modalVenda';
import UseSetSelecteds from './hooks/useSetSelecteds';
import {ShowIf} from '../../../../../components/showIf';
import {useCliente} from '../../../Clientes/context/clientContext';
import {colors} from '../../../../../styles';
import Search from '../../../../../components/search';

export default function SelectProdutos() {
  const navigation = useNavigation();
  const {handleGetProdutos, produtos, isLoading} = UseGetProdutos();
  const {findIndex} = UseSetSelecteds({});
  const {
    isActive,
    produtoModal,
    isAtacado,
    canSetAtacado,
    setAtacado,
    setIsActive,
    handleOpenModal,
  } = UseModal();
  const {clienteOnContext} = useCliente();

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

  const renderItem = ({item, index}: {item: ProdutoDto; index: number}) => {
    const isSingleItem = numColumns === 1;
    const color = findIndex(item);
    const backgroundColor =
      color || (index % 2 === 0 ? colors.grayList : colors.white);

    const renderProductCard = (
      showAtacado: boolean,
      isAtacadoSelectable: boolean,
    ) => (
      <TouchableOpacity
        style={[
          styles.card,
          isSingleItem && styles.singleCard,
          {backgroundColor},
        ]}
        onPress={() => handleOpenModal(item, showAtacado, isAtacadoSelectable)}>
        {/* Container da imagem */}
        {item.images?.some(img => img.isDefault) ? (
          <View
            style={[
              styles.imageContainer,
              isSingleItem && styles.singleImageContainer,
            ]}>
            <Image
              source={{uri: decodeGzipToBase64(item.images[0].path)}}
              style={[
                styles.productImage,
                isSingleItem && styles.singleProductImage,
              ]}
              resizeMode="contain"
            />
          </View>
        ) : (
          <View
            style={[
              styles.imageContainer,
              styles.noImageContainer,
              isSingleItem && styles.singleImageContainer,
            ]}>
            <Text style={styles.noImageText}>Sem imagem</Text>
          </View>
        )}

        <View style={styles.infoContainer}>
          <View style={styles.headerRow}>
            <Text
              style={[
                styles.productCode,
                isSingleItem && styles.singleProductCode,
              ]}>
              {item.Codigo}
            </Text>
            <View
              style={[
                styles.stockBadge,
                item.Estoque > 0 ? styles.inStock : styles.outOfStock,
              ]}>
              <Text style={styles.stockText}>
                {item.Estoque > 0 ? `Est. ${item.Estoque}` : 'ESGOTADO'}
              </Text>
            </View>
          </View>

          <Text
            style={[
              styles.productDescription,
              isSingleItem && styles.singleProductDescription,
            ]}
            numberOfLines={2}>
            {item.Descricao}
          </Text>

          <Text
            style={[
              styles.barcodeText,
              isSingleItem && styles.singleBarcodeText,
            ]}>
            EAN: {item.CodigoDeBarras || 'N/A'}
          </Text>

          <View style={styles.priceContainer}>
            {showAtacado ? (
              <Text
                style={[
                  styles.atacadoPriceValue,
                  isSingleItem && styles.singleAtacadoPriceValue,
                ]}>
                R$ {item.ValorVendaAtacado?.toFixed(2) || '0.00'}
              </Text>
            ) : (
              <Text
                style={[
                  styles.priceValue,
                  isSingleItem && styles.singlePriceValue,
                ]}>
                R$ {item.ValorVenda?.toFixed(2) || '0.00'}
              </Text>
            )}

            {isAtacadoSelectable && item.VendeProdutoNoAtacado === 1 && (
              <Text
                style={[
                  styles.atacadoPriceValue,
                  isSingleItem && styles.singleAtacadoPriceValue,
                ]}>
                Atac: R$ {item.ValorVendaAtacado?.toFixed(2) || '0.00'}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );

    return (
      <>
        {clienteOnContext?.TipoPreco === null && renderProductCard(false, true)}

        {Number(clienteOnContext?.TipoPreco) === 1 &&
          renderProductCard(false, false)}
        {Number(clienteOnContext?.TipoPreco) === 2 &&
          Number(item.VendeProdutoNoAtacado) === 1 &&
          renderProductCard(true, false)}
      </>
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
      <Search
        placeholder="Pesquisar produtos..."
        value={textFilter}
        onChangeText={setTextFilter}
      />
      <ModalVenda
        isActive={isActive}
        setIsActive={setIsActive}
        canSetAtacado={canSetAtacado}
        isAtacadoActive={isAtacado}
        setAtacadoActive={setAtacado}
        produto={produtoModal}
      />

      {isLoading ? (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : null}

      <FlatList
        key={flatListKey}
        data={produtos}
        renderItem={renderItem}
        keyExtractor={item => item.Codigo.toString()}
        contentContainerStyle={[
          styles.listContent,
          isLoading && produtos.length > 0 ? styles.loadingOpacity : null,
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
    padding: 10,
  },
  header: {
    paddingVertical: 16,
    backgroundColor: colors.white,
    width: '100%',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 12,
    textAlign: 'center',
  },
  searchContainer: {
    marginHorizontal: 0,
    width: '100%',
  },
  listContent: {
    paddingBottom: 20,
  },
  loadingOpacity: {
    opacity: 0.6,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  // Card styles
  card: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
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
  },
  // Image styles
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
    height: 150,
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
    width: '80%',
    height: '80%',
  },
  singleProductImage: {
    width: '85%',
    height: '85%',
  },

  // Info container
  infoContainer: {
    padding: 12,
  },
  singleInfoContainer: {
    padding: 14,
  },

  // Header row (code + stock)
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  productCode: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.grayDark,
  },
  singleProductCode: {
    fontSize: 15,
  },

  // Product description
  productDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
    marginBottom: 8,
    lineHeight: 20,
  },
  singleProductDescription: {
    fontSize: 17,
    lineHeight: 22,
  },

  // Barcode/Details
  detailsRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.grayDark,
  },
  singleDetailText: {
    fontSize: 15,
  },
  barcodeText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray,
    marginBottom: 8,
  },
  singleBarcodeText: {
    fontSize: 15,
  },

  // Stock badge
  stockBadge: {
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  inStock: {
    backgroundColor: colors.successLight,
  },
  outOfStock: {
    backgroundColor: colors.dangerLight,
  },
  stockText: {
    fontSize: 14,
    fontWeight: '600',
  },
  singleStockText: {
    fontSize: 15,
  },

  // Price styles
  priceContainer: {
    marginTop: 8,
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
    fontSize: 12,
    fontWeight: '700',
    color: colors.grayDark,
    marginBottom: 2,
    textAlign: 'center',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
  },
  singlePriceValue: {
    fontSize: 18,
  },
  atacadoPriceValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.success,
    textAlign: 'center',
  },
  singleAtacadoPriceValue: {
    fontSize: 18,
  },

  // Loading states
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

  // Empty state
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
