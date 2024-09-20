import {ClienteDto} from '../../../../../sync/clientes/type';

export type UseFilterProps = {
  textFilter: string;
  clientes: ClienteDto[];
  setFilteresClientes: (filteresCliente: ClienteDto[]) => void;
};
