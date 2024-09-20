import {Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import LottieView from 'lottie-react-native';
import {colors} from '../../../styles';
import UseMessageSync from './hooks/useMessageSync';
import UseSync from './hooks/useSync';
import useShareDatabase from './hooks/useShare';
import {useEffect, useRef} from 'react';
import {useCliente} from '../Clientes/context/clientContext';
import {useNavigation} from '@react-navigation/native';
import EnviarClientes from '../../../enviarDados/cliente';
import {UsuarioDto} from '../../../login/hooks/type';

export default function Sincronizacao() {
  const navigation = useNavigation();
  const {isSyncing, setIsSyncing, usuario, organizationCode} = useCliente();
  const {progress, setProgress} = UseMessageSync();
  const {clean} = UseSync({setProgress});
  const {shareDatabaseFile} = useShareDatabase();

  const repository = new EnviarClientes(usuario as UsuarioDto, setProgress);

  const animation = useRef();

  const handleSync = async () => {
    animation.current?.play();
    await repository.runEnviarClientes();
    await clean();
    animation.current?.reset();
  };

  const handleSyncClear = async () => {
    animation.current?.play();
    setIsSyncing(true);
    await clean();
    setIsSyncing(false);
    animation.current?.reset();
    navigation.navigate('Novo Pedido');
  };

  return (
    <View style={styles.container}>
      <View style={styles.animationContainer}>
        <LottieView
          ref={animation}
          source={require('../../../../assets/sync/Animation - 1724678574908.json')}
          style={styles.lottieLarge}
        />
        {progress && (
          <LottieView
            source={require('../../../../assets/sync/Animation - 1724681567926.json')}
            progress={progress?.progress / 100}
            style={styles.lottieSmall}
          />
        )}
        {progress && <Text>{progress?.message}</Text>}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.syncButton}
          onPress={handleSync}
          disabled={isSyncing}>
          <Text style={styles.buttonText}>Sincronizar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.syncButton}
          onPress={handleSyncClear}
          disabled={isSyncing}>
          <Text style={styles.buttonText}>Limpar dados</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.shareButton}
          onPress={shareDatabaseFile}
          disabled={isSyncing}>
          <Text style={styles.buttonText}>Compartilhar banco</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  animationContainer: {
    alignItems: 'center',
    flex: 1,
  },
  lottieLarge: {
    width: 150,
    height: 150,
  },
  lottieSmall: {
    width: 400,
    height: 70,
  },
  buttonContainer: {
    width: '80%',
  },
  syncButton: {
    backgroundColor: colors.confirmButton,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    margin: 5,
  },
  shareButton: {
    backgroundColor: colors.arcGreen,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    margin: 5,
  },
  buttonText: {
    color: colors.white,
  },
});
