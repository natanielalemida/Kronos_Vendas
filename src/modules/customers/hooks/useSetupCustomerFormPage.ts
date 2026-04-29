import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useCallback, useRef, useState} from 'react';
import {TextInput} from 'react-native';
import {TextInputMask} from 'react-native-masked-text';

import {useAppSession} from '@/shared/hooks/useAppSession';

import {
  appendContact,
  confirmContactRemoval,
  createUpdatedCustomerForm,
  formatCustomerDocument,
  isCompanyDocument,
  removeContact,
} from '../helpers/customer-form.helpers';

export function useSetupCustomerFormPage() {
  const navigation = useNavigation() as {navigate: (routeName: string) => void};
  const {form, setForm} = useAppSession();
  const [phoneDraft, setPhoneDraft] = useState('');
  const [emailDraft, setEmailDraft] = useState('');

  const documentInputRef = useRef<TextInput | null>(null);
  const identityInputRef = useRef<TextInput | null>(null);
  const tradeNameInputRef = useRef<TextInput | null>(null);
  const corporateNameInputRef = useRef<TextInput | null>(null);
  const phoneMaskRef = useRef<TextInputMask | null>(null);
  const emailInputRef = useRef<TextInput | null>(null);

  useFocusEffect(
    useCallback(() => {
      documentInputRef.current?.focus();
    }, []),
  );

  const focusPhoneInput = () => {
    const currentPhoneInput = phoneMaskRef.current as unknown as {
      getElement?: () => TextInput;
    } | null;

    currentPhoneInput?.getElement?.().focus();
  };

  const updateForm = (updates: Partial<typeof form>) => {
    setForm(createUpdatedCustomerForm(form, updates));
  };

  const appendPhone = () => {
    const nextContacts = appendContact(form.Celular, phoneDraft, 1);

    if (nextContacts === form.Celular) {
      return;
    }

    updateForm({Celular: nextContacts});
    setPhoneDraft('');
  };

  const appendEmail = () => {
    const nextContacts = appendContact(form.Email, emailDraft, 2);

    if (nextContacts === form.Email) {
      return;
    }

    updateForm({Email: nextContacts});
    setEmailDraft('');
  };

  return {
    data: {
      documentLabel: isCompanyDocument(form.CNPJCPF) ? 'IE' : 'RG',
      emailDraft,
      form,
      formattedDocument: formatCustomerDocument(form.CNPJCPF),
      phoneDraft,
      shouldShowCorporateName: isCompanyDocument(form.CNPJCPF),
    },
    handlers: {
      handleCorporateNameChange: (value: string) => updateForm({RazaoSocial: value}),
      handleCorporateNameSubmit: focusPhoneInput,
      handleDocumentChange: (value: string) =>
        updateForm({CNPJCPF: value.replace(/\D/g, '')}),
      handleDocumentSubmit: () => identityInputRef.current?.focus(),
      handleEmailAppend: appendEmail,
      handleEmailDraftChange: setEmailDraft,
      handleEmailDraftSubmit: () => {
        appendEmail();
        navigation.navigate('Endereco');
      },
      handleEmailRemove: (contactValue: string) =>
        confirmContactRemoval(contactValue, () =>
          updateForm({Email: removeContact(form.Email, contactValue)}),
        ),
      handleIdentityChange: (value: string) => updateForm({IE: value}),
      handleIdentitySubmit: () => tradeNameInputRef.current?.focus(),
      handlePhoneAppend: appendPhone,
      handlePhoneDraftChange: setPhoneDraft,
      handlePhoneDraftSubmit: () => {
        appendPhone();
        emailInputRef.current?.focus();
      },
      handlePhoneRemove: (contactValue: string) =>
        confirmContactRemoval(contactValue, () =>
          updateForm({Celular: removeContact(form.Celular, contactValue)}),
        ),
      handleTradeNameChange: (value: string) => updateForm({NomeFantasia: value}),
      handleTradeNameSubmit: () => {
        if (isCompanyDocument(form.CNPJCPF)) {
          corporateNameInputRef.current?.focus();
          return;
        }

        focusPhoneInput();
      },
    },
    refs: {
      corporateNameInputRef,
      documentInputRef,
      emailInputRef,
      identityInputRef,
      phoneMaskRef,
      tradeNameInputRef,
    },
  };
}
