import {Alert} from 'react-native';
import {SettingsService} from '../service';
import {useSaveSettingsProps} from '../type';
import ApiInstace from '../../../../../api/ApiInstace';
import { SettingsRepository } from '../repository';
import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

export function useSaveSettings({
  host,
  codStore,
  terminal,
  id,
  closeModal,
  isModalActive
}: useSaveSettingsProps) {
  const [idKronos, setIdKronos] = useState();
  const settingsService = new SettingsService();

   const settingsRepository = new SettingsRepository();

    const getSettings = async (get?: boolean) => {
      if(get) return;
      const result = await settingsRepository.get();
  
      if (!result) return;
      setIdKronos(result.idConecction)
    };
  
  const handleSave = async ({host, codStore, terminal, id}) => {
    if (!host || !codStore || !terminal) {
      Alert.alert(
        'Campos invalidos',
        'por favor, verifique os campos e tente novamente',
      );
      return;
    }

    await settingsService.saveOrUpdate({
      host,
      id,
      cod_loja: Number(codStore),
      terminal: Number(terminal),
    });

    await getSettings();
    closeModal();
  };

    useFocusEffect(
      useCallback(() => {
        getSettings();
        return () => {
          // Limpeza aqui
        };
      }, []),
    );

    useEffect(() => { getSettings();}, [isModalActive])

  return {
    handleSave,
    idKronos
  };
}
