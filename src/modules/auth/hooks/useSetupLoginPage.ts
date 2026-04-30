import {KronosIcon} from '@/assets/login/KronosVendaIcon';
import {useLoginMutation} from '@/modules/auth/mutations/login.mutation';

import {loginFormSchema} from '../schemas/login.schema';
import {UseSetupLoginPageParams} from '../types/login-hook.types';
import {useOrganizationSummariesQuery} from '../queries/organization-summaries.query';
import {useLoginPageEffects} from './useLoginPageEffects';
import {useLoginPageState} from './useLoginPageState';

export function useSetupLoginPage({navigation}: UseSetupLoginPageParams) {
  const {form, state} = useLoginPageState();
  const {
    data: organizations = [],
    isLoading: isLoadingOrganization,
  } = useOrganizationSummariesQuery();
  const {login, progress} = useLoginMutation();
  const {
    hasBiometricCredentials,
    handleBiometricLogin,
    handleChangeOrganization,
    handleRestoreUser,
    usesBiometrics,
  } =
    useLoginPageEffects({
      form,
      login,
      organizations,
      state,
    });

  const handleLogin = async () => {
    const values = {
      cpf: form.getValues('cpf'),
      organizationCode:
        form.organizationCode ?? form.getValues('organizationCode'),
      password: form.getValues('password'),
    };

    const parsedValues = loginFormSchema.safeParse(values);

    if (!parsedValues.success) {
      parsedValues.error.issues.forEach(issue => {
        const fieldName = issue.path[0];

        if (
          fieldName === 'cpf' ||
          fieldName === 'organizationCode' ||
          fieldName === 'password'
        ) {
          form.setError(fieldName, {
            message: issue.message,
            type: 'manual',
          });
        }
      });

      return;
    }

    form.clearErrors();
    await login(
      parsedValues.data.cpf,
      parsedValues.data.password,
      parsedValues.data.organizationCode,
    );
  };

  return {
    assets: {
      logo: KronosIcon,
    },
    form,
    organizations,
    isKeyboardVisible: state.isKeyboardVisible,
    isLoadingOrganization,
    lastPassword: state.lastPassword,
    navigation,
    progress,
    usesBiometrics,
    derivedState: {
      shouldShowBiometricButton:
        usesBiometrics && hasBiometricCredentials && !!state.lastPassword,
      compactLayout:
        state.isKeyboardVisible &&
        usesBiometrics &&
        hasBiometricCredentials &&
        !!state.lastPassword,
      compactForm: state.isKeyboardVisible,
    },
    handlers: {
      handleChangeOrganization,
      handleBiometricLogin,
      handleLogin,
      handleOpenSettings: () => navigation.navigate('Settings'),
      handleRestoreUser,
    },
  };
}
