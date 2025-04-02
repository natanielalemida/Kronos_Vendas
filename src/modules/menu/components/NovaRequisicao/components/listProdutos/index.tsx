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
  ActivityIndicator,
} from 'react-native';
import {useEffect, useState, useRef, useCallback} from 'react';
import UseGetProdutos from './hooks/useGetProdutos';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import UseModal from './hooks/useModal';
import ModalVenda from './components/modalVenda';
import UseSetSelecteds from './hooks/useSetSelecteds';
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

  const renderItem = ({item}: {item: ProdutoDto}) => {
    const color = findIndex(item);
    const backgroundColor = color || colors.white;

    return (
      <TouchableOpacity
        style={[styles.card, {backgroundColor}]}
        onPress={() => handleOpenModal(item, false, true)}>
        <View style={styles.rowContainer}>
          {/* Container da imagem */}
          {item.images?.some(img => img.isDefault) ? (
            <View style={styles.imageContainer}>
              <Image
                source={{uri: decodeGzipToBase64(item.images[0].path)}}
                style={styles.productImage}
                resizeMode="contain"
              />
            </View>
          ) : (
            <View style={[styles.imageContainer, styles.noImageContainer]}>
              <Text style={styles.noImageText}>Sem imagem</Text>
            </View>
          )}
          
          <View style={styles.infoContainer}>
            <View style={styles.headerRow}>
              <Text style={styles.productCode}>Codigo: {item.Codigo}</Text>
              <View style={[styles.stockBadge, item.Estoque > 0 ? styles.inStock : styles.outOfStock]}>
                <Text style={styles.stockText}>
                  {item.Estoque > 0 ? `Estoque: ${item.Estoque}` : 'ESGOTADO'}
                </Text>
              </View>
            </View>
            
            <Text style={styles.productDescription} numberOfLines={2}>
              {item.Descricao}
            </Text>
            
            <View style={styles.detailsRow}>
              <Text style={styles.detailText}>{item.UnidadeMedida}</Text>
              <Text style={styles.barcodeText}>EAN: {item.CodigoDeBarras}</Text>
            </View>
            
            <View style={styles.priceContainer}>
              <View style={styles.priceBox}>
                <Text style={styles.priceValue}>R$ {item.ValorVenda.toFixed(2)}</Text>
              </View>
              
              {item.ValorVendaAtacado > 0 && (
                <View style={[styles.priceBox, styles.atacadoBox]}>
                  <Text style={styles.priceLabel}>ATACADO</Text>
                  <Text style={styles.atacadoPriceValue}>R$ {item.ValorVendaAtacado.toFixed(2)}</Text>
                </View>
              )}
            </View>
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
      <View style={{alignSelf: 'center'}}>
        <Search
          placeholder="Pesquisar produtos..."
          value={textFilter}
          onChangeText={setTextFilter}
        />
      </View>
      
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
        data={produtos}
        renderItem={renderItem}
        keyExtractor={item => item.Codigo.toString()}
        contentContainerStyle={[
          styles.listContent,
          isLoading && produtos.length > 0 ? styles.loadingOpacity : null
        ]}
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
    backgroundColor: colors.white,
    paddingHorizontal: 12,
  },
  header: {
    paddingVertical: 16,
    backgroundColor: colors.white,
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
  card: {
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
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
  },
  imageContainer: {
    width: '40%',
    height: '100%', 
    justifyContent: 'center',
    marginRight: 10,
    alignItems: 'center',
    overflow: 'hidden', 
  },
  noImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.grayLighter,
  },
  noImageText: {
    color: colors.gray,
    fontSize: 12,
    fontWeight: '500',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', 
  },
  infoContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  productCode: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.grayDark,
  },
  productDescription: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.grayDark,
  },
  barcodeText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.gray,
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
    fontSize: 12,
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
    fontSize: 11,
    fontWeight: '800',
    color: colors.grayDark,
    marginBottom: 2,
    textAlign: 'center',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
    textAlign: 'center',
  },
  atacadoPriceValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.success,
    textAlign: 'center',
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