import NetInfo from '@react-native-community/netinfo';

export async function checkInternetConnection(): Promise<boolean> {
  const state = await NetInfo.fetch();
  return state.isConnected && state.isInternetReachable;
}
