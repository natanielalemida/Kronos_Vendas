import * as LocalAuthentication from 'expo-local-authentication';
import {useCallback, useEffect, useRef} from 'react';
import {Alert, Keyboard} from 'react-native';
import {OrganizationOption} from '@/shared/types';

import {useAppStorage} from '@/modules/storage/hooks/useAppStorage';
import {logger} from '@/shared/utils/logger';
import {UseLoginPageEffectsParams} from '../types/login-hook.types';

export function useLoginPageEffects({
  form,
  login,
  state,
}: UseLoginPageEffectsParams) {
  const {biometricsEnabled: usesBiometrics, storedCredentials} =
    useAppStorage();
  const hasAttemptedRestoreRef = useRef(false);

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
    async (
      username?: string,
      storedPassword?: string,
      shouldShowAlert = true,
    ) => {
      if (!username || !storedPassword) {
        if (shouldShowAlert) {
          Alert.alert(
            'Biometria indisponível',
            'Não há credenciais salvas para autenticar com biometria.',
          );
        }

        return;
      }

      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        if (shouldShowAlert) {
          Alert.alert(
            'Biometria indisponível',
            !hasHardware
              ? 'Este dispositivo não possui suporte à biometria.'
              : 'Nenhuma biometria está cadastrada neste dispositivo.',
          );
        }

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
        return;
      }

      if (
        shouldShowAlert &&
        result.error !== 'user_cancel' &&
        result.error !== 'system_cancel'
      ) {
        Alert.alert(
          'Falha na autenticação',
          'Não foi possível concluir a autenticação por biometria.',
        );
      }
    },
    [form, login],
  );

  const handleBiometricLoginFromStorage = useCallback(async () => {
    await handleBiometricLogin(
      storedCredentials?.login,
      storedCredentials?.password,
      true,
    );
  }, [handleBiometricLogin, storedCredentials]);

  const handleRestoreUser = useCallback(async () => {
    const loginValue = storedCredentials?.login;
    const passwordValue = storedCredentials?.password;

    if (loginValue) {
      form.setValue('cpf', loginValue);
    }

    if (passwordValue) {
      form.setValue('password', passwordValue);
      state.setLastPassword(passwordValue);
    }
  }, [form, state, storedCredentials]);

  useEffect(() => {
    if (!form.organizationCode && !form.getValues('organizationCode')) {
      return;
    }

    if (hasAttemptedRestoreRef.current) {
      return;
    }

    hasAttemptedRestoreRef.current = true;

    handleRestoreUser().catch(error => {
      logger.error('LoginPage', 'Failed to restore saved user credentials.', error);
    });

    if (usesBiometrics) {
      handleBiometricLogin(
        storedCredentials?.login,
        storedCredentials?.password,
        false,
      ).catch(error => {
        logger.error(
          'LoginPage',
          'Biometric login bootstrap failed.',
          error,
        );
      });
    }
  }, [
    form,
    form.organizationCode,
    handleBiometricLogin,
    handleRestoreUser,
    storedCredentials,
    usesBiometrics,
  ]);

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
    handleBiometricLogin: handleBiometricLoginFromStorage,
    handleChangeOrganization,
    handleRestoreUser,
    usesBiometrics,
  };
}
