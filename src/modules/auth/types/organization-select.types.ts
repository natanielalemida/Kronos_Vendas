import {DimensionValue} from 'react-native';
import {Control} from 'react-hook-form';
import {OrganizationOption} from '@/shared/types';

import {LoginFormValues} from './login-form.types';

export type OrganizationSelectProps = {
  control: Control<LoginFormValues>;
  errorMessage?: string;
  data: OrganizationOption[];
  inputWidth?: DimensionValue;
  onSelect: (value: OrganizationOption) => void;
  placeholder?: string;
};

export type OrganizationSelectModalProps = {
  data: OrganizationOption[];
  isVisible: boolean;
  onClose: () => void;
  onSelect: (value: OrganizationOption) => void;
};

export type UseOrganizationSelectParams = {
  data: OrganizationOption[];
  onChange: (value: OrganizationOption) => void;
};
