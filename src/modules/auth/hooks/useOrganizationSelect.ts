import {useFocusEffect} from '@react-navigation/native';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {OrganizationOption} from '@/shared/types';

import {useAppStorage} from '@/modules/storage/hooks/useAppStorage';
import {useAppStorageActions} from '@/modules/storage/hooks/useAppStorageActions';
import {UseOrganizationSelectParams} from '../types/organization-select.types';

export function useOrganizationSelect({
  data,
  onChange,
}: UseOrganizationSelectParams) {
  const [isModalVisible, setModalVisible] = useState(false);
  const {companyCode} = useAppStorage();
  const {setOfflineOrganization} = useAppStorageActions();

  const defaultOrganization = useMemo(() => {
    const matchedOrganization = data.find(
      organization => organization.Codigo === Number(companyCode),
    );

    return matchedOrganization ?? data[0];
  }, [companyCode, data]);

  const applyOrganization = useCallback(
    async (organization: OrganizationOption) => {
      onChange(organization);
      await setOfflineOrganization(organization);
    },
    [onChange, setOfflineOrganization],
  );

  const syncDefaultOrganization = useCallback(async () => {
    if (!defaultOrganization) {
      return;
    }

    await applyOrganization(defaultOrganization);
  }, [applyOrganization, defaultOrganization]);

  useFocusEffect(
    useCallback(() => {
      syncDefaultOrganization().catch(console.error);
    }, [syncDefaultOrganization]),
  );

  useEffect(() => {
    syncDefaultOrganization().catch(console.error);
  }, [syncDefaultOrganization]);

  return {
    isModalVisible,
    handlers: {
      closeModal: () => setModalVisible(false),
      openModal: () => setModalVisible(true),
      selectOrganization: async (organization: OrganizationOption) => {
        await applyOrganization(organization);
        setModalVisible(false);
      },
    },
  };
}
