import * as LocalAuthentication from 'expo-local-authentication';
import {useCallback, useEffect} from 'react';
import {Keyboard} from 'react-native';
import {OrganizationOption} from '@/shared/types';

import {useAppStorage} from '@/modules/storage/hooks/useAppStorage';
import {UseLoginPageEffectsParams} from '../types/login-hook.types';

export function useLoginPageEffects({
  form,
  login,
  state,
}: UseLoginPageEffectsParams) {
  const {biometricsEnabled: usesBiometrics, storedCredentials} =
    useAppStorage();

  const handleChangeOrganization = useCallback(
    (value: OrganizationOption) => {
      form.setValue('organization', value.NomeFantasia || '');
      form.setValue('organizationCode', value.Codigo || 0);
      form.setOrganizationCode(value.Codigo || 0);
      form.clearErrors(['organization', 'organizationCode']);
    },
    [form],
  );

  const handleBiometricLogin = useCallback(
    async (username?: string, storedPassword?: string) => {
      if (!username || !storedPassword) {
        return;
      }

      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Autenticação Kronos Vendas',
        cancelLabel: 'Cancelar',
        fallbackLabel: 'Usar senha',
      });

      if (result.success) {
        await login(
          username,
          storedPassword,
          form.organizationCode ?? form.getValues('organizationCode'),
        );
      }
    },
    [form, login],
  );

  const handleRestoreUser = useCallback(async () => {
    const loginValue = storedCredentials?.login;
    const passwordValue = storedCredentials?.password;

    if (loginValue) {
      form.setValue('cpf', loginValue);
    }

    if (passwordValue) {
      form.setValue('password', passwordValue);
      state.setLastPassword(passwordValue);
      await handleBiometricLogin(loginValue, passwordValue);
    }
  }, [form, handleBiometricLogin, state, storedCredentials]);

  useEffect(() => {
    if (!form.organizationCode && !form.getValues('organizationCode')) {
      return;
    }

    handleRestoreUser().catch(console.error);
  }, [form, form.organizationCode, handleRestoreUser]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => state.setKeyboardVisible(true),
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => state.setKeyboardVisible(false),
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, [state]);

  return {
    handleBiometricLogin,
    handleChangeOrganization,
    handleRestoreUser,
    usesBiometrics,
  };
}
