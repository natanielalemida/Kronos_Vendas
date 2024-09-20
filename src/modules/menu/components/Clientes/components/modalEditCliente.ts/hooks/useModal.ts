import {useState} from 'react';
import {ClienteDto} from '../../../../../../../sync/clientes/type';

export default function UseModal() {
  const [isActive, setActive] = useState<boolean>(false);
  const [cliente, setCliente] = useState<ClienteDto>({} as ClienteDto);

  const handleVerifyCliente = (clienteDto: ClienteDto) => {
    setCliente(clienteDto);
    setActive(true);
  };

  return {
    isActive,
    cliente,
    setActive,
    handleVerifyCliente,
  };
}
