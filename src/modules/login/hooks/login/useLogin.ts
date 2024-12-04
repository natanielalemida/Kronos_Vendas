import {Alert} from 'react-native';
import ApiInstace from '../../../../api/ApiInstace';
import {MainResponse, ResultadoLoginDto} from '../type';
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
import SaveLoginRepository from '../../repository/saveLoginRepository';

export function UseLogin() {
  const [progress, setProgress] = useState<{}>();
  const navigation = useNavigation();
  const {
    setUsuario,
    setOrganizationCode,
    setEmpresa: setEmpresaContext,
  } = useCliente();

  const saveLoginRepository = new SaveLoginRepository();

  const verify = async (
    data: MainResponse,
    organizationCode: number,
    cpf: string,
    terminal: number,
    password: string,
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
    await handleSaveLogin(data.Resultado, password);
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
    organizationCode: number | undefined
  ) => {
    // Verificação inicial dos parâmetros
    if (!cpf || !password || !organizationCode) {
      console.error("CPF, senha ou código da organização estão ausentes.");
      return;
    }
    
    const repositorySettings = new SettingsRepository();
    const { terminal } = await repositorySettings.get();

    try {
  
  
      setProgress({ message: "Conectando com o servidor..." });
  
      // Tentativa de login online
      const data = await ApiInstace.openUrl({
        method: "post",
        endPoint: "arc/usuario/login",
        data: {
          Login: cpf,
          Senha: password,
          Aplicacao: 6,
          codigoEmpresa: organizationCode,
          NumeroTerminal: terminal,
        },
        headers: undefined,
      });
  
      setProgress({ message: "Iniciando sincronização..." });
  
      // Verificação e prosseguimento com os dados recebidos
      verify(data, organizationCode, cpf, terminal, password);
    } catch (error) {
      console.error("Erro durante o login:", error);
  
      if (error.message.includes("Network Error")) {
        // Login offline se houver problema de conexão
        console.warn("Sem conexão com a internet. Tentando login offline...");
        const data = await handleMakeLogin(cpf, password);
        console.log({data})
         verify(data, organizationCode, cpf, terminal, password);
      } else {
        // Repassar outros erros, se necessário
        throw error;
      }
    }
  };
  
  const handleSaveLogin = (resultado: ResultadoLoginDto, password: string) => {
    saveLoginRepository.saveUser(resultado.Usuario, password);
  };

  const handleMakeLogin = async (cpf: string, password: string) => {
    const user = await saveLoginRepository.getUser(cpf, password);
    if (!user) {
      return {
        resultado: null,
        status: 6,
        mensagens: [
          {
            codigo: 0,
            nivel: 2,
            conteudo: 'Usuário ou senha inválido, por favor, verifique!',
            conteudoAdicional: '',
          },
        ],
      };
    }
    return {
      Resultado: user,
      Status: 1,
      Mensagens: [],
    };
  };

  return {
    handleLogin,
    progress,
  };
}
