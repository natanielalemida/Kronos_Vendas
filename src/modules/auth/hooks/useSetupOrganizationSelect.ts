import {useCallback} from 'react';
import {useController} from 'react-hook-form';

import {OrganizationSelectProps} from '../types/organization-select.types';
import {useOrganizationSelect} from './useOrganizationSelect';

export function useSetupOrganizationSelect({
  control,
  data,
  onSelect,
}: Pick<OrganizationSelectProps, 'control' | 'data' | 'onSelect'>) {
  const {field} = useController({
    control,
    defaultValue: '',
    name: 'organization',
  });
  const handleChange = useCallback(
    (organization: typeof data[number]) => {
      field.onChange(organization.NomeFantasia);
      onSelect(organization);
    },
    [field, onSelect],
  );

  const {handlers, isModalVisible} = useOrganizationSelect({
    data,
    onChange: handleChange,
  });

  return {
    field,
    handlers,
    isModalVisible,
  };
}
