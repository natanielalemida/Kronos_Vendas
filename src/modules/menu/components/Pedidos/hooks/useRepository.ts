import {useState} from 'react';
import PedidoRepository from '../repository/pedidoRepository';
import {PedidoSearchDto} from '../type';
import ApiInstace from '../../../../../api/ApiInstace';
import {useCliente} from '../../Clientes/context/clientContext';
import PedidoService from '../../../../../sync/pedidos/service/pedidoSyncService';
import {Alert} from 'react-native';
import {ClienteDto} from '../../../../../sync/clientes/type';
import ServiceEnviarSingleCliente from '../../../../enviarDados/cliente/service/serviceEnviarSingleCliente';
import {UsuarioDto} from '../../../../login/hooks/type';

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
      throw new Error(`${data.mensagens[0].conteudo}`);
    }
    await service.updateOne(id, data.Resultado);
    await getPedidos({syncds: true, notSyncd: true});
    return true;
  };

  const repositoy = new PedidoRepository();
  const getPedidos = async (options: {
    syncds: boolean;
    notSyncd: boolean;
    clienteId?: number;
  }) => {
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

  const teste = async (
    id: number,
    clienteOnContext: ClienteDto,
    usuario: UsuarioDto,
    codigoEmpresa: number,
    terminal: number,
  ) => {
    setLoading(true);

    const serviceCliente = new ServiceEnviarSingleCliente(
      [],
      usuario,
      clienteOnContext,
      () => {},
    );

    if (!clienteOnContext?.Codigo && clienteOnContext) {
      const userSynced = await serviceCliente.iniciarSincronizacaoSingle(true);

      if (!userSynced) {
        return;
      }

      await repositoy.updatePedidoIdCliente(id, userSynced.Codigo);
    }

    try {
      const data = await repositoy.getPedidoById(id, terminal);

      const result = await ApiInstace.openUrl({
        method: 'post',
        endPoint: 'arc/operacao/prevenda',
        data,
        headers: {
          Empresa: codigoEmpresa,
          Auth: usuario?.Hash,
        },
      });
      const resultado = await verify(id, result);

      setLoading(false);
      return resultado;
    } catch (error) {
      const err = error as Error;
      console.log(err.message);
      if(err.message === 'Network Error') {
        
      Alert.alert('Sem conexão', 'Verifique sua conexão com a internet e tente novamente');
      setLoading(false);
        return
      }
      Alert.alert('Erro', err.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const clonePedido = async (id: number) => {
    const pedido = await repositoy.clonePedidoById(id);
  };

  return {
    getPedidos,
    pedidos,
    isLoading,
    setLoading,
    setPedidos,
    teste,
    getPedidosNotSynced,
    clonePedido,
  };
}
