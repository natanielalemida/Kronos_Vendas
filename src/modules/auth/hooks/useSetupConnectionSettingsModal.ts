import {useCallback, useEffect, useMemo, useState} from 'react';
import {Alert} from 'react-native';

import {useConnectionOptions} from '@/modules/storage/hooks/useConnectionOptions';

import {ConnectionSettingsFormDto} from '../dto/connection-settings-form.dto';
import {
  connectionSettingsFormSchema,
  saveSettingsSchema,
} from '../schemas/connection-settings.schema';
import {ConnectionSettingsService} from '../services/connection-settings.service';
import {ConnectionValidationService} from '../services/connection-validation.service';
import {
  ConnectionSettingsHookResult,
  ConnectionSettingsModalProps,
} from '../types/connection-settings.types';

export function useSetupConnectionSettingsModal({
  connectionId,
  isVisible,
  onClose,
}: ConnectionSettingsModalProps): ConnectionSettingsHookResult {
  const {getConnectionById, saveConnectionOption} = useConnectionOptions();
  const [form, setForm] = useState<ConnectionSettingsFormDto>({
    codStore: '',
    host: '',
    terminal: '',
  });
  const [isSaveDisabled, setSaveDisabled] = useState(true);

  const connectionSettingsService = useMemo(
    () => new ConnectionSettingsService(),
    [],
  );
  const connectionValidationService = useMemo(
    () => new ConnectionValidationService(),
    [],
  );

  useEffect(() => {
    if (!isVisible || !connectionId) {
      return;
    }

    const connection = getConnectionById(connectionId);

    if (!connection) {
      return;
    }

    setForm({
      codStore: connection.codStore,
      host: connection.host,
      terminal: connection.terminal,
    });
    setSaveDisabled(false);
  }, [connectionId, getConnectionById, isVisible]);

  const reset = useCallback(() => {
    setForm({
      codStore: '',
      host: '',
      terminal: '',
    });
    setSaveDisabled(true);
    onClose();
  }, [onClose]);

  const save = useCallback(async () => {
    const formParse = connectionSettingsFormSchema.safeParse(form);

    if (!formParse.success) {
      Alert.alert(
        'Campos inválidos',
        formParse.error.issues[0]?.message ?? 'Verifique os dados informados',
      );
      return;
    }

    const nextId = connectionId ?? Date.now();
    const payload = saveSettingsSchema.parse({
      ...form,
      id: nextId,
      cod_loja: Number(form.codStore),
      terminal: Number(form.terminal),
    });

    await saveConnectionOption({
      ...form,
      id: nextId,
    });
    await connectionSettingsService.saveOrUpdate(payload);
    reset();
  }, [
    connectionId,
    connectionSettingsService,
    form,
    reset,
    saveConnectionOption,
  ]);

  const testConnection = useCallback(async () => {
    const formParse = connectionSettingsFormSchema.safeParse(form);

    if (!formParse.success) {
      Alert.alert(
        'Campos obrigatórios',
        formParse.error.issues[0]?.message ?? 'Preencha todos os campos',
      );
      return;
    }

    const isValid = await connectionValidationService.validate(form.host);

    if (!isValid) {
      Alert.alert('Falha', 'Não foi possível conectar com o servidor');
      setSaveDisabled(true);
      return;
    }

    setSaveDisabled(false);
  }, [connectionValidationService, form]);

  return {
    form,
    actions: {
      setCodStore: value =>
        setForm(currentForm => ({...currentForm, codStore: value})),
      setHost: value => setForm(currentForm => ({...currentForm, host: value})),
      setTerminal: value =>
        setForm(currentForm => ({...currentForm, terminal: value})),
    },
    isSaveDisabled,
    reset,
    save,
    testConnection,
  };
}
