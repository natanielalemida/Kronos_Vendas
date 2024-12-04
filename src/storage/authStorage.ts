import AsyncStorage from '@react-native-async-storage/async-storage';
import {UsuarioDto} from '../modules/login/hooks/type';

export async function setAuth(params: string) {
  await AsyncStorage.setItem('auth', params);
}

export async function setNomeUsuario(params: string) {
  await AsyncStorage.removeItem('nomeUsuario');
  await AsyncStorage.setItem('nomeUsuario', params);
}

export async function getNomeUsuario() {
  const data = await AsyncStorage.getItem('nomeUsuario');
  return data;
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
