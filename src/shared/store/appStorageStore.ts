import {create} from 'zustand';

import {AppStorageService} from '@/modules/storage/services/app-storage.service';
import {OrganizationOption, UserDto} from '@/shared/types';
import {
  ConnectionOption,
  StoredCredentials,
} from '@/modules/storage/types/app-storage.types';

type AppStorageState = {
  hasHydrated: boolean;
  authenticatedUser?: UserDto;
  storedCredentials?: StoredCredentials;
  offlineOrganization?: OrganizationOption;
  activeConnectionId?: number;
  companyCode?: number;
  terminal?: number;
  biometricsEnabled: boolean;
  syncProductImagesEnabled: boolean;
  connectionOptions: ConnectionOption[];
  hydrate: () => Promise<void>;
  setAuthenticatedUser: (user: UserDto) => Promise<void>;
  setStoredCredentials: (credentials: StoredCredentials) => Promise<void>;
  setOfflineOrganization: (organization: OrganizationOption) => Promise<void>;
  setActiveConnectionId: (
    activeConnectionId: number | undefined,
  ) => Promise<void>;
  setCompanyCode: (companyCode: number) => Promise<void>;
  setTerminal: (terminal: number) => Promise<void>;
  setBiometricsEnabled: (enabled: boolean) => Promise<void>;
  setSyncProductImagesEnabled: (enabled: boolean) => Promise<void>;
  upsertConnectionOption: (connection: ConnectionOption) => Promise<void>;
  removeConnectionOption: (connectionId: number) => Promise<void>;
};

const appStorageService = new AppStorageService();

export const useAppStorageStore = create<AppStorageState>(set => ({
  hasHydrated: false,
  authenticatedUser: undefined,
  storedCredentials: undefined,
  offlineOrganization: undefined,
  activeConnectionId: undefined,
  companyCode: undefined,
  terminal: undefined,
  biometricsEnabled: false,
  syncProductImagesEnabled: false,
  connectionOptions: [],
  hydrate: async () => {
    const snapshot = await appStorageService.loadSnapshot();

    set({
      hasHydrated: true,
      authenticatedUser: snapshot.authenticatedUser,
      storedCredentials: snapshot.storedCredentials,
      offlineOrganization: snapshot.offlineOrganization,
      activeConnectionId: snapshot.activeConnectionId,
      companyCode: snapshot.companyCode,
      terminal: snapshot.terminal,
      biometricsEnabled: snapshot.biometricsEnabled,
      syncProductImagesEnabled: snapshot.syncProductImagesEnabled,
      connectionOptions: snapshot.connectionOptions,
    });
  },
  setAuthenticatedUser: async authenticatedUser => {
    await appStorageService.saveAuthenticatedUser(authenticatedUser);
    set({authenticatedUser});
  },
  setStoredCredentials: async storedCredentials => {
    await appStorageService.saveStoredCredentials(storedCredentials);
    set({storedCredentials});
  },
  setOfflineOrganization: async offlineOrganization => {
    await appStorageService.saveOfflineOrganization(offlineOrganization);
    set({offlineOrganization});
  },
  setActiveConnectionId: async activeConnectionId => {
    await appStorageService.saveActiveConnectionId(activeConnectionId);
    set({activeConnectionId});
  },
  setCompanyCode: async companyCode => {
    await appStorageService.saveCompanyCode(companyCode);
    set({companyCode});
  },
  setTerminal: async terminal => {
    await appStorageService.saveTerminal(terminal);
    set({terminal});
  },
  setBiometricsEnabled: async biometricsEnabled => {
    await appStorageService.saveBiometricsEnabled(biometricsEnabled);
    set({biometricsEnabled});
  },
  setSyncProductImagesEnabled: async syncProductImagesEnabled => {
    await appStorageService.saveSyncProductImagesEnabled(
      syncProductImagesEnabled,
    );
    set({syncProductImagesEnabled});
  },
  upsertConnectionOption: async connectionOption => {
    let nextConnectionOptions: ConnectionOption[] = [];

    set(currentState => {
      const currentConnectionIndex = currentState.connectionOptions.findIndex(
        storedConnection => storedConnection.id === connectionOption.id,
      );

      nextConnectionOptions =
        currentConnectionIndex >= 0
          ? currentState.connectionOptions.map(storedConnection =>
              storedConnection.id === connectionOption.id
                ? {
                    ...storedConnection,
                    ...connectionOption,
                  }
                : storedConnection,
            )
          : [...currentState.connectionOptions, connectionOption];

      return {
        connectionOptions: nextConnectionOptions,
      };
    });

    await appStorageService.saveConnectionOptions(nextConnectionOptions);
  },
  removeConnectionOption: async connectionId => {
    let nextConnectionOptions: ConnectionOption[] = [];

    set(currentState => {
      nextConnectionOptions = currentState.connectionOptions.filter(
        connectionOption => connectionOption.id !== connectionId,
      );

      return {
        connectionOptions: nextConnectionOptions,
      };
    });

    await appStorageService.saveConnectionOptions(nextConnectionOptions);
  },
}));
