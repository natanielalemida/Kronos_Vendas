import {Dimensions, StyleSheet} from 'react-native';

import {colors} from '@/modules/styles';

const {width, height} = Dimensions.get('window');

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'rgb(0, 106, 106)',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingsButton: {
    position: 'absolute',
    top: height * 0.08,
    right: width * 0.06,
    zIndex: 1,
  },
  brandContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '50%',
  },
  compactBrandContainer: {
    height: height * 0.2,
  },
  brandImage: {
    width: width * 0.42,
    height: width * 0.42,
  },
  brandTitle: {
    fontSize: width * 0.093,
    fontWeight: 'bold',
    paddingVertical: height * 0.018,
    fontFamily: 'Segoe UI',
    color: '#051f1e',
  },
  formContainer: {
    backgroundColor: colors.arcGreen400,
    height: height * 0.37,
    width: width * 0.8,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: width * 0.04,
    paddingVertical: height * 0.02,
    marginVertical: height * 0.005,
  },
  compactFormContainer: {
    height: height * 0.33,
  },
  actionsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#051f1e',
    width: width * 0.7,
    height: height * 0.04,
    borderRadius: width * 0.07,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonCompact: {
    height: height * 0.045,
  },
  submitButtonText: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: 'white',
  },
  biometricButton: {
    flexDirection: 'row',
    backgroundColor: '#4a6463',
    width: width * 0.63,
    height: height * 0.043,
    borderRadius: 25,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  biometricButtonText: {
    color: 'white',
  },
  iconSpacing: {
    paddingHorizontal: width * 0.04,
  },
  footerText: {
    fontSize: width * 0.037,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: height * 0.018,
  },
});
