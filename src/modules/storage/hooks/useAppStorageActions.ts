import {useAppStorageStore} from '@/shared/store/appStorageStore';

export function useAppStorageActions() {
  const hydrate = useAppStorageStore(store => store.hydrate);
  const setAuthenticatedUser = useAppStorageStore(
    store => store.setAuthenticatedUser,
  );
  const setStoredCredentials = useAppStorageStore(
    store => store.setStoredCredentials,
  );
  const setOfflineOrganization = useAppStorageStore(
    store => store.setOfflineOrganization,
  );
  const setActiveConnectionId = useAppStorageStore(
    store => store.setActiveConnectionId,
  );
  const setCompanyCode = useAppStorageStore(store => store.setCompanyCode);
  const setTerminal = useAppStorageStore(store => store.setTerminal);
  const setBiometricsEnabled = useAppStorageStore(
    store => store.setBiometricsEnabled,
  );
  const setSyncProductImagesEnabled = useAppStorageStore(
    store => store.setSyncProductImagesEnabled,
  );
  const upsertConnectionOption = useAppStorageStore(
    store => store.upsertConnectionOption,
  );
  const removeConnectionOption = useAppStorageStore(
    store => store.removeConnectionOption,
  );

  return {
    hydrate,
    setAuthenticatedUser,
    setStoredCredentials,
    setOfflineOrganization,
    setActiveConnectionId,
    setCompanyCode,
    setTerminal,
    setBiometricsEnabled,
    setSyncProductImagesEnabled,
    upsertConnectionOption,
    removeConnectionOption,
  };
}
