import {useNavigation} from '@react-navigation/native';
import {useState} from 'react';
import Toast from 'react-native-toast-message';

import {useAppSession} from '@/shared/hooks/useAppSession';
import {CustomerForm} from '@/shared/types/customer-form.types';
import {logger} from '@/shared/utils/logger';

import {CustomerFormService} from '../services/customer-form.service';

export function useSaveCustomerForm() {
  const navigation = useNavigation();
  const service = new CustomerFormService();
  const {form, handleClearForm, setForm} = useAppSession();
  const [isLoading, setIsLoading] = useState(false);

  const verify = (requiredKeys: (keyof CustomerForm)[]) => {
    return requiredKeys.every(key => form[key] !== null && form[key] !== undefined);
  };

  const handleSaveOrEdit = async () => {
    try {
      setIsLoading(true);
      await service.saveOrUpdate(form);
      handleClearForm();
      Toast.show({
        text1: 'Sucesso',
        text1Style: {fontSize: 18, fontWeight: 'bold'},
        text2: 'Usuario criado com sucesso',
        text2Style: {fontSize: 14},
        type: 'success',
        visibilityTime: 1000,
      });
      navigation.goBack();
    } catch (error) {
      logger.error('CustomerForm', 'Failed to save customer form.', error);
      Toast.show({
        text1: 'Cadastro Cliente',
        text1Style: {fontSize: 18, fontWeight: 'bold'},
        text2: 'Falha ao cadastrar cliente',
        text2Style: {fontSize: 14},
        type: 'error',
        visibilityTime: 1000,
      });
    } finally {
      setIsLoading(false);
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
