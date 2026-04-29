import {OrganizationOption} from '@/shared/types';

import {LoginFormState, LoginPageHandlers} from './login-page.types';

export type LoginBrandProps = {
  compactLayout: boolean;
  logo: number;
};

export type LoginFormProps = {
  compactForm: boolean;
  compactLayout: boolean;
  form: LoginFormState;
  handlers: LoginPageHandlers;
  organizations: OrganizationOption[];
  shouldShowBiometricButton: boolean;
};
