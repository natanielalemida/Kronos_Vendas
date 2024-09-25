import {useState} from 'react';
import PedidoRepository from '../repository/pedidoRepository';
import {PedidoSearchDto} from '../type';
import ApiInstace from '../../../../../api/ApiInstace';
import {useCliente} from '../../Clientes/context/clientContext';
import PedidoService from '../../../../../sync/pedidos/service/pedidoSyncService';
import {Alert} from 'react-native';

export default function UseRepository() {
  const [pedidos, setPedidos] = useState<PedidoSearchDto[]>([]);
  const {usuario} = useCliente();

  const [isLoading, setLoading] = useState(false);
  const service = new PedidoService();

  const verify = async (id: number, data: any) => {
    const successfully = Array.isArray(data.Mensagens);
    if (!successfully) {
      //@ts-ignore
      Alert.alert('Falha ao enviar produto', `${data.mensagens[0].conteudo}`);
      throw new Error('Falha ao enviar');
    }
    await service.updateOne(id, data.Resultado);
    await getPedidos({syncds: true, notSyncd: true});
  };

  const repositoy = new PedidoRepository();
  const getPedidos = async (options: {syncds: boolean; notSyncd: boolean}) => {
    setLoading(true);
    const result = await repositoy.searchPedidoComPessoa(options);
    setPedidos(result);
    setLoading(false);
  };

  const getPedidosNotSynced = async () => {
    setLoading(true);
    const result = await repositoy.searchPedidoComPessoaNotSynbced();
    setLoading(false);
    return result;
  };

  const teste = async (id: number) => {
    setLoading(true);
    try {
      const data = await repositoy.getPedidoById(id);
      const result = await ApiInstace.openUrl({
        method: 'post',
        endPoint: 'arc/operacao/prevenda',
        data,
        headers: {
          Empresa: 1,
          Auth: usuario?.Hash,
        },
      });
      await verify(id, result);

      setLoading(false);
    } catch (error) {
      const err = error as Error;
      Alert.alert('Erro', err.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return {
    getPedidos,
    pedidos,
    isLoading,
    setLoading,
    setPedidos,
    teste,
    getPedidosNotSynced,
  };
}
