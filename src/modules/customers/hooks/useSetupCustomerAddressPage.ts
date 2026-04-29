import {useFocusEffect} from '@react-navigation/native';
import {useCallback, useRef, useState} from 'react';
import {TextInput} from 'react-native';

import {useAppSession} from '@/shared/hooks/useAppSession';

import {createUpdatedCustomerForm} from '../helpers/customer-form.helpers';

export function useSetupCustomerAddressPage() {
  const {form, setForm} = useAppSession();
  const [withoutNumber, setWithoutNumber] = useState(form.NumeroEndereco === 'S/N');

  const streetInputRef = useRef<TextInput | null>(null);
  const numberInputRef = useRef<TextInput | null>(null);
  const districtInputRef = useRef<TextInput | null>(null);
  const complementInputRef = useRef<TextInput | null>(null);
  const zipCodeInputRef = useRef<TextInput | null>(null);
  const municipalityInputRef = useRef<TextInput | null>(null);

  useFocusEffect(
    useCallback(() => {
      streetInputRef.current?.focus();
    }, []),
  );

  const updateForm = (updates: Partial<typeof form>) => {
    setForm(createUpdatedCustomerForm(form, updates));
  };

  const handleToggleWithoutNumber = () => {
    const nextValue = !withoutNumber;
    setWithoutNumber(nextValue);

    updateForm({
      NumeroEndereco: nextValue ? 'S/N' : undefined,
    });
  };

  return {
    data: {
      form,
      withoutNumber,
    },
    handlers: {
      handleComplementChange: (value: string) => updateForm({Complemento: value}),
      handleComplementSubmit: () => zipCodeInputRef.current?.focus(),
      handleDistrictChange: (value: string) => updateForm({Bairro: value}),
      handleDistrictSubmit: () => complementInputRef.current?.focus(),
      handleNumberChange: (value: string) => updateForm({NumeroEndereco: value}),
      handleNumberSubmit: () => districtInputRef.current?.focus(),
      handleStreetChange: (value: string) => updateForm({Logradouro: value}),
      handleStreetSubmit: () => numberInputRef.current?.focus(),
      handleToggleWithoutNumber,
      handleZipCodeChange: (value: string) => updateForm({CEP: value}),
      handleZipCodeSubmit: () => municipalityInputRef.current?.focus(),
    },
    refs: {
      complementInputRef,
      districtInputRef,
      municipalityInputRef,
      numberInputRef,
      streetInputRef,
      zipCodeInputRef,
    },
  };
}
