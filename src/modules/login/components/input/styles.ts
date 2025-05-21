import {StyleSheet, Dimensions} from 'react-native';

const {height} = Dimensions.get('window');

export const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 5,
    height: height * 0.07,
    paddingRight: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'black',
    marginVertical: 5,
    width: '100%',
  },
  leftIconContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    height: height * 0.07,
    width: '90%'
  },
  leftIcon: {
    paddingHorizontal: 10
  },
});