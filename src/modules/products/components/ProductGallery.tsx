import React, {memo} from 'react';
import {Image, ScrollView, View} from 'react-native';

import {decodeGzipImageToBase64} from '../helpers/product-image.helpers';
import {styles} from '../styles/productDetailsPage.styles';
import {ProductGalleryProps} from '../types/products-components.types';

function ProductGalleryBase({
  images,
  onChangeIndex,
  selectedIndex,
}: ProductGalleryProps) {
  return (
    <>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.carousel}
        onMomentumScrollEnd={event => {
          const contentOffset = event.nativeEvent.contentOffset.x;
          const viewSize = event.nativeEvent.layoutMeasurement.width;
          const index = Math.floor(contentOffset / viewSize);
          onChangeIndex(index);
        }}
        scrollEventThrottle={32}
        decelerationRate="fast">
        {images.map((image, index) => (
          <View key={`${image.path}-${index}`} style={styles.imageContainer}>
            <Image
              source={{uri: decodeGzipImageToBase64(image.path) ?? undefined}}
              style={styles.carouselImage}
              resizeMode="contain"
            />
          </View>
        ))}
      </ScrollView>

      <View style={styles.dotsContainer}>
        {images.map((image, index) => (
          <View
            key={`${image.path}-dot-${index}`}
            style={[
              styles.dot,
              index === selectedIndex ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </>
  );
}

export const ProductGallery = memo(ProductGalleryBase);
