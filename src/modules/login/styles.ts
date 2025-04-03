import {StyleSheet} from 'react-native';
import { colors } from '../styles';

export const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    backgroundColor: 'rgb(0, 106, 106)',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingsIconTop: {
    position: 'absolute',
    top: 35,
    right: 25,
    zIndex: 1,
  },
  loginContainerInformations: {
    backgroundColor: colors.arcGreen400,
    height: '40%',
    width: '80%',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 15,
    paddingVertical: 15,
    marginVertical: 1,
  },
  loginLabelContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '50%',
  },
  loginImage: {width: 160, height: 160},
  KronosFood: {
    fontSize: 35,
    fontWeight: 'bold',
    paddingVertical: 15,
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
    width: '80%',
    height: '30%',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonAuth: {fontSize: 15, fontWeight: 'bold', color: 'white'},
  magin: {marginBottom: 10},
  buttonSettingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsIconPadding: {paddingHorizontal: 15},
  settingsText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#051f1e',
  },
  arcSolution: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
});
