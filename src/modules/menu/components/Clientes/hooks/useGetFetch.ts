import {useState} from 'react';
import ClienteRepository from '../../../../../sync/clientes/repository/clienteRepository';
import {ClienteDto} from '../../../../../sync/clientes/type';

export default function UseGetFetch() {
  const [isLoading, setLoading] = useState(false);
  const [clientes, setClientes] = useState<ClienteDto[]>([]);

  const repository = new ClienteRepository();
  const handleGetUsers = async (textFilter?: string) => {
    setLoading(true);
    const data = await repository.search(textFilter);
    setClientes([...data.data]);

    setLoading(false);
  };

  return {
    handleGetUsers,
    setLoading,
    isLoading,
    clientes,
  };
}
