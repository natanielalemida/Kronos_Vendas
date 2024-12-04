import {Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import LottieView from 'lottie-react-native';
import {colors} from '../../../styles';
import UseMessageSync from './hooks/useMessageSync';
import UseSync from './hooks/useSync';
import useShareDatabase from './hooks/useShare';
import {useEffect, useRef, useState} from 'react';
import {useCliente} from '../Clientes/context/clientContext';
import {useNavigation} from '@react-navigation/native';
import EnviarClientes from '../../../enviarDados/cliente';
import {UsuarioDto} from '../../../login/hooks/type';
import Init from '../Produtos/hooks/init';
import SaveLoginRepository from '../../../login/repository/saveLoginRepository';

export default function Sincronizacao() {
  const navigation = useNavigation();
  const {isSyncing, setIsSyncing, usuario, organizationCode} = useCliente();
  const {progress, setProgress} = UseMessageSync();
  const {clean, limpar} = UseSync({setProgress});
  const {shareDatabaseFile} = useShareDatabase();

  const [ultimaSync, setUltimaSync] = useState(undefined)

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
    await limpar();
    setIsSyncing(false);
    animation.current?.reset();
    navigation.navigate('Novo Pedido');
  };

  function formatarData(data) {
    const options = { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false, 
    };
  
    const novaData = new Date(data);
  
    const dataFormatada = novaData.toLocaleString('pt-BR', options);
    const [dataParte, horaParte] = dataFormatada.split(' ');
  
    const [dia, mes, ano] = dataParte.split('/');
    const [hora, minuto] = horaParte.split(':');
  
    return `${dia}/${mes}/${ano} às ${hora}:${minuto}`;
  }

const getLastSyndec = async () => {
  const repository = new SaveLoginRepository()
  const dataUltima = await repository.getLastSync()


  if(!dataUltima) {
    setUltimaSync(undefined)
    return
  }
  const dataFormatada = formatarData(dataUltima)
  setUltimaSync(dataFormatada)
}

  Init({handleGetProdutos: getLastSyndec});

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
        
        <Text style={{color: 'black'}}>{`Ultima sincronização: ${ultimaSync ? ultimaSync : "Não informada"}`}</Text>
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
