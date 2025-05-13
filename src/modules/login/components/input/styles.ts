import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: width * 0.013, // 5 de 375
    height: height * 0.07,
    paddingRight: width * 0.04, // 15 de 375
    borderRadius: width * 0.021, // 8 de 375
    borderWidth: 1,
    borderColor: 'black',
    marginVertical: height * 0.006, // 5 de 812
  },
  leftIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: height * 0.06, // 50 de 812
    width: width * 0.4,
  },
  leftIcon: {
    paddingHorizontal: width * 0.027, // 10 de 375
  },
});
