import RNBiometrics from 'react-native-simple-biometrics';
import {
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useCallback, useEffect, useState} from 'react';
import {styles} from './styles';
import Input from './components/input/Input';
import {KronosIcon} from '../../assets/login/KronosVendaIcon';
import Select from './components/select/Select';
import {createSettingsTable} from '../../database/migration/createSettingsMigration';
import {organizationLoginDto} from './dto';
import {LoadingLogin} from '../components/loading';
import {useFetch} from './hooks/login';
import {ShowIf} from '../components/showIf'; // Ajuste o caminho conforme necessário
import {useFocusEffect} from '@react-navigation/native';
import {UseLogin} from './hooks/login/useLogin';
import {createProductsMigration} from '../../database/migration/createProductsMigration';
import {createCondicaoPagamentoTable} from '../../database/migration/createCondicaoPagamento';
import {createFormaPagamentoTable} from '../../database/migration/createFormaPagamento';
import {createCategoriaTable} from '../../database/migration/createCategoriaMigration';
import {createRegiaoTable} from '../../database/migration/CreateReigaoMigration';
import {createPessoaTable} from '../../database/migration/createClienteMigration';
import {createMunicipioTable} from '../../database/migration/createMunicipioMigration';
import {createEnderecoTable} from '../../database/migration/createEnderecoMigration';
import {createLocalParamsSettings} from '../../database/migration/createLocalParamsSettings';
import {createContatoTable} from '../../database/migration/createContatoMigration';
import {createPedidoTable} from '../../database/migration/createPedidoMigration';
import {createPedidoVinculoMeioPagamentoTable} from '../../database/migration/createPedidoVinculoMeioPagamentoMigration';
import {createPedidoVinculoProdutoTable} from '../../database/migration/createPedidoVinculoProdutoMigration';
import {getLoginESenha} from '../../storage';
import Loading from '../components/loading/Loading';
import {
  createEmpresaJson,
  createPrivilegiosMigration,
  createUsuariosMigration,
} from '../../database/migration/createLoginMigration';
import {createProductsImageMigration} from '../../database/migration/createProducImageMigration';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {colors} from '../styles';

const {width, height} = Dimensions.get('window');

export default function Login({navigation}) {
  const [cpf, setCpf] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [organization, setOrganization] = useState<string>();
  const [organizationCode, setOrganizationCode] = useState<number>();
  const [showPassword, setShowPassword] = useState(true);
  const [lastPassword, setLastPassword] = useState();
  const [ref, setRef] = useState('Usuário');
  const [usaBiometria, setUsaBiometria] = useState(false);

  const makeLogin = async (cpfLogin, passwordLogin) => {
    const can = await RNBiometrics.canAuthenticate();

    if (can) {
      try {
        const result = await RNBiometrics.requestBioAuth(
          'Autenticação Kronos vendas',
          'Use a biometria ou informe senha',
        );

        if (result) {
          await handleLogin(cpfLogin, passwordLogin, organizationCode);
        }
      } catch (error) {
        // Code to handle authentication failure
        // ...
      }
    }
  };

  // Novo estado para controle da visibilidade do teclado
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const handleChangeOrganization = (value: organizationLoginDto) => {
    setOrganization(value.NomeFantasia || '');
    setOrganizationCode(value.Codigo || 0);
  };

  const {organizations, isLoadingOrganization, getOrganizations} = useFetch(
    handleChangeOrganization,
  );
  const {handleLogin, progress} = UseLogin();

  const handleSetLastUser = async () => {
    const {login, senha} = await getLoginESenha();

    if (login) {
      setCpf(login);
    }

    if (senha) {
      setLastPassword(senha);
      await makeLogin(login, senha);
    }
  };
  const loadSyncStatus = async () => {
    try {
      const value = await AsyncStorage.getItem('usaBiometria');
      if (value !== null) {
        setUsaBiometria(JSON.parse(value));
      }
    } catch (error) {
      console.error('Erro ao carregar a configuração:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getOrganizations();
      loadSyncStatus();
      return () => {
        // Limpeza aqui
      };
    }, []),
  );

  useEffect(() => {
    if (organizationCode) {
      handleSetLastUser();
    }
  }, [organizationCode]);

  useEffect(() => {
    createSettingsTable();
    createProductsMigration();
    createFormaPagamentoTable();
    createCondicaoPagamentoTable();
    createCategoriaTable();
    createRegiaoTable();
    createPessoaTable();
    createMunicipioTable();
    createEnderecoTable();
    createLocalParamsSettings();
    createContatoTable();
    createPedidoTable();
    createPedidoVinculoMeioPagamentoTable();
    createPedidoVinculoProdutoTable();
    createProductsImageMigration();
    createUsuariosMigration();
    createPrivilegiosMigration();
    createEmpresaJson();
  }, []);

  // UseEffect para adicionar listeners ao teclado
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const loginLabelHeight =
    isKeyboardVisible && lastPassword && usaBiometria
      ? height * 0.2
      : undefined;

  const infoContainerHeight =
    isKeyboardVisible && lastPassword && usaBiometria
      ? height * 0.40
      : isKeyboardVisible
      ? height * 0.40
      : lastPassword && usaBiometria
      ? height * 0.4
      : undefined;

  const buttonAuthHeight =
    lastPassword && usaBiometria ? height * 0.045 : undefined;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.loginContainer}>
      <StatusBar translucent backgroundColor={'transparent'} />
      <TouchableOpacity
        style={styles.settingsIconTop}
        onPress={() => navigation.navigate('Settings')}>
        <Icon name="settings" size={25} color={colors.arcGreen400} />
      </TouchableOpacity>
      <View
        style={[
          styles.loginLabelContainer,
          loginLabelHeight && {height: loginLabelHeight},
        ]}>
        <Image source={KronosIcon} style={styles.loginImage} />
        <Text style={styles.KronosFood}>Kronos Vendas</Text>
      </View>

      <ShowIf condition={!!progress}>
        <LoadingLogin progress={progress} />
      </ShowIf>

      <ShowIf condition={isLoadingOrganization}>
        <Loading isModalLoadingActive={isLoadingOrganization} />
      </ShowIf>

      <ShowIf
        condition={!progress}
        style={[
          styles.loginContainerInformations,
          isKeyboardVisible && {height: height * 0.33},
        ]}>
        <Select
          leftIcon="business"
          leftColor="black"
          leftSize={25}
          placeholder="Selecione uma empresa"
          value={organization}
          onTextChange={value => handleChangeOrganization(value)}
          inputWidth="90%"
          rightColor="black"
          rightSize={25}
          rightIcon="chevron-down"
          data={organizations}
        />
        <Input
          refName={ref}
          leftIcon="person"
          value={cpf}
          onChangeText={value => setCpf(value)}
          onEndEditing={() => setRef('Senha')}
          leftColor="black"
          leftSize={25}
          placeholder="CPF"
          inputWidth="90%"
        />
        <Input
          refName={ref}
          leftIcon="lock-closed"
          password={showPassword}
          value={password}
          onChangeText={value => setPassword(value)}
          leftColor="black"
          leftSize={25}
          placeholder="Senha"
          inputWidth="90%"
          rightColor="black"
          rightSize={25}
          rightIcon={showPassword ? 'eye-outline' : 'eye-off'}
          onPressRigthIcon={() => setShowPassword(!showPassword)}
        />

        <View style={styles.buttonsLabel}>
          <TouchableOpacity
            style={[
              styles.buttonLabelAuthContainer,
              buttonAuthHeight && {height: buttonAuthHeight},
            ]}
            onPress={() => handleLogin(cpf, password, organizationCode)}>
            <Text style={styles.buttonAuth}>ENTRAR</Text>
          </TouchableOpacity>

          {lastPassword && !usaBiometria && (
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                backgroundColor: '#4a6463',
                width: width * 0.63,
                height: height * 0.043,
                borderRadius: 25,
                elevation: 4,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={handleSetLastUser}>
              <Icon
                style={styles.settingsIconPadding}
                name="finger-print"
                size={18}
                color="white"
              />
              <Text style={{color: 'white'}}>Login com biometria</Text>
            </TouchableOpacity>
          )}
        </View>
      </ShowIf>

      <Text style={styles.arcSolution}>Arc Solutions - 2024</Text>
    </KeyboardAvoidingView>
  );
}
