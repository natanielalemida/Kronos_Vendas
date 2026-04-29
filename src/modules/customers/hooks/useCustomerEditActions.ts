import {Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import {useAppSession} from '@/shared/hooks/useAppSession';

import {mapEditableCustomerRecordToForm} from '../mappers/customer-form.mapper';
import {CustomerEditRepository} from '../repositories/customer-edit.repository';
import {CustomerActionsModalProps, UseCustomerActionsModalResult} from '../types/customer-edit.types';

export function useCustomerEditActions({
  customer,
  onClose,
}: Pick<
  CustomerActionsModalProps,
  'customer' | 'onClose'
>): UseCustomerActionsModalResult {
  const navigation = useNavigation() as {navigate: (routeName: string) => void};
  const repository = new CustomerEditRepository();
  const {setForm} = useAppSession();

  const handleEditCustomer = async () => {
    if (!customer) {
      return;
    }

    const customerRecord = customer.Codigo
      ? await repository.findByCode(customer.id)
      : await repository.findById(customer.id);

    setForm(mapEditableCustomerRecordToForm(customerRecord));
    onClose(false);
    navigation.navigate('RouterCliente');
  };

  const handleDeleteCustomer = () => {
    if (!customer) {
      return;
    }

    Alert.alert(
      'Deletar usuario',
      'Após deletadar, o usuario nao poderá ser recuperado, deseja continuar?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              await repository.deleteById(customer.id);
              await Toast.show({
                type: 'success',
                text1: 'Sucesso',
                text1Style: {fontSize: 18, fontWeight: 'bold'},
                text2: 'Usuario deletado com sucesso',
                text2Style: {fontSize: 14},
                visibilityTime: 1000,
              });
            } catch {
              await Toast.show({
                type: 'error',
                text1: 'Falha',
                text1Style: {fontSize: 18, fontWeight: 'bold'},
                text2: 'Falha ao deletar usuario',
                text2Style: {fontSize: 14},
                visibilityTime: 1000,
              });
            } finally {
              onClose(false);
            }
          },
        },
      ],
    );
  };

  return {
    handlers: {
      handleDeleteCustomer,
      handleEditCustomer,
    },
    viewState: {
      isSyncedCustomer: customer?.isSincronizado === 1,
    },
  };
}
