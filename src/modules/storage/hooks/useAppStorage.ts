import {useAppStorageStore} from '@/shared/store/appStorageStore';

export function useAppStorage() {
  const hasHydrated = useAppStorageStore(store => store.hasHydrated);
  const authenticatedUser = useAppStorageStore(
    store => store.authenticatedUser,
  );
  const storedCredentials = useAppStorageStore(
    store => store.storedCredentials,
  );
  const offlineOrganization = useAppStorageStore(
    store => store.offlineOrganization,
  );
  const activeConnectionId = useAppStorageStore(
    store => store.activeConnectionId,
  );
  const companyCode = useAppStorageStore(store => store.companyCode);
  const terminal = useAppStorageStore(store => store.terminal);
  const biometricsEnabled = useAppStorageStore(
    store => store.biometricsEnabled,
  );
  const syncProductImagesEnabled = useAppStorageStore(
    store => store.syncProductImagesEnabled,
  );
  const connectionOptions = useAppStorageStore(
    store => store.connectionOptions,
  );

  return {
    hasHydrated,
    authenticatedUser,
    storedCredentials,
    offlineOrganization,
    activeConnectionId,
    companyCode,
    terminal,
    biometricsEnabled,
    syncProductImagesEnabled,
    connectionOptions,
  };
}
