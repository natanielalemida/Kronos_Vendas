import AsyncStorage from '@react-native-async-storage/async-storage';

export async function setEmpresa(params: string) {
  await AsyncStorage.setItem('empresa', params);
}

export async function getEmpresa(): Promise<number> {
  const data = await AsyncStorage.getItem('empresa');
  return JSON.parse(data as string);
}
