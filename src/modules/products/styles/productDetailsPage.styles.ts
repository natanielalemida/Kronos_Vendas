import {Dimensions, Platform, StyleSheet} from 'react-native';

import {colors} from '@/modules/styles';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const styles = StyleSheet.create({
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
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 12,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: colors.arcGreen,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  backButtonText: {
    color: colors.white,
    fontWeight: '600',
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  carouselContainer: {
    marginTop: 8,
    minHeight: windowHeight * 0.35,
  },
  carousel: {
    width: windowWidth,
  },
  imageContainer: {
    width: windowWidth,
    height: windowHeight * 0.35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  carouselImage: {
    width: '92%',
    height: '92%',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: colors.arcGreen,
    width: 16,
  },
  inactiveDot: {
    backgroundColor: colors.grayLight,
  },
  placeholderContainer: {
    width: windowWidth,
    height: windowHeight * 0.35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  placeholderText: {
    marginTop: 12,
    color: colors.grayDark,
    fontSize: 14,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 16,
  },
  detailCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailIconText: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '700',
    maxWidth: '48%',
    textAlign: 'right',
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 14,
  },
  descriptionCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#4B5563',
  },
});
