import {useState} from 'react';
import {useForm} from 'react-hook-form';

import {LoginFormState, LoginPageState} from '../types/login-page.types';
import {LoginFormValues} from '../types/login-form.types';

export function useLoginPageState(): {
  form: LoginFormState;
  state: LoginPageState;
} {
  const [organizationCode, setOrganizationCode] = useState<number>();
  const [showPassword, setShowPassword] = useState(true);
  const [lastPassword, setLastPassword] = useState<string>();
  const [focusedField, setFocusedField] = useState('Usuário');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const {
    clearErrors,
    control,
    formState: {errors},
    getValues,
    setError,
    setValue,
  } = useForm<LoginFormValues>({
    defaultValues: {
      cpf: '',
      organization: '',
      organizationCode: undefined,
      password: '',
    },
    mode: 'onSubmit',
  });

  return {
    form: {
      control,
      errors: {
        cpf: errors.cpf?.message,
        organization: errors.organization?.message,
        organizationCode: errors.organizationCode?.message,
        password: errors.password?.message,
      },
      clearErrors,
      getValues,
      organizationCode,
      setError,
      setValue,
      showPassword,
      focusedField,
      setOrganizationCode,
      setShowPassword,
      setFocusedField,
    },
    state: {
      isKeyboardVisible,
      lastPassword,
      setKeyboardVisible,
      setLastPassword,
    },
  };
}
