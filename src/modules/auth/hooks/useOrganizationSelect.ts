import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {OrganizationOption} from '@/shared/types';
import {logger} from '@/shared/utils/logger';

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
  const lastAppliedOrganizationCodeRef = useRef<number | null>(null);

  const defaultOrganization = useMemo(() => {
    const matchedOrganization = data.find(
      organization => organization.Codigo === Number(companyCode),
    );

    return matchedOrganization ?? data[0];
  }, [companyCode, data]);

  const applyOrganization = useCallback(
    async (organization: OrganizationOption) => {
      lastAppliedOrganizationCodeRef.current = organization.Codigo;
      onChange(organization);
      await setOfflineOrganization(organization);
    },
    [onChange, setOfflineOrganization],
  );

  const syncDefaultOrganization = useCallback(async () => {
    if (!defaultOrganization) {
      return;
    }

    if (lastAppliedOrganizationCodeRef.current === defaultOrganization.Codigo) {
      return;
    }

    await applyOrganization(defaultOrganization);
  }, [applyOrganization, defaultOrganization]);

  useEffect(() => {
    syncDefaultOrganization().catch(error => {
      logger.error(
        'OrganizationSelect',
        'Failed to sync default organization.',
        error,
      );
    });
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
