import {useQuery} from '@tanstack/react-query';

import {SettingsController} from '../controllers/settings.controller';
import {settingsQueryKeys} from '../query-keys/settings.query-keys';
import {localParametersSchema} from '../schemas/local-parameter.schema';
import {LocalParameter} from '../types/local-parameter.types';

const controller = new SettingsController();

export function useLocalParametersQuery() {
  return useQuery<LocalParameter[], Error>({
    gcTime: 1000 * 60 * 30,
    queryFn: async () => {
      const result = await controller.getLocalParameters();
      return localParametersSchema.parse(result);
    },
    queryKey: settingsQueryKeys.localParameters(),
    staleTime: 1000 * 60 * 10,
  });
}
