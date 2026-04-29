import {useAppStorageStore} from '@/shared/store/appStorageStore';
import {OrganizationOption, UserDto} from '@/shared/types';
import {ConnectionOption, StoredCredentials} from '../types/app-storage.types';

export class AppStorageGateway {
  static async hydrate(): Promise<void> {
    await useAppStorageStore.getState().hydrate();
  }

  static async ensureHydrated(): Promise<void> {
    if (!useAppStorageStore.getState().hasHydrated) {
      await AppStorageGateway.hydrate();
    }
  }

  static async setAuthenticatedUser(user: UserDto): Promise<void> {
    await useAppStorageStore.getState().setAuthenticatedUser(user);
  }

  static async setStoredCredentials(
    credentials: StoredCredentials,
  ): Promise<void> {
    await useAppStorageStore.getState().setStoredCredentials(credentials);
  }

  static async setOfflineOrganization(
    organization: OrganizationOption,
  ): Promise<void> {
    await useAppStorageStore.getState().setOfflineOrganization(organization);
  }

  static async setActiveConnectionId(
    activeConnectionId: number | undefined,
  ): Promise<void> {
    await useAppStorageStore
      .getState()
      .setActiveConnectionId(activeConnectionId);
  }

  static async setCompanyCode(companyCode: number): Promise<void> {
    await useAppStorageStore.getState().setCompanyCode(companyCode);
  }

  static async setTerminal(terminal: number): Promise<void> {
    await useAppStorageStore.getState().setTerminal(terminal);
  }

  static async setSyncProductImagesEnabled(enabled: boolean): Promise<void> {
    await useAppStorageStore.getState().setSyncProductImagesEnabled(enabled);
  }

  static async getAuthenticatedUser(): Promise<UserDto | undefined> {
    await AppStorageGateway.ensureHydrated();
    return useAppStorageStore.getState().authenticatedUser;
  }

  static async getStoredCredentials(): Promise<StoredCredentials | undefined> {
    await AppStorageGateway.ensureHydrated();
    return useAppStorageStore.getState().storedCredentials;
  }

  static async getOfflineOrganization(): Promise<
    OrganizationOption | undefined
  > {
    await AppStorageGateway.ensureHydrated();
    return useAppStorageStore.getState().offlineOrganization;
  }

  static async getActiveConnectionId(): Promise<number | undefined> {
    await AppStorageGateway.ensureHydrated();
    return useAppStorageStore.getState().activeConnectionId;
  }

  static async getCompanyCode(): Promise<number | undefined> {
    await AppStorageGateway.ensureHydrated();
    return useAppStorageStore.getState().companyCode;
  }

  static async getTerminal(): Promise<number | undefined> {
    await AppStorageGateway.ensureHydrated();
    return useAppStorageStore.getState().terminal;
  }

  static async getSyncProductImagesEnabled(): Promise<boolean | undefined> {
    await AppStorageGateway.ensureHydrated();
    return useAppStorageStore.getState().syncProductImagesEnabled;
  }

  static async getConnectionOptions(): Promise<ConnectionOption[]> {
    await AppStorageGateway.ensureHydrated();
    return useAppStorageStore.getState().connectionOptions;
  }

  static async getActiveConnection(): Promise<ConnectionOption | undefined> {
    await AppStorageGateway.ensureHydrated();

    const {activeConnectionId, connectionOptions} =
      useAppStorageStore.getState();

    if (activeConnectionId === undefined) {
      return undefined;
    }

    return connectionOptions.find(
      connectionOption => connectionOption.id === activeConnectionId,
    );
  }

  static async upsertConnectionOption(
    connectionOption: ConnectionOption,
  ): Promise<void> {
    await useAppStorageStore
      .getState()
      .upsertConnectionOption(connectionOption);
  }

  static async removeConnectionOption(connectionId: number): Promise<void> {
    await useAppStorageStore.getState().removeConnectionOption(connectionId);
  }
}
