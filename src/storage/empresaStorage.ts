import AsyncStorage from '@react-native-async-storage/async-storage';

export async function setEmpresa(params: string) {
  await AsyncStorage.setItem('empresa', params);
}

export async function setTerminal(params: string) {
  await AsyncStorage.removeItem('terminal');
  await AsyncStorage.setItem('terminal', params);
}

export async function getTerminal(): Promise<number> {
  const data = await AsyncStorage.getItem('terminal');
  return JSON.parse(data as string);
}

export async function getEmpresa(): Promise<number> {
  const data = await AsyncStorage.getItem('empresa');
  return JSON.parse(data as string);
}
