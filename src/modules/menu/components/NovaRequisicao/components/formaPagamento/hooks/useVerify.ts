import {useNavigation} from '@react-navigation/native';
import {FormaPagamento} from '../../../../../../../sync/pagamentos/type';
import {useCliente} from '../../../../Clientes/context/clientContext';

export default function UseVerify() {
  const {setFormaPagameto} = useCliente();
  const navigation = useNavigation();
  const verify = (formaPagamento: FormaPagamento) => {
    if (formaPagamento.CondicaoPagamento.length > 1) {
      //NAVIGATION TO OTHER PAGE
      return;
    }

    setFormaPagameto(formaPagamento);
    // @ts-ignore
    navigation.navigate('ListClientes', {
      screen: 'ResumoPedido',
    });
  };

  return {
    verify,
  };
}
