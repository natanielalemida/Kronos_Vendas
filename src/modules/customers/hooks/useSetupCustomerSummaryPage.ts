import {useNavigation, useRoute} from '@react-navigation/native';
import {Alert} from 'react-native';
import {useState} from 'react';
import Toast from 'react-native-toast-message';

import {useAppSession} from '@/shared/hooks/useAppSession';
import {SingleCustomerUploadService} from '@/modules/sync/services/single-customer-upload.service';

import {
  isCompanyDocument,
  mapCustomerFormToClienteDto,
} from '../helpers/customer-form.helpers';
import {mapEditableCustomerRecordToClienteDto} from '../helpers/customer-sync.helpers';
import {customerSummaryRequiredSchema} from '../schemas/customer-form.schema';
import {CustomerFormService} from '../services/customer-form.service';
import {CustomersFlowRouteParams} from '../types/customers-router.types';

export function useSetupCustomerSummaryPage() {
  const navigation = useNavigation() as {pop: (count?: number) => void};
  const route = useRoute();
  const routeParams = (route.params as CustomersFlowRouteParams | undefined) ?? {};
  const [progress, setProgress] = useState<unknown>();
  const {
    form,
    handleClearForm,
    params,
    setClienteOnContext,
    usuario,
  } = useAppSession();
  const customerFormService = new CustomerFormService();

  const handleCloseAfterSuccess = () => {
    if (routeParams.setClienteOnContextActive) {
      handleClearForm();
      navigation.pop(2);
      return;
    }

    handleClearForm();
    navigation.pop(1);
  };

  const validate = () => {
    const result = customerSummaryRequiredSchema.safeParse(form);

    if (result.success) {
      return true;
    }

    Alert.alert(
      'Campos obrigatorios',
      'por favor, preecha todos os campos obrigatios',
    );
    return false;
  };

  const notifySuccess = () => {
    Toast.show({
      text1: 'Sucesso',
      text1Style: {fontSize: 18, fontWeight: 'bold'},
      text2: 'Usuário criado com sucesso',
      text2Style: {fontSize: 14},
      type: 'success',
      visibilityTime: 2000,
    });
  };

  const handlePersistSuccess = (
    customerToSet?: Parameters<typeof setClienteOnContext>[0],
  ) => {
    if (routeParams.setClienteOnContextActive && customerToSet) {
      setClienteOnContext(customerToSet);
    }

    notifySuccess();
    setTimeout(handleCloseAfterSuccess, 500);
  };

  const handleSaveCustomer = async () => {
    if (!validate()) {
      return;
    }

    try {
      setProgress({loading: true});
      const savedCustomer = await customerFormService.saveOrUpdate(form);
      handlePersistSuccess(mapEditableCustomerRecordToClienteDto(savedCustomer));
    } catch (error) {
      const normalizedError =
        error instanceof Error ? error : new Error('Falha ao salvar cliente.');
      Alert.alert('Falha', normalizedError.message);
    } finally {
      setProgress(undefined);
    }
  };

  const handleSyncCustomer = async () => {
    if (!validate() || !usuario) {
      return;
    }

    try {
      const service = new SingleCustomerUploadService(
        params,
        usuario,
        mapCustomerFormToClienteDto(form),
        setProgress,
      );
      const syncedCustomer = await service.syncSingleCustomer(true);

      if (!syncedCustomer) {
        return;
      }

      handlePersistSuccess(mapEditableCustomerRecordToClienteDto(syncedCustomer));
    } catch (error) {
      const normalizedError =
        error instanceof Error ? error : new Error('Falha ao sincronizar cliente.');

      if (normalizedError.message === 'Network Error') {
        Alert.alert(
          'Sem conexão',
          'Verifique sua conexão com a internet e tente novamente',
        );
        return;
      }

      Alert.alert('Falha', normalizedError.message);
    } finally {
      setProgress(undefined);
    }
  };

  return {
    data: {
      form,
      isCompanyDocument: isCompanyDocument(form.CNPJCPF),
    },
    derivedState: {
      isSyncedCustomer: form.IsSincronizado === 1,
    },
    handlers: {
      handleGoBack: () => {
        handleClearForm();
        navigation.pop(1);
      },
      handleSaveCustomer,
      handleSyncCustomer,
    },
    viewState: {
      isLoading: !!progress,
    },
  };
}
