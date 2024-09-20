import {useNavigation} from '@react-navigation/native';
import {ClienteDto} from '../../../../../../../sync/clientes/type';
import {ModalUseModalType} from '../type';
import {Alert} from 'react-native';
import SaveOrEditClienteRepository from '../../criarOuEditarUsuario/repository/saveOrEditClienteRepository';
import Toast from 'react-native-toast-message';

export default function useEditUser({setActive, setForm}: ModalUseModalType) {
  const navigation = useNavigation();
  const repositoy = new SaveOrEditClienteRepository();

  const handleEditUser = async (clienteUpdate: ClienteDto) => {
    const data =
      clienteUpdate.isSincronizado === 1
        ? await repositoy.pessoaComEndereco(clienteUpdate.id)
        : await repositoy.pessoaComEnderecoById(clienteUpdate.id);
    console.log({data});
    setForm({
      id: data.id,
      CNPJCPF: data.CNPJCPF,
      IE: data.IERG,
      NomeFantasia: data.NomeFantasia,
      RazaoSocial: data.RazaoSocial,
      NumeroEndereco: data.Numero,
      Bairro: data.Bairro,
      Logradouro: data.Logradouro,
      Complemento: data.Complemento,
      Municipio: {
        Codigo: data.CodigoMunicipioRepository,
        MunicipioNome: data.MunicipioNome,
      },
      CEP: data.CEP,
      Celular: [...data.Contatos.Celular],
      Email: [...data.Contatos.Email],
      isSincronizado: data.isSincronizado,
    });
    setActive(false);
    navigation.navigate('RouterCliente');
  };

  const handleDelete = async (cliente: ClienteDto) => {
    try {
      await repositoy.deleteById(cliente.id);
      await Toast.show({
        type: 'success',
        text1: 'Sucesso',
        text1Style: {fontSize: 18, fontWeight: 'bold'},
        text2: 'Usuario deletado com sucesso',
        text2Style: {fontSize: 14},
        visibilityTime: 1000,
      });
      setActive(false);
    } catch (err) {
      await Toast.show({
        type: 'error',
        text1: 'Falha',
        text1Style: {fontSize: 18, fontWeight: 'bold'},
        text2: 'Falha ao deletar usuario',
        text2Style: {fontSize: 14},
        visibilityTime: 1000,
      });
      setActive(false);
    }
  };

  const handleRemove = (cliente: ClienteDto) => {
    Alert.alert(
      'Deletar usuario',
      'Após deletadar, o usuario nao poderá ser recuperado, deseja continuar?',
      [
        {
          text: 'Cancelar',
          onPress: () => {},
          style: 'cancel',
        },
        {text: 'OK', onPress: () => handleDelete(cliente)},
      ],
    );
  };

  return {
    handleEditUser,
    handleRemove,
  };
}
