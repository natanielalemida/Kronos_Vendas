import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';

import {
  decodeGzipImageToBase64,
  getDefaultProductImage,
} from '../helpers/product-image.helpers';
import {formatCurrency} from '../helpers/product-formatters';
import {styles} from '../styles/productsPage.styles';
import {ProductCardProps} from '../types/products-components.types';

export function ProductCard({item, onPress}: ProductCardProps) {
  const defaultImage = getDefaultProductImage(item.images);
  const imageUri = defaultImage
    ? decodeGzipImageToBase64(defaultImage.path)
    : null;

  return (
    <TouchableOpacity onPress={() => onPress(item.Codigo)} style={styles.card}>
      <View style={styles.rowContainer}>
        {imageUri ? (
          <View style={styles.imageContainer}>
            <Image
              source={{uri: imageUri}}
              style={styles.productImage}
              resizeMode="contain"
            />
          </View>
        ) : null}

        <View style={styles.infoContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.productCode}>Codigo: {item.Codigo}</Text>
            <View style={[styles.stockBadge, styles.inStock]}>
              <Text style={styles.stockText}>Estoque: {item.Estoque}</Text>
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
              <Text style={styles.priceValue}>
                {formatCurrency(item.ValorVenda)}
              </Text>
            </View>

            {item.ValorVendaAtacado > 0 ? (
              <View style={[styles.priceBox, styles.wholesalePriceBox]}>
                <Text style={styles.priceLabel}>ATACADO</Text>
                <Text style={styles.wholesalePriceValue}>
                  {formatCurrency(item.ValorVendaAtacado)}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
