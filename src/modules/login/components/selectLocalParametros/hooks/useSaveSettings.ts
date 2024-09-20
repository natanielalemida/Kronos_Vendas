import {Alert} from 'react-native';
type useSaveSettingsProps = {
  host?: string;
  codStore?: string;
  terminal?: string;
  closeModal: () => void;
};

export default function useSaveSettings({
  host,
  codStore,
  terminal,
  closeModal,
}: useSaveSettingsProps) {
  const handleSave = async () => {
    if (!host || !codStore || !terminal) {
      Alert.alert(
        'Campos invalidos',
        'por favor, verifique os campos e tente novamente',
      );
      return;
    }

    closeModal();
  };
  return {
    handleSave,
  };
}
