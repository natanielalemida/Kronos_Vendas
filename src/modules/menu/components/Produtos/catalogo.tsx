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
  TouchableOpacity,
  Platform,
  SafeAreaView
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

  useEffect(() => {
    getProdutoById(id);
  }, [id]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.arcGreen} />
        <Text style={styles.loadingText}>Carregando produto...</Text>
      </SafeAreaView>
    );
  }

  if (!produto) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Icon name="error-outline" size={48} color="#EF4444" />
        <Text style={styles.errorText}>Produto não encontrado</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Função para formatar valores monetários
  const formatCurrency = (value: number) => {
    return value?.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    });
  };

  // Verifica se há imagens
  const hasImages = produto.images && produto.images.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <HeaderProducts
        label="Catálogo"
        leftColor="white"
        leftIcon="arrow-back"
        onPressLeftIcon={() => navigation.goBack()}
        leftSize={25}
      />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header com título e favorito */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{produto.Descricao}</Text>
        </View>

        {/* Carrossel de imagens ou placeholder */}
        <View style={styles.carouselContainer}>
          {hasImages ? (
            <>
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
            </>
          ) : (
            <View style={styles.placeholderContainer}>
              <Icon name="image" size={60} color={colors.grayLight} />
              <Text style={styles.placeholderText}>Sem imagem disponível</Text>
            </View>
          )}
        </View>

        {/* Informações do produto */}
        <View style={styles.content}>
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
                <Icon name="attach-money" size={20} color={colors.arcGreen} />
                <Text style={styles.detailLabel}>Preço unitário</Text>
              </View>
              <Text style={styles.detailValue}>{formatCurrency(produto.ValorVenda)}</Text>
            </View>

            {!!produto.ValorVendaAtacado && (
              <>
                <View style={styles.separator} />
                <View style={styles.detailRow}>
                  <View style={styles.detailIconText}>
                    <Icon name="local-offer" size={20} color={colors.arcGreen} />
                    <Text style={styles.detailLabel}>Preço Atacado</Text>
                  </View>
                  <Text style={styles.detailValue}>{formatCurrency(produto.ValorVendaAtacado)}</Text>
                </View>
              </>
            )}
          </View>

          {/* Descrição adicional (se houver) */}
          {produto.DescricaoComplementar && (
            <View style={styles.descriptionCard}>
              <Text style={styles.descriptionTitle}>Descrição</Text>
              <Text style={styles.descriptionText}>{produto.DescricaoComplementar}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
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
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingTop: Platform.OS === 'android' ? 20 : 0,
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
    paddingTop: Platform.OS === 'android' ? 20 : 0,
  },
  errorText: {
    fontSize: 18,
    color: '#1F2937',
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
    marginVertical: 16,
  },
  backButton: {
    backgroundColor: colors.arcGreen,
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 5,
  },
  favoriteButton: {
    padding: 8,
  },
  carouselContainer: {
    width: '100%',
    position: 'relative',
    marginBottom: 20,
    paddingVertical: 10,
    alignSelf: 'center'
  },
  carrossel: {
    height: windowHeight * 0.35,
  },
  imageContainer: {
    width: windowWidth,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  imagemCarrossel: {
    width: '90%',
    height: '90%',
    resizeMode: 'contain',
  },
  placeholderContainer: {
    height: windowHeight * 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 8,
    marginHorizontal: 15,
    borderWidth: 1,
    borderColor: colors.grayLight,
    borderStyle: 'dashed',
  },
  placeholderText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.gray,
    fontFamily: 'Inter-Medium',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: colors.arcGreen,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  inactiveDot: {
    backgroundColor: '#E5E7EB',
  },
  content: {
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: 'Inter-Bold',
    flex: 1,
    lineHeight: 28,
  },
  detailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailIconText: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter-Medium',
  },
  detailValue: {
    fontSize: 14,
    color: '#1F2937',
    fontFamily: 'Inter-SemiBold',
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 4,
  },
  descriptionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  descriptionTitle: {
    fontSize: 16,
    color: '#1F2937',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#4B5563',
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
});

export default ProdutoCatalogo;