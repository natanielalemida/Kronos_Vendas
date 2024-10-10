import {Alert} from 'react-native';
import {SettingsService} from '../service';
import {useSaveSettingsProps} from '../type';
import ApiInstace from '../../../../../api/ApiInstace';

export function useSaveSettings({
  host,
  codStore,
  terminal,
  id,
  closeModal,
}: useSaveSettingsProps) {
  const settingsService = new SettingsService();

  const handleSave = async () => {
    if (!host || !codStore || !terminal) {
      Alert.alert(
        'Campos invalidos',
        'por favor, verifique os campos e tente novamente',
      );
      return;
    }

    const result = await ApiInstace.openLocalUrl(host);

    if (!result) {
      Alert.alert('Falha', 'Não foi possivel conectar com o servidor');
      return;
    }

    await settingsService.saveOrUpdate({
      host,
      id,
      cod_loja: Number(codStore),
      terminal: Number(terminal),
    });

    closeModal();
  };
  return {
    handleSave,
  };
}
