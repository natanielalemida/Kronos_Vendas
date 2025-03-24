import {useCallback, useEffect, useState} from 'react';
import {UseSettingsRepositoryProps} from '../type';
import {SettingsRepository} from '../repository';
import { useFocusEffect } from '@react-navigation/native';

export function UseSettingsRepository({isActive}: UseSettingsRepositoryProps) {
  const [host, setHost] = useState<string>('');
  const [codStore, setCodStore] = useState<string>('');
  const [terminal, setTerminal] = useState('');
  const [id, setId] = useState(0);

  const settingsRepository = new SettingsRepository();
  const getSettings = async (get?: boolean) => {
    if(get) return;
    const result = await settingsRepository.get();

    if (!result) return;

    setHost(result.host);
    setCodStore(String(result.cod_loja));
    setTerminal(String(result.terminal));
    setId(result.id);
  };

      useFocusEffect(
        useCallback(() => {
          getSettings();
          return () => {
            // Limpeza aqui
          };
        }, []),
      );

  useEffect(() => {
    getSettings();
  }, [isActive]);

  return {
    host,
    codStore,
    terminal,
    id,
    setHost,
    setCodStore,
    setTerminal,
  };
}
