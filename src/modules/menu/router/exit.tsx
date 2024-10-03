import {useEffect} from 'react';
import Loading from '../../components/loading/Loading';
import {useCliente} from '../components/Clientes/context/clientContext';
import Init from '../components/Produtos/hooks/init';

export default function Exit({navigation}) {
  const {clearAllContext} = useCliente();

  function handleLogin() {
    clearAllContext();
    navigation.navigate('Login');
  }

  Init({handleGetProdutos: handleLogin});

  return <Loading isModalLoadingActive={true} />;
}
