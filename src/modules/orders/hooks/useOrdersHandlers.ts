import {Alert} from 'react-native';
import Toast from 'react-native-toast-message';

import {OrderListItem} from '../types/order.types';
import {UseOrdersHandlersParams} from '../types/orders-hooks.types';

export function useOrdersHandlers({
  company,
  filterIconRef,
  getByIdToSave,
  navigation,
  selectedOrders,
  setFilterModalPosition,
  setIsFilterModalVisible,
  setLoading,
  setOptions,
  setSelectedOrders,
  setTextFilter,
  sendOrder,
  terminal,
  usuario,
}: UseOrdersHandlersParams) {
  const handleSelectOrder = (order: OrderListItem) => {
    if (order.Codigo) {
      return;
    }

    setSelectedOrders(currentValue => {
      const alreadySelected = currentValue.some(item => item.id === order.id);

      if (alreadySelected) {
        return currentValue.filter(item => item.id !== order.id);
      }

      return [...currentValue, order];
    });
  };

  const handleOrderPress = (order: OrderListItem) => {
    navigation.navigate('resumoPedidoNavigation', {
      id: order.id,
      Codigo: order.Codigo,
      idCliente: order.PessoaCodigo ? undefined : order.idPessoa,
    });
  };

  const handleSendOrders = async () => {
    if (!selectedOrders.length) {
      Toast.show({
        type: 'error',
        text1: 'Sem pedidos selecionados',
        text2: 'Por favor, selecione um pedido',
        visibilityTime: 2000,
      });
      return;
    }

    if (!usuario || !company?.Codigo) {
      Alert.alert('Erro', 'Usuário ou empresa não estão disponíveis.');
      return;
    }

    const companyCode = company.Codigo;

    try {
      const results = await Promise.all(
        selectedOrders.map(async order => {
          const customerToSync = await getByIdToSave(order.idPessoa);

          return sendOrder({
            authenticatedUser: usuario,
            companyCode,
            customerToSync,
            id: order.id,
            terminal: terminal ?? 0,
          });
        }),
      );

      const hasFailedSync = results.some(result => !result);

      if (hasFailedSync) {
        return;
      }

      setSelectedOrders([]);

      Toast.show({
        type: 'success',
        text1: 'Sucesso',
        text2: 'Pedido enviado com sucesso',
        visibilityTime: 2000,
      });
    } catch (error) {
      console.error('Error while syncing selected orders', error);
      Alert.alert('Erro', 'Não foi possível enviar os pedidos selecionados.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenFilterModal = () => {
    filterIconRef.current?.measure((_fx, _fy, _width, height, px, py) => {
      setFilterModalPosition({x: px, y: py + height});
      setIsFilterModalVisible(true);
    });
  };

  return {
    handleCloseFilterModal: () => setIsFilterModalVisible(false),
    handleOpenFilterModal,
    handleOrderPress,
    handleSelectOrder,
    handleSendOrders,
    handleTextFilterChange: setTextFilter,
    setOptions,
  };
}
