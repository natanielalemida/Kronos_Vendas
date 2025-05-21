import { Dimensions, StyleSheet} from 'react-native';
import { colors } from '../styles';

const {width, height} = Dimensions.get('window');

export const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    backgroundColor: 'rgb(0, 106, 106)',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  loginContainerInformations: {
    backgroundColor: colors.menuPrimary,
    height: height * 0.4,
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
    height: '40%',
  },
  loginImage: {width: 120, height: 120},
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
  },
  buttonLabelAuthContainer: {
    backgroundColor: '#051f1e',
    elevation: 4,
    marginVertical: 13,
    width: '88%',
    height: '25%',
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
  settingsIconTop: {
    position: 'absolute',
    top: 60,
    right: 25,
    zIndex: 1,
  },
  settingsIconPadding: {paddingRight: 10},
  settingsText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#051f1e',
  },
  arcSolution: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 25,
  },
});
