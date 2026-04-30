import pako from 'pako';
import base64 from 'base64-js';

import {SyncProductImageReference} from '@/modules/sync/types/product-sync.types';
import {logger} from '@/shared/utils/logger';

const decodedProductImageCache = new Map<string, string | null>();

export function decodeGzipImageToBase64(gzipBase64: string): string | null {
  const cachedImage = decodedProductImageCache.get(gzipBase64);

  if (cachedImage !== undefined) {
    return cachedImage;
  }

  try {
    const compressedData = base64.toByteArray(gzipBase64);
    const decompressedData = pako.inflate(compressedData);
    const base64String = base64.fromByteArray(decompressedData);

    const decodedImage = `data:image/png;base64,${base64String}`;

    decodedProductImageCache.set(gzipBase64, decodedImage);

    return decodedImage;
  } catch (error) {
    logger.error('ProductImage', 'Error while decoding product image.', error);
    decodedProductImageCache.set(gzipBase64, null);
    return null;
  }
}

export function getDefaultProductImage(
  images: SyncProductImageReference[],
): SyncProductImageReference | undefined {
  return images.find(image => image.isDefault) ?? images[0];
}
