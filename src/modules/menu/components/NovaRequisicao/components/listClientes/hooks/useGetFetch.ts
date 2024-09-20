import {useState} from 'react';
import {ClienteDto} from '../../../../../../../sync/clientes/type';
import ClienteRepository from '../../../../../../../sync/clientes/repository/clienteRepository';
export default function UseGetFetch() {
  const [isLoading, setLoading] = useState(false);
  const [clientes, setClientes] = useState<ClienteDto[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const repository = new ClienteRepository();
  const handleGetUsers = async (textFilter?: string) => {
    setLoading(true);
    const data = await repository.search(textFilter);
    setClientes([...data.data]);
    setTotalPages(data.total.count);
    setLoading(false);
  };

  return {
    handleGetUsers,
    setLoading,
    isLoading,
    clientes,
    totalPages,
    setTotalPages,
  };
}
