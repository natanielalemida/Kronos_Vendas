import AsyncStorage from '@react-native-async-storage/async-storage';
import {UsuarioDto} from '../modules/login/hooks/type';

export async function setAuth(params: string) {
  await AsyncStorage.setItem('auth', params);
}

export async function setLoginESenha(login: string, senha: string) {
  const userCredentials = { login, senha };

  await AsyncStorage.removeItem('userCredentials');
  await AsyncStorage.setItem('userCredentials', JSON.stringify(userCredentials));
}

// Função para obter login e senha juntos
export async function getLoginESenha() {
  const data = await AsyncStorage.getItem('userCredentials');
  return data ? JSON.parse(data) : null;
}


export async function getAuth(): Promise<UsuarioDto> {
  const data = await AsyncStorage.getItem('auth');
  return JSON.parse(data as string);
}

export async function setOrganizacaoOffline(params: string) {
  await AsyncStorage.removeItem('organizacaoOffline');
  await AsyncStorage.setItem('organizacaoOffline', params);
}

export async function getOrganizacaoOffline(): Promise<UsuarioDto> {
  const data = await AsyncStorage.getItem('organizacaoOffline');
  return JSON.parse(data as string);
}
