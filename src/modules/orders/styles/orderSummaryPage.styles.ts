import {StyleSheet} from 'react-native';

import {colors} from '@/modules/styles';

export const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.graySearch,
    borderRadius: 5,
    padding: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  buttonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  colorBlack: {
    color: colors.black,
  },
  confirmButton: {
    backgroundColor: colors.confirmButton,
    borderRadius: 5,
    padding: 10,
  },
  container: {
    flex: 1,
  },
  paymentDetails: {
    marginLeft: 15,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  productDetails: {
    flex: 1,
    flexDirection: 'row',
  },
  productInfo: {
    flexDirection: 'row',
  },
  productInfoBlock: {
    marginLeft: 15,
  },
  productName: {
    color: colors.arcGreen,
    fontWeight: 'bold',
    width: '80%',
  },
  productPrice: {
    color: colors.confirmButton,
    fontWeight: 'bold',
  },
  productRow: {
    borderTopColor: colors.black,
    borderTopWidth: 1,
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  rightAlignedText: {
    color: colors.black,
    textAlign: 'right',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginVertical: 10,
  },
  sectionTitle: {
    color: colors.black,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  title: {
    color: colors.black,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  totalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalRow: {
    marginVertical: 20,
  },
  warningButton: {
    backgroundColor: colors.yellow,
  },
});
