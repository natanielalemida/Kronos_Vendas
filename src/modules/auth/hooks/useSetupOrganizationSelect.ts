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
  const {handlers, isModalVisible} = useOrganizationSelect({
    data,
    onChange: async organization => {
      field.onChange(organization.NomeFantasia);
      onSelect(organization);
    },
  });

  return {
    field,
    handlers,
    isModalVisible,
  };
}
