import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ModalSelectHost from './components/selectHost/ModalSelectHost';
import { useState } from 'react';
import { UseSettingsRepository } from './components/selectHost/hooks';
import { Header } from '../components';
import { UseNavigator } from '../hooks';
import { colors } from '../styles';
import ModalParametrosLocais from './components/selectLocalParametros/parametrosLocais';

export default function Settings() {
  const [isModalActive, setModalActive] = useState(false);
  const [isModalLocalParamentros, setIsModalLocalParamentros] = useState(false);
  const handleCloseModal = () => setModalActive(!isModalActive);

  const { goBack, goTo } = UseNavigator();
  const { host, codStore, terminal } = UseSettingsRepository({ isActive: isModalActive });

  return (
    <View style={styles.container}>
      <Header
        label="Configurações"
        leftSize={25}
        leftColor="white"
        leftIcon="arrow-back"
        onPressLeftIcon={goBack}
        leftButtonDisable={!host}
      />
      
      <OptionButton
        title="Conexão Atual"
        iconName="wifi-sharp"
        onPress={() => goTo('Conexoes')}
        details={[`Host: ${host}`, `Cod Loja: ${codStore}`, `Terminal: ${terminal}`]}
      />
      <OptionButton
        title="Parâmetros Locais"
        iconName="settings"
        onPress={() => setIsModalLocalParamentros(!isModalLocalParamentros)}
      />
      
      <ModalParametrosLocais isActive={isModalLocalParamentros} closeModal={() => setIsModalLocalParamentros(!isModalLocalParamentros)}/>
      
      <ModalSelectHost isActive={isModalActive} closeModal={handleCloseModal} />
    </View>
  );
}

function OptionButton({ title, iconName, onPress, details = [] }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <View style={styles.buttonContent}>
        <Icon name={iconName} size={25} color="black" style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          {details.map((detail, index) => (
            <Text key={index} style={styles.detail} numberOfLines={1} ellipsizeMode="head">{detail}</Text>
          ))}
        </View>
      </View>
      <Icon name="chevron-forward" size={25} color="black" style={styles.icon} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.arcGreen400,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    borderRadius: 16,
    elevation: 2,
    width: '90%',
    marginTop: 15,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
  },
  icon: {
    marginRight: 15,
  },
  textContainer: {
    width: '100%',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'black',
  },
  detail: {
    color: 'black',
  },
});
