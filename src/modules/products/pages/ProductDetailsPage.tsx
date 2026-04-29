import {MaterialIcons} from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {HeaderProducts} from '@/modules/components/headers/HeaderProducts';
import {colors} from '@/modules/styles';

import {ProductGallery} from '../components/ProductGallery';
import {formatCurrency} from '../helpers/product-formatters';
import {useProductGalleryState} from '../hooks/useProductGalleryState';
import {useSetupProductDetailsPage} from '../hooks/useSetupProductDetailsPage';
import {styles} from '../styles/productDetailsPage.styles';

export default function ProductDetailsPage() {
  const {data, handlers, viewState} = useSetupProductDetailsPage();
  const gallery = useProductGalleryState();

  if (viewState.isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.arcGreen} />
        <Text style={styles.loadingText}>Carregando produto...</Text>
      </SafeAreaView>
    );
  }

  if (viewState.isNotFound || !data.product) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={48} color="#EF4444" />
        <Text style={styles.errorText}>Produto não encontrado</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handlers.handleGoBack}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const hasImages = data.product.images.length > 0;

  return (
    <View style={styles.container}>
      <HeaderProducts
        label="Catálogo"
        leftColor="white"
        leftIcon="arrow-back"
        onPressLeftIcon={handlers.handleGoBack}
        leftSize={25}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{data.product.Descricao}</Text>
        </View>

        <View style={styles.carouselContainer}>
          {hasImages ? (
            <ProductGallery
              images={data.product.images}
              selectedIndex={gallery.selectedIndex}
              onChangeIndex={gallery.setSelectedIndex}
            />
          ) : (
            <View style={styles.placeholderContainer}>
              <MaterialIcons name="image" size={60} color={colors.grayLight} />
              <Text style={styles.placeholderText}>Sem imagem disponível</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <View style={styles.detailIconText}>
                <MaterialIcons name="code" size={20} color={colors.arcGreen} />
                <Text style={styles.detailLabel}>Código</Text>
              </View>
              <Text style={styles.detailValue}>{data.product.Codigo}</Text>
            </View>

            <View style={styles.separator} />

            <View style={styles.detailRow}>
              <View style={styles.detailIconText}>
                <MaterialIcons
                  name="straighten"
                  size={20}
                  color={colors.arcGreen}
                />
                <Text style={styles.detailLabel}>Unidade</Text>
              </View>
              <Text style={styles.detailValue}>
                {data.product.UnidadeMedida}
              </Text>
            </View>

            <View style={styles.separator} />

            <View style={styles.detailRow}>
              <View style={styles.detailIconText}>
                <MaterialIcons
                  name="qr-code"
                  size={20}
                  color={colors.arcGreen}
                />
                <Text style={styles.detailLabel}>Código de Barras</Text>
              </View>
              <Text style={styles.detailValue}>
                {data.product.CodigoDeBarras}
              </Text>
            </View>

            <View style={styles.separator} />

            <View style={styles.detailRow}>
              <View style={styles.detailIconText}>
                <MaterialIcons
                  name="inventory"
                  size={20}
                  color={colors.arcGreen}
                />
                <Text style={styles.detailLabel}>Estoque</Text>
              </View>
              <Text style={styles.detailValue}>{data.product.Estoque}</Text>
            </View>

            <View style={styles.separator} />

            <View style={styles.detailRow}>
              <View style={styles.detailIconText}>
                <MaterialIcons
                  name="attach-money"
                  size={20}
                  color={colors.arcGreen}
                />
                <Text style={styles.detailLabel}>Preço unitário</Text>
              </View>
              <Text style={styles.detailValue}>
                {formatCurrency(data.product.ValorVenda)}
              </Text>
            </View>

            {data.product.ValorVendaAtacado ? (
              <>
                <View style={styles.separator} />
                <View style={styles.detailRow}>
                  <View style={styles.detailIconText}>
                    <MaterialIcons
                      name="local-offer"
                      size={20}
                      color={colors.arcGreen}
                    />
                    <Text style={styles.detailLabel}>Preço Atacado</Text>
                  </View>
                  <Text style={styles.detailValue}>
                    {formatCurrency(data.product.ValorVendaAtacado)}
                  </Text>
                </View>
              </>
            ) : null}
          </View>

          {data.product.DescricaoComplementar ? (
            <View style={styles.descriptionCard}>
              <Text style={styles.descriptionTitle}>Descrição</Text>
              <Text style={styles.descriptionText}>
                {data.product.DescricaoComplementar}
              </Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}
