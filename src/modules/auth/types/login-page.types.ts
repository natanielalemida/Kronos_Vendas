import {OrganizationOption, UserDto} from '@/shared/types';
import {Dispatch, SetStateAction} from 'react';
import {
  Control,
  UseFormClearErrors,
  UseFormGetValues,
  UseFormSetError,
  UseFormSetValue,
} from 'react-hook-form';
import {LoginFormValues} from './login-form.types';

export type LoginFormState = {
  control: Control<LoginFormValues>;
  errors: Partial<Record<keyof LoginFormValues, string>>;
  clearErrors: UseFormClearErrors<LoginFormValues>;
  getValues: UseFormGetValues<LoginFormValues>;
  organizationCode?: number;
  setError: UseFormSetError<LoginFormValues>;
  setValue: UseFormSetValue<LoginFormValues>;
  showPassword: boolean;
  focusedField: string;
  setOrganizationCode: Dispatch<SetStateAction<number | undefined>>;
  setShowPassword: Dispatch<SetStateAction<boolean>>;
  setFocusedField: Dispatch<SetStateAction<string>>;
};

export type LoginPageState = {
  isKeyboardVisible: boolean;
  lastPassword?: string;
  setLastPassword: Dispatch<SetStateAction<string | undefined>>;
  setKeyboardVisible: Dispatch<SetStateAction<boolean>>;
};

export type LoginMutationResult = {
  progress?: {
    message?: string;
  };
  login: (
    cpf: string | undefined,
    password: string | undefined,
    organizationCode: number | undefined,
  ) => Promise<void>;
};

export type LoginSuccessPayload = {
  cpf: string;
  organizationCode: number;
  password: string;
  terminal: number;
  user: UserDto;
};

export type LoginPageHandlers = {
  handleBiometricLogin: () => Promise<void>;
  handleChangeOrganization: (value: OrganizationOption) => void;
  handleLogin: () => Promise<void>;
  handleOpenSettings: () => void;
  handleRestoreUser: () => Promise<void>;
};
