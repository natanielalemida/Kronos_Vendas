import {
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
import {getNomeUsuario} from '../../storage';
import Loading from '../components/loading/Loading';

export default function Login({navigation}) {
  const [cpf, setCpf] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [organization, setOrganization] = useState<string>();
  const [organizationCode, setOrganizationCode] = useState<number>();
  const [showPassword, setShowPassword] = useState(true);
  const [ref, setRef] = useState('Usuário');

  // Novo estado para controle da visibilidade do teclado
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const handleChangeOrganization = (value: organizationLoginDto) => {
    setOrganization(value.NomeFantasia || '');
    setOrganizationCode(value.Codigo || 0);
  };

  const {organizations, isLoadingOrganization, getOrganizations} = useFetch();
  const {handleLogin, progress} = UseLogin();

  const handleSetLastUser = async () => {
    const nome = await getNomeUsuario();

    if (!nome) return;
    setCpf(nome);
  };

  useFocusEffect(
    useCallback(() => {
      getOrganizations();
      return () => {
        // Limpeza aqui
      };
    }, []),
  );

  useEffect(() => {
    handleSetLastUser();
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.loginContainer}>
      <StatusBar translucent backgroundColor={'transparent'} />
      <View style={styles.loginLabelContainer}>
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
          isKeyboardVisible && {height: '50%'},
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
            style={styles.buttonLabelAuthContainer}
            onPress={() => handleLogin(cpf, password, organizationCode)}>
            <Text style={styles.buttonAuth}>ENTRAR</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.magin}
            onPress={() => navigation.navigate('Settings')}>
            <View style={styles.buttonSettingsContainer}>
              <Icon
                style={styles.settingsIconPadding}
                name="settings"
                size={25}
                color="black"
              />
              <Text style={styles.settingsText}>Configurações</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ShowIf>

      <Text style={styles.arcSolution}>Arc Solutions - 2024</Text>
    </KeyboardAvoidingView>
  );
}
