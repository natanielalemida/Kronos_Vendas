import React, { useEffect, useState, useRef } from 'react';
import pako from 'pako';
import base64 from 'base64-js';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  ScrollView, 
  Dimensions, 
  ActivityIndicator, 
  TouchableOpacity 
} from 'react-native';
import UseGetProdutos from './hooks/useGetProdutos';
import { useNavigation, useRoute } from '@react-navigation/native';
import { HeaderProducts } from '../../../components/headers/HeaderProducts';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../../styles';

const ProdutoCatalogo = () => {
  const navigation = useNavigation()
  const router = useRoute();
  const {params} = router;
  const {id} = params || {};
  const {getProdutoById, produto, isLoading} = UseGetProdutos();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const decodeGzipToBase64 = (gzipBase64: string) => {
    try {
      const compressedData = base64.toByteArray(gzipBase64);
      const decompressedData = pako.inflate(compressedData);
      const base64String = base64.fromByteArray(decompressedData);
      return `data:image/png;base64,${base64String};`
    } catch (error) {
      console.error('Erro ao descompactar a imagem:', error);
      return null;
    }
  };

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const viewSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.floor(contentOffset / viewSize);
    setCurrentIndex(index);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Aqui você pode adicionar a lógica para salvar nos favoritos
  };

  useEffect(() => {
    getProdutoById(id);
  }, [id]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.arcGreen} />
        <Text style={styles.loadingText}>Carregando produto...</Text>
      </View>
    );
  }

  if (!produto) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="error-outline" size={48} color="#EF4444" />
        <Text style={styles.errorText}>Produto não encontrado</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderProducts
        label="Catalogo"
        leftColor="white"
        leftIcon="arrow-back"
        onPressLeftIcon={() => navigation.goBack()}
        leftSize={25}
      />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Carrossel de imagens */}
        <View style={styles.carouselContainer}>
          <ScrollView 
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.carrossel}
            onMomentumScrollEnd={handleScroll}
            scrollEventThrottle={32}
            decelerationRate="fast"
          >
            {produto.images?.map((imagem, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image 
                  source={{ uri: decodeGzipToBase64(imagem.path) }} 
                  style={styles.imagemCarrossel}
                  resizeMode="contain"
                />
              </View>
            ))}
          </ScrollView>
          
          {/* Indicador de dots */}
          <View style={styles.dotsContainer}>
            {produto.images?.map((_, index) => (
              <View 
                key={index} 
                style={[
                  styles.dot,
                  index === currentIndex ? styles.activeDot : styles.inactiveDot
                ]} 
              />
            ))}
          </View>
        </View>

        {/* Informações do produto */}
        <View style={styles.content}>
          <Text style={styles.title}>{produto.Descricao}</Text>
          
          {/* Card de detalhes */}
          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <View style={styles.detailIconText}>
                <Icon name="code" size={20} color={colors.arcGreen} />
                <Text style={styles.detailLabel}>Código</Text>
              </View>
              <Text style={styles.detailValue}>{produto.Codigo}</Text>
            </View>
            
            <View style={styles.separator} />
            
            <View style={styles.detailRow}>
              <View style={styles.detailIconText}>
                <Icon name="straighten" size={20} color={colors.arcGreen} />
                <Text style={styles.detailLabel}>Unidade</Text>
              </View>
              <Text style={styles.detailValue}>{produto.UnidadeMedida}</Text>
            </View>
            
            <View style={styles.separator} />
            
            <View style={styles.detailRow}>
              <View style={styles.detailIconText}>
                <Icon name="qr-code" size={20} color={colors.arcGreen} />
                <Text style={styles.detailLabel}>Código de Barras</Text>
              </View>
              <Text style={styles.detailValue}>{produto.CodigoDeBarras}</Text>
            </View>

            <View style={styles.separator} />
            
            <View style={styles.detailRow}>
              <View style={styles.detailIconText}>
                <Icon name="inventory" size={20} color={colors.arcGreen} />
                <Text style={styles.detailLabel}>Estoque</Text>
              </View>
              <Text style={styles.detailValue}>{produto.Estoque}</Text>
            </View>

            <View style={styles.separator} />
            
            <View style={styles.detailRow}>
              <View style={styles.detailIconText}>
                <Icon name="inventory" size={20} color={colors.arcGreen} />
                <Text style={styles.detailLabel}>Preço unitário</Text>
              </View>
              <Text style={styles.detailValue}>{produto.ValorVenda?.toFixed(2)}</Text>
            </View>


            {!!produto.ValorVendaAtacado && (
              <>
              
             <View style={styles.separator} />
            
             <View style={styles.detailRow}>
               <View style={styles.detailIconText}>
                 <Icon name="inventory" size={20} color={colors.arcGreen} />
                 <Text style={styles.detailLabel}>Preço Atacado</Text>
               </View>
               <Text style={styles.detailValue}>{produto.ValorVendaAtacado?.toFixed(2)}</Text>
             </View>
             </>
            )}
            
          </View>

          {/* Botão de ação */}
          {/* <TouchableOpacity 
            style={styles.actionButton}
            activeOpacity={0.8}
          >
            <Text style={styles.actionButtonText}>Adicionar ao Carrinho</Text>
            <Icon name="shopping-cart" size={24} color="white" />
          </TouchableOpacity> */}
        </View>
      </ScrollView>
    </View>
  );
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#4B5563',
    fontFamily: 'Inter-Medium',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#1F2937',
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
    marginVertical: 16,
  },
  backButton: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  backButtonText: {
    color: 'white',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  carouselContainer: {
    width: windowWidth * 0.9,
    position: 'relative',
    marginBottom: 20,
    paddingVertical: 20,
    backgroundColor: undefined,
    alignSelf: 'center'
  },
  carrossel: {
    height: windowHeight * 0.35,
  },
  imageContainer: {
    margin: 3,
    width: windowWidth * 0.88,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    alignSelf: 'center'
  },
  imagemCarrossel: {
    width: '90%',
    height: '100%',
    resizeMode: 'contain',
  },
  dotsContainer: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 4,
    left: 0,
    right: 0,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#6C63FF',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  inactiveDot: {
    backgroundColor: '#E5E7EB',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
    fontFamily: 'Inter-Bold',
    textAlign: 'left',
    lineHeight: 32,
  },
  stockTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 20,
  },
  inStockTag: {
    backgroundColor: '#D1FAE5',
  },
  outOfStockTag: {
    backgroundColor: '#FEE2E2',
  },
  stockTagText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  detailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  detailIconText: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailLabel: {
    fontSize: 15,
    color: '#6B7280',
    fontFamily: 'Inter-Medium',
  },
  detailValue: {
    fontSize: 15,
    color: '#1F2937',
    fontFamily: 'Inter-SemiBold',
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  priceCard: {
    borderRadius: 16,
    padding: 16,
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    minHeight: 120,
  },
  retailCard: {
    backgroundColor: '#6C63FF',
  },
  wholesaleCard: {
    backgroundColor: '#10B981',
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    fontFamily: 'Inter-Bold',
    marginVertical: 4,
  },
  wholesalePrice: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    fontFamily: 'Inter-Bold',
    marginVertical: 4,
  },
  priceLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'Inter-Medium',
    textAlign: 'left',
  },
  priceSubtext: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  actionButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 12,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonText: {
    color: 'white',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
});

export default ProdutoCatalogo;