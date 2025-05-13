import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../styles';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    backgroundColor: 'rgb(0, 106, 106)',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingsIconTop: {
    position: 'absolute',
    top: height * 0.06, // equivalente a 50
    right: width * 0.06, // equivalente a 25
    zIndex: 1,
  },
  loginContainerInformations: {
    backgroundColor: colors.arcGreen400,
    height: height * 0.37,
    width: width * 0.8,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: width * 0.04,
    paddingVertical: height * 0.02,
    marginVertical: height * 0.005,
  },
  loginLabelContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '50%', // mantém proporcional ao pai
  },
  loginImage: {
    width: width * 0.42, // 160 de 375
    height: width * 0.42, // proporcional
  },
  KronosFood: {
    fontSize: width * 0.093, // 35 de 375
    fontWeight: 'bold',
    paddingVertical: height * 0.018,
    fontFamily: 'Segoe UI',
    color: '#051f1e',
  },
  buttonsLabel: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  buttonLabelAuthContainer: {
    backgroundColor: '#051f1e',
    width: width * 0.7,
    height: height * 0.04,
    borderRadius: width * 0.07,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonAuth: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: 'white',
  },
  magin: {
    marginBottom: height * 0.012,
  },
  buttonSettingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsIconPadding: {
    paddingHorizontal: width * 0.04,
  },
  settingsText: {
    fontSize: width * 0.053,
    fontWeight: 'bold',
    color: '#051f1e',
  },
  arcSolution: {
    fontSize: width * 0.037,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: height * 0.018,
  },
});
