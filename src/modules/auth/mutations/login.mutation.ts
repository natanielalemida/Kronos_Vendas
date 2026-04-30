import {Alert, InteractionManager} from 'react-native';
import {CommonActions, useNavigation} from '@react-navigation/native';

import {useAppStorage} from '@/modules/storage/hooks/useAppStorage';
import {useAppStorageActions} from '@/modules/storage/hooks/useAppStorageActions';
import {logger} from '@/shared/utils/logger';
import {useSyncExecution} from '@/modules/sync/hooks/useSyncExecution';
import {UserDto} from '@/shared/types';
import {useAuthStore} from '@/shared/store/authStore';
import {useAppStore} from '@/shared/store/useAppStore';
import {SyncSessionService} from '@/modules/sync/services/sync-session.service';
import {RootNavigationProp} from '@/app/navigation/types/root-navigation.types';

import {LoginSessionRepository} from '../repositories/login-session.repository';
import {AuthService} from '../services/auth.service';
import {LoginResponseDto} from '../dto/login-response.dto';
import {loginFormSchema} from '../schemas/login.schema';
import {
  LoginMutationResult,
  LoginSuccessPayload,
} from '../types/login-page.types';

const authService = new AuthService();
const syncSessionService = new SyncSessionService();

export function useLoginMutation(): LoginMutationResult {
  const navigation = useNavigation<RootNavigationProp<'Login'>>();
  const setSession = useAuthStore(state => state.setSession);
  const {progress} = useSyncExecution();
  const {terminal: storedTerminal} = useAppStorage();
  const {
    setAuthenticatedUser,
    setCompanyCode: setStoredCompanyCode,
    setStoredCredentials,
    setTerminal: setStoredTerminal,
  } = useAppStorageActions();
  const {
    setUser,
    setOrganizationCode,
    setCompany: setCompanyContext,
  } = useAppStore();

  const loginSessionRepository = new LoginSessionRepository();

  const navigateToMenu = () => {
    InteractionManager.runAfterInteractions(() => {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Menu'}],
        }),
      );
    });
  };

  const showAlert = (title: string, message: string) => {
    Alert.alert(title, message);
  };

  const handleSaveLogin = (user: UserDto, password: string) => {
    loginSessionRepository.saveUser(user, password);
  };

  const handleCompanyFallback = async () => {
    const result = await loginSessionRepository.getCompany();

    if (!result) {
      Alert.alert('Empresa offline não salva');
      return;
    }

    setCompanyContext(result);
  };

  const persistAuthenticatedSession = async ({
    cpf,
    organizationCode,
    password,
    terminal,
    user,
  }: LoginSuccessPayload) => {
    await setStoredCredentials({login: cpf, password});
    await setAuthenticatedUser(user);
    setUser(user);
    setSession({
      isAuthenticated: true,
      organizationCode,
      username: user.Login,
    });
    await setStoredCompanyCode(organizationCode);
    await setStoredTerminal(terminal);
    setOrganizationCode(organizationCode);
  };

  const verifyLoginResponse = async (
    data: LoginResponseDto,
    cpf: string,
    organizationCode: number,
    password: string,
    terminal: number,
  ) => {
    const successfully = data.Status === 1 && !!data.Resultado?.Usuario;

    if (!successfully) {
      const errorMessage = data.Mensagens?.[0] || 'Erro desconhecido';
      showAlert('Falha ao realizar login', errorMessage);
      return;
    }

    if (!data.Resultado?.Usuario) {
      return;
    }

    const user = data.Resultado.Usuario;

    try {
      const company = await authService.getCompany(organizationCode);

      if (!company) {
        throw new Error('Empresa não encontrada');
      }

      const hasCompanyMessages = Array.isArray(company.Mensagens);

      if (hasCompanyMessages) {
        setCompanyContext(company.Resultado);
        await loginSessionRepository.saveCompany(
          JSON.stringify(company.Resultado),
          String(company.Resultado.Codigo),
        );
      }

      await handleSaveLogin(user, password);
      await persistAuthenticatedSession({
        cpf,
        organizationCode,
        password,
        terminal,
        user,
      });
      syncSessionService.reset();
      navigateToMenu();
    } catch (error) {
      logger.error('Login', 'Fallback login flow failed after remote company sync.', error);
      await handleCompanyFallback();
      await persistAuthenticatedSession({
        cpf,
        organizationCode,
        password,
        terminal,
        user,
      });
      syncSessionService.reset();
      navigateToMenu();
    }
  };

  const handleOfflineLogin = async (cpf: string, password: string) => {
    const user = await loginSessionRepository.getUser(cpf, password);

    if (!user) {
      return {
        Resultado: undefined,
        Status: 6,
        Mensagens: ['Usuário ou senha inválido, por favor, verifique!'],
      } satisfies LoginResponseDto;
    }

    return {
      Resultado: {Usuario: user},
      Status: 1,
      Mensagens: [],
    } satisfies LoginResponseDto;
  };

  const login = async (
    cpf: string | undefined,
    password: string | undefined,
    organizationCode: number | undefined,
  ) => {
    const parsedForm = loginFormSchema.safeParse({
      cpf,
      organizationCode,
      password,
    });

    if (!parsedForm.success) {
      const issue = parsedForm.error.issues[0];
      showAlert('Falha ao realizar login', issue?.message ?? 'Dados inválidos');
      return;
    }

    const {
      cpf: parsedCpf,
      organizationCode: parsedOrganizationCode,
      password: parsedPassword,
    } = parsedForm.data;
    const terminal = storedTerminal ?? 0;

    try {
      const response = await authService.login({
        Aplicacao: 6,
        Login: parsedCpf,
        NumeroTerminal: terminal,
        Senha: parsedPassword,
        codigoEmpresa: parsedOrganizationCode,
      });

      if (!response) {
        throw new Error('Falha ao realizar login');
      }

      await verifyLoginResponse(
        response,
        parsedCpf,
        parsedOrganizationCode,
        parsedPassword,
        terminal,
      );
    } catch (error) {
      logger.error('Login', 'Primary login request failed.', error);

      if (error instanceof Error && error.message.includes('Network Error')) {
        const offlineResponse = await handleOfflineLogin(
          parsedCpf,
          parsedPassword,
        );
        await verifyLoginResponse(
          offlineResponse,
          parsedCpf,
          parsedOrganizationCode,
          parsedPassword,
          terminal,
        );
        return;
      }

      throw error;
    }
  };

  return {
    login,
    progress,
  };
}
