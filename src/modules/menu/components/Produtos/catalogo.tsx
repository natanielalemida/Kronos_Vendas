import React, { useEffect } from 'react';
import pako from 'pako';
import base64 from 'base64-js';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import UseGetProdutos from './hooks/useGetProdutos';
import { useRoute } from '@react-navigation/native';

const ProdutoCatalogo = () => {
  const router = useRoute();
  const {params} = router;
  const {id} = params || {};
  const {getProdutoById, produto, isLoading} = UseGetProdutos();

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

  useEffect(() => {
    getProdutoById(id);
  }, [id]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2e86de" />
        <Text style={styles.loadingText}>Carregando produto...</Text>
      </View>
    );
  }

  if (!produto) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Produto não encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>{produto.Descricao}</Text>
      
      {/* Carrossel de imagens */}
      <ScrollView 
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.carrossel}
      >
        {produto.images?.map((imagem, index) => (
          <Image 
            key={index}
            source={{ uri: decodeGzipToBase64(imagem.path) }} 
            style={styles.imagemCarrossel}
            resizeMode="contain"
          />
        ))}
      </ScrollView>

      {/* Informações do produto */}
      <View style={styles.infoContainer}>
        <View style={styles.row}>
          <Text style={styles.label}>Código:</Text>
          <Text style={styles.value}>{produto.Codigo}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Unidade:</Text>
          <Text style={styles.value}>{produto.UnidadeMedida}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Código de Barras:</Text>
          <Text style={styles.value}>{produto.CodigoDeBarras}</Text>
        </View>

        {/* Preços */}
        {/* <View style={styles.priceContainer}>
          <Text style={styles.valor}>Preço: R$ {produto.ValorVenda?.toFixed(2)}</Text>
          {produto.ValorVendaAtacado && (
            <Text style={styles.valorAtacado}>Preço Atacado: R$ {produto.ValorVendaAtacado.toFixed(2)}</Text>
          )}
        </View> */}

        {/* Estoque */}
        {/* <View style={[styles.stockContainer, produto.Estoque > 0 ? styles.inStock : styles.outOfStock]}>
          <Text style={styles.estoque}>
            {produto.Estoque > 0 ? `Disponível: ${produto.Estoque} unidades` : 'ESGOTADO'}
          </Text>
        </View> */}

        {/* Botão de ação */}
        <TouchableOpacity style={styles.botao}>
          <Text style={styles.botaoTexto}>ADICIONAR AO CARRINHO</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    fontSize: 18,
    color: '#e60000',
    textAlign: 'center',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    margin: 15,
    textAlign: 'center',
  },
  carrossel: {
    height: 300,
  },
  imagemCarrossel: {
    width: windowWidth,
    height: 300,
    backgroundColor: '#f0f0f0',
  },
  infoContainer: {
    padding: 20,
    backgroundColor: '#ffffff',
    margin: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  priceContainer: {
    marginVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 15,
  },
  valor: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e60000',
    marginBottom: 5,
  },
  valorAtacado: {
    fontSize: 18,
    fontWeight: '600',
    color: '#008000',
  },
  stockContainer: {
    padding: 12,
    borderRadius: 6,
    marginVertical: 15,
    alignItems: 'center',
  },
  inStock: {
    backgroundColor: '#e6f7ee',
  },
  outOfStock: {
    backgroundColor: '#ffebee',
  },
  estoque: {
    fontSize: 16,
    fontWeight: '500',
  },
  botao: {
    backgroundColor: '#2e86de',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProdutoCatalogo;