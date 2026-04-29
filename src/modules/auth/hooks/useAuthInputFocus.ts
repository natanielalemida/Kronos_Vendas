import {useEffect, useRef} from 'react';

import {AuthInputRef, UseAuthInputFocusParams} from '../types/auth-input.types';

export function useAuthInputFocus({
  placeholder,
  targetFocusField,
}: UseAuthInputFocusParams) {
  const inputRef = useRef<AuthInputRef>(null);

  useEffect(() => {
    if (targetFocusField !== placeholder) {
      return;
    }

    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    return () => clearTimeout(timer);
  }, [placeholder, targetFocusField]);

  return {
    inputRef,
  };
}
