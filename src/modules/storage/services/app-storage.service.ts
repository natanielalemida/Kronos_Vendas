import AsyncStorage from '@react-native-async-storage/async-storage';
import {OrganizationOption, UserDto} from '@/shared/types';

import {
  AppStorageSnapshot,
  ConnectionOption,
  StoredCredentials,
} from '../types/app-storage.types';

const STORAGE_KEYS = {
  authenticatedUser: 'auth',
  storedCredentials: 'userCredentials',
  offlineOrganization: 'organizacaoOffline',
  activeConnectionId: 'activeConnectionId',
  companyCode: 'empresa',
  terminal: 'terminal',
  biometricsEnabled: 'usaBiometria',
  syncProductImagesEnabled: 'syncImages',
  connectionOptions: 'connectionOptions',
  compatibilityConnectionOptions: 'listaDeConexoes',
} as const;

function parseJsonValue<T>(value: string | null, fallbackValue: T): T {
  if (!value) {
    return fallbackValue;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallbackValue;
  }
}

export class AppStorageService {
  async loadSnapshot(): Promise<AppStorageSnapshot> {
    const [
      authenticatedUser,
      storedCredentials,
      offlineOrganization,
      activeConnectionId,
      companyCode,
      terminal,
      biometricsEnabled,
      syncProductImagesEnabled,
      connectionOptions,
      compatibilityConnectionOptions,
    ] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEYS.authenticatedUser),
      AsyncStorage.getItem(STORAGE_KEYS.storedCredentials),
      AsyncStorage.getItem(STORAGE_KEYS.offlineOrganization),
      AsyncStorage.getItem(STORAGE_KEYS.activeConnectionId),
      AsyncStorage.getItem(STORAGE_KEYS.companyCode),
      AsyncStorage.getItem(STORAGE_KEYS.terminal),
      AsyncStorage.getItem(STORAGE_KEYS.biometricsEnabled),
      AsyncStorage.getItem(STORAGE_KEYS.syncProductImagesEnabled),
      AsyncStorage.getItem(STORAGE_KEYS.connectionOptions),
      AsyncStorage.getItem(STORAGE_KEYS.compatibilityConnectionOptions),
    ]);

    const parsedConnectionOptions = parseJsonValue<ConnectionOption[]>(
      connectionOptions,
      [],
    );
    const fallbackConnectionOptions = parseJsonValue<ConnectionOption[]>(
      compatibilityConnectionOptions,
      [],
    );

    return {
      authenticatedUser: parseJsonValue<UserDto | undefined>(
        authenticatedUser,
        undefined,
      ),
      storedCredentials: parseJsonValue<StoredCredentials | undefined>(
        storedCredentials,
        undefined,
      ),
      offlineOrganization: parseJsonValue<OrganizationOption | undefined>(
        offlineOrganization,
        undefined,
      ),
      activeConnectionId: parseJsonValue<number | undefined>(
        activeConnectionId,
        undefined,
      ),
      companyCode: parseJsonValue<number | undefined>(companyCode, undefined),
      terminal: parseJsonValue<number | undefined>(terminal, undefined),
      biometricsEnabled: parseJsonValue<boolean>(biometricsEnabled, false),
      syncProductImagesEnabled: parseJsonValue<boolean>(
        syncProductImagesEnabled,
        false,
      ),
      connectionOptions:
        parsedConnectionOptions.length > 0
          ? parsedConnectionOptions
          : fallbackConnectionOptions,
    };
  }

  async saveAuthenticatedUser(user: UserDto): Promise<void> {
    await AsyncStorage.setItem(
      STORAGE_KEYS.authenticatedUser,
      JSON.stringify(user),
    );
  }

  async saveStoredCredentials(credentials: StoredCredentials): Promise<void> {
    await AsyncStorage.setItem(
      STORAGE_KEYS.storedCredentials,
      JSON.stringify(credentials),
    );
  }

  async saveOfflineOrganization(
    organization: OrganizationOption,
  ): Promise<void> {
    await AsyncStorage.setItem(
      STORAGE_KEYS.offlineOrganization,
      JSON.stringify(organization),
    );
  }

  async saveCompanyCode(companyCode: number): Promise<void> {
    await AsyncStorage.setItem(
      STORAGE_KEYS.companyCode,
      JSON.stringify(companyCode),
    );
  }

  async saveActiveConnectionId(
    activeConnectionId: number | undefined,
  ): Promise<void> {
    if (activeConnectionId === undefined) {
      await AsyncStorage.removeItem(STORAGE_KEYS.activeConnectionId);
      return;
    }

    await AsyncStorage.setItem(
      STORAGE_KEYS.activeConnectionId,
      JSON.stringify(activeConnectionId),
    );
  }

  async saveTerminal(terminal: number): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.terminal, JSON.stringify(terminal));
  }

  async saveBiometricsEnabled(enabled: boolean): Promise<void> {
    await AsyncStorage.setItem(
      STORAGE_KEYS.biometricsEnabled,
      JSON.stringify(enabled),
    );
  }

  async saveSyncProductImagesEnabled(enabled: boolean): Promise<void> {
    await AsyncStorage.setItem(
      STORAGE_KEYS.syncProductImagesEnabled,
      JSON.stringify(enabled),
    );
  }

  async saveConnectionOptions(
    connectionOptions: ConnectionOption[],
  ): Promise<void> {
    const serializedConnectionOptions = JSON.stringify(connectionOptions);

    await Promise.all([
      AsyncStorage.setItem(
        STORAGE_KEYS.connectionOptions,
        serializedConnectionOptions,
      ),
      AsyncStorage.setItem(
        STORAGE_KEYS.compatibilityConnectionOptions,
        serializedConnectionOptions,
      ),
    ]);
  }
}
