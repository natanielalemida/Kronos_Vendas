import {useState} from 'react';
import {SaveOrEditClienteType} from '../type';
import {useNavigation} from '@react-navigation/native';
import SaveOrUpdateClienteService from '../service/saveOrUpdateClienteSerivce';
import Toast from 'react-native-toast-message';
import {useCliente} from '../../../context/clientContext';

export default function UseSaveOrEdit() {
  const navigation = useNavigation();
  const service = new SaveOrUpdateClienteService();
  const {form, setForm, handleClearForm} = useCliente();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const verify = (value: string[]) => {
    return value.every(key => form[key] !== null && form[key] !== undefined);
  };

  const handleSaveOrEdit = async (id?: number) => {
    try {
      setIsLoading(true);
      await service.saveOrUpdate(form);
      handleClearForm();
      setIsLoading(false);
      await Toast.show({
        type: 'success',
        text1: 'Sucesso',
        text1Style: {fontSize: 18, fontWeight: 'bold'},
        text2: 'Usuario criado com sucesso',
        text2Style: {fontSize: 14},
        visibilityTime: 1000,
      });
      navigation.goBack();
    } catch (error) {
      console.log(error);
      await Toast.show({
        type: 'error',
        text1: 'Cadastro Cliente',
        text1Style: {fontSize: 18, fontWeight: 'bold'},
        text2: 'Falha ao cadastrar cliente',
        text2Style: {fontSize: 14},
        visibilityTime: 1000,
      });
    }
  };

  const handleClearFormContext = () => {
    handleClearForm();
    navigation.goBack();
  };
  return {
    form,
    isLoading,
    setForm,
    verify,
    handleSaveOrEdit,
    handleClearForm: handleClearFormContext,
  };
}
