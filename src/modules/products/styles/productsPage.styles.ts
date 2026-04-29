import {StyleSheet} from 'react-native';

import {colors} from '@/modules/styles';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
  },
  searchWrapper: {
    alignSelf: 'center',
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
    shadowOffset: {width: 0, height: 2},
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
  stockText: {
    fontSize: 12,
    fontWeight: '600',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  priceBox: {
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  priceLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.successDark,
    marginBottom: 2,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  wholesalePriceBox: {
    backgroundColor: colors.successLight,
  },
  wholesalePriceValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.successDark,
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
    backgroundColor: 'rgba(255,255,255,0.5)',
    zIndex: 1,
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.grayDark,
  },
});
