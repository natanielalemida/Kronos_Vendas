import {Alert} from 'react-native';
import ApiInstace from '../../../../api/ApiInstace';
import {MainResponse} from '../type';
import {setAuth, setNomeUsuario} from '../../../../storage';
import runSync from '../../../../sync/runSync/runSync';
import {
  getTerminal,
  setEmpresa,
  setTerminal,
} from '../../../../storage/empresaStorage';
import {useNavigation} from '@react-navigation/native';
import {useState} from 'react';
import {useCliente} from '../../../menu/components/Clientes/context/clientContext';
import UseGetMunicipio from '../../../menu/components/Clientes/components/criarOuEditarUsuario/hooks/useGetMunicipio';
import {SettingsRepository} from '../../components/selectHost/repository';

export function UseLogin() {
  const [progress, setProgress] = useState<{}>();
  const navigation = useNavigation();
  const {
    setUsuario,
    setOrganizationCode,
    setEmpresa: setEmpresaContext,
  } = useCliente();

  const verify = async (
    data: MainResponse,
    organizationCode: number,
    cpf: string,
    terminal: number,
  ) => {
    const successfully = Array.isArray(data.Mensagens);
    if (!successfully) {
      //@ts-ignore
      Alert.alert('Falha ao realizar login', `${data.mensagens[0].conteudo}`);
      setProgress(undefined);
      return;
    }

    const empresa = await ApiInstace.openUrl({
      method: 'get',
      endPoint: `arc/empresa/${organizationCode}`,
      data: undefined,
      headers: undefined,
    });

    const successfullyEmpresa = Array.isArray(empresa.Mensagens);

    if (successfullyEmpresa) {
      setEmpresaContext(empresa.Resultado);
    }

    await setNomeUsuario(cpf);
    await setAuth(JSON.stringify(data.Resultado.Usuario));
    setUsuario(data.Resultado.Usuario);
    await setEmpresa(JSON.stringify(organizationCode));
    await setTerminal(JSON.stringify(terminal));
    setOrganizationCode(organizationCode);

    const sincronizar = new runSync(
      data.Resultado.Usuario,
      organizationCode,
      setProgress,
    );
    await sincronizar.iniciarSincronizacao();
    setProgress(undefined);
    // @ts-ignore
    navigation.navigate('Menu');
  };

  const handleLogin = async (
    cpf: string | undefined,
    password: string | undefined,
    organizationCode: number | undefined,
  ) => {
    if (!cpf || !password || !organizationCode) return;

    const repositorySettings = new SettingsRepository();

    const {terminal} = await repositorySettings.get();

    setProgress({message: 'Conectando com servidor...'});

    const data = await ApiInstace.openUrl({
      method: 'post',
      endPoint: 'arc/usuario/login',
      data: {
        Login: cpf,
        Senha: password,
        Aplicacao: 6,
        codigoEmpresa: organizationCode,
        NumeroTerminal: terminal,
      },
      headers: undefined,
    });

    setProgress({message: 'Iniciando sincronização...'});

    verify(data, organizationCode, cpf, terminal);
  };

  return {
    handleLogin,
    progress,
  };
}
