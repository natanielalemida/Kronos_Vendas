import {OrganizationOption} from '@/shared/types';
import {RootNavigationProp} from '@/app/navigation/types/root-navigation.types';

import {LoginFormState, LoginPageState} from './login-page.types';

export type UseSetupLoginPageParams = {
  navigation: RootNavigationProp<'Login'>;
};

export type UseLoginPageEffectsParams = {
  form: LoginFormState;
  login: (
    cpf: string | undefined,
    password: string | undefined,
    organizationCode: number | undefined,
  ) => Promise<void>;
  organizations: OrganizationOption[];
  state: LoginPageState;
};
