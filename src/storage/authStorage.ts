import AsyncStorage from '@react-native-async-storage/async-storage';
import {UsuarioDto} from '../modules/login/hooks/type';

export async function setAuth(params: string) {
  await AsyncStorage.setItem('auth', params);
}

export async function getAuth(): Promise<UsuarioDto> {
  const data = await AsyncStorage.getItem('auth');
  return JSON.parse(data as string);
}
