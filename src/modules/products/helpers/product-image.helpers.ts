import pako from 'pako';
import base64 from 'base64-js';

import {SyncProductImageReference} from '@/modules/sync/types/product-sync.types';

export function decodeGzipImageToBase64(gzipBase64: string): string | null {
  try {
    const compressedData = base64.toByteArray(gzipBase64);
    const decompressedData = pako.inflate(compressedData);
    const base64String = base64.fromByteArray(decompressedData);

    return `data:image/png;base64,${base64String}`;
  } catch (error) {
    console.error('Error while decoding product image', error);
    return null;
  }
}

export function getDefaultProductImage(
  images: SyncProductImageReference[],
): SyncProductImageReference | undefined {
  return images.find(image => image.isDefault) ?? images[0];
}
