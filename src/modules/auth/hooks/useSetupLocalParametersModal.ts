import {useAppStorage} from '@/modules/storage/hooks/useAppStorage';
import {useAppStorageActions} from '@/modules/storage/hooks/useAppStorageActions';

export function useSetupLocalParametersModal() {
  const {biometricsEnabled} = useAppStorage();
  const {setBiometricsEnabled} = useAppStorageActions();

  return {
    biometricsEnabled,
    handlers: {
      setBiometricsEnabled: async (value: boolean) => {
        await setBiometricsEnabled(value);
      },
    },
  };
}
