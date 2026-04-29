import {useMutation, useQueryClient} from '@tanstack/react-query';

import {useAppStore} from '@/shared/store/useAppStore';

import {SettingsController} from '../controllers/settings.controller';
import {settingsQueryKeys} from '../query-keys/settings.query-keys';
import {localParametersSchema} from '../schemas/local-parameter.schema';
import {LocalParameter} from '../types/local-parameter.types';

const controller = new SettingsController();

export function useSaveLocalParameterMutation() {
  const queryClient = useQueryClient();
  const setLocalParameters = useAppStore(state => state.setLocalParameters);

  return useMutation({
    mutationFn: async (parameter: LocalParameter) => {
      const parsedParameter = localParametersSchema.element.parse(parameter);
      const result = await controller.saveLocalParameter(parsedParameter);
      return localParametersSchema.parse(result);
    },
    onSuccess: async result => {
      setLocalParameters(result);
      queryClient.setQueryData(settingsQueryKeys.localParameters(), result);
      await queryClient.invalidateQueries({
        queryKey: settingsQueryKeys.localParameters(),
      });
    },
  });
}
