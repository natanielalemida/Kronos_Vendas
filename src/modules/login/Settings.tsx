import {Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ModalSelectHost from './components/selectHost/ModalSelectHost';
import {useState} from 'react';
import {UseSettingsRepository} from './components/selectHost/hooks';
import {Header} from '../components';
import {UseNavigator} from '../hooks';

export default function Settings() {
  const [isModalActive, setModalActive] = useState(false);
  const handleCloseModal = () => {
    setModalActive(!isModalActive);
  };

  const {goBack} = UseNavigator();

  const {host, codStore, terminal} = UseSettingsRepository({
    isActive: isModalActive,
  });

  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <Header
        label="Configurações"
        leftSize={25}
        leftColor="white"
        leftIcon="arrow-back"
        onPressLeftIcon={goBack}
        leftButtonDisable={host ? false : true}
      />
      <TouchableOpacity
        onPress={() => setModalActive(!isModalActive)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: 15,
          paddingHorizontal: 15,
          backgroundColor: 'white',
          borderRadius: 8,
          width: '90%',
          marginVertical: 15,
        }}>
        <View
          style={{flexDirection: 'row', alignItems: 'center', width: '90%'}}>
          <View style={{marginRight: 15}}>
            <Icon name="wifi-sharp" size={25} color="black" />
          </View>
          <View style={{width: '100%'}}>
            <Text style={{fontWeight: 'bold', fontSize: 16, color: 'black'}}>
              Conexao
            </Text>
            <Text
              style={{color: 'black'}}
              numberOfLines={1}
              ellipsizeMode="head">
              Host: {host}
            </Text>
            <Text style={{color: 'black'}}>Cod Loja: {codStore}</Text>
            <Text style={{color: 'black'}}>Terminal: {terminal} </Text>
          </View>
        </View>
        <View style={{marginRight: 15}}>
          <Icon name="chevron-forward" size={25} color="black" />
        </View>
      </TouchableOpacity>
      <ModalSelectHost isActive={isModalActive} closeModal={handleCloseModal} />
    </View>
  );
}
