import {useEffect} from 'react';

import {useAppStore} from '@/shared/store/useAppStore';

import {useSaveLocalParameterMutation} from '../mutations/save-local-parameter.mutation';
import {useLocalParametersQuery} from '../queries/local-parameters.query';
import {useSettingsPageStore} from '../stores/useSettingsPageStore';
import {UseSetupSettingsPageResult} from '../types/settings-page.types';

const ONLINE_ONLY_PARAMETER_NAME = 'UsarApenasOnline';

export function useSetupSettingsPage(): UseSetupSettingsPageResult {
  const query = useLocalParametersQuery();
  const mutation = useSaveLocalParameterMutation();
  const setLocalParameters = useAppStore(state => state.setLocalParameters);
  const isOnlineOnlyEnabled = useSettingsPageStore(
    state => state.isOnlineOnlyEnabled,
  );
  const setOnlineOnlyEnabled = useSettingsPageStore(
    state => state.setOnlineOnlyEnabled,
  );

  useEffect(() => {
    if (!query.data) {
      return;
    }

    setLocalParameters(query.data);

    const onlineOnlyParameter = query.data.find(
      parameter => parameter.Descricao === ONLINE_ONLY_PARAMETER_NAME,
    );

    setOnlineOnlyEnabled(!!onlineOnlyParameter?.Ativo);
  }, [query.data, setLocalParameters, setOnlineOnlyEnabled]);

  return {
    data: {
      isOnlineOnlyEnabled,
      isPending: query.isLoading || query.isFetching || mutation.isPending,
    },
    handlers: {
      handleToggleOnlineOnly: () => {
        const nextValue = !isOnlineOnlyEnabled;
        setOnlineOnlyEnabled(nextValue);

        mutation.mutate({
          Ativo: nextValue,
          Descricao: ONLINE_ONLY_PARAMETER_NAME,
          Valor: nextValue ? '1' : '0',
        });
      },
    },
  };
}
