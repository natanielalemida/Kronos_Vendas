import {useController} from 'react-hook-form';

import {AuthInputProps} from '../types/auth-input.types';
import {useAuthInputFocus} from './useAuthInputFocus';

export function useSetupAuthInput({
  control,
  name,
  placeholder,
  targetFocusField,
}: Pick<
  AuthInputProps,
  'control' | 'name' | 'placeholder' | 'targetFocusField'
>) {
  const {field} = useController({
    control,
    defaultValue: '',
    name,
  });
  const {inputRef} = useAuthInputFocus({
    placeholder,
    targetFocusField,
  });

  return {
    field,
    inputRef,
  };
}
