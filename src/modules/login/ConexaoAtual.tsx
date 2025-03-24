import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ModalSelectHost from './components/selectHost/ModalSelectHost';
import {useState, useEffect} from 'react';
import {Header} from '../components';
import {UseNavigator} from '../hooks';
import {colors} from '../styles';
import UseSaveSettingsOnStorage from './components/selectHost/hooks/useSaveSettingsOnStorage';
import {CheckBox} from '@rneui/themed';
import {useSaveSettings, UseSettingsRepository} from './components/selectHost/hooks';

export default function ConexaoAtual() {
  const [isModalActive, setModalActive] = useState(false);
  const [idModal, setIdModal] = useState<number | undefined>(undefined);
  const {goBack} = UseNavigator();
  const {connections, getConnections, deleteSetting} = UseSaveSettingsOnStorage({});

  const {handleSave, idKronos} = useSaveSettings({
    closeModal: () => setModalActive(false),
  });

  useEffect(() => {
    getConnections();
  }, [isModalActive]);

  const closeModal = () => {
    setModalActive(false);
    setIdModal(undefined);
  };

  const openEditModal = (id: number) => {
    setIdModal(id);
    setModalActive(true);
  };

  const handleDelete = (id: number, host: string) => {
    Alert.alert(
      'Excluir Conexão',
      `Tem certeza que deseja excluir esta esse host: ${host}?`,
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Excluir',
          onPress: () => deleteSetting(id),
          style: 'destructive',
        },
      ],
    );
  };

  const renderItem = ({item}: any) => (
    <TouchableOpacity
      style={styles.connectionCard}
      onPress={() => openEditModal(item.id)}>
      <View style={styles.connectionInfo}>
        <Icon name="wifi-sharp" size={25} color="black" style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>Conexão</Text>
          <Text style={styles.text}>Host: {item.host}</Text>
          <Text style={styles.text}>Cod Loja: {item.codStore}</Text>
          <Text style={styles.text}>Terminal: {item.terminal}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <CheckBox
          checked={idKronos == item.id}
          containerStyle={{
            backgroundColor: undefined,
            padding: 0,
            marginRight: -1,
          }}
          onPress={() =>
            handleSave({
              codStore: item.codStore,
              host: item.host,
              id: item.id,
              terminal: item.terminal,
            })
          }
        />
        <TouchableOpacity onPress={() => handleDelete(item.id, item.host)}>
          <Icon name="trash" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header
        label="Conexão"
        leftSize={25}
        leftColor="white"
        leftIcon="arrow-back"
        onPressLeftIcon={goBack}
      />

      <FlatList
        data={connections}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={{paddingBottom: 80}}
      />

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setModalActive(true)}>
        <Icon name="add" size={30} color="white" />
      </TouchableOpacity>

      <ModalSelectHost
        isActive={isModalActive}
        closeModal={closeModal}
        id={idModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.arcGreen400,
  },
  connectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    marginVertical: 8,
    backgroundColor: 'white',
    borderRadius: 16,
    marginHorizontal: 16,
    elevation: 2,
  },
  connectionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'black',
  },
  text: {
    color: 'black',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: colors.arcGreen,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});
