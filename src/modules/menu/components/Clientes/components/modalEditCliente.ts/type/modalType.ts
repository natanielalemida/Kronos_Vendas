import {ClienteDto} from '../../../../../../../sync/clientes/type';
import {SaveOrEditClienteType} from '../../criarOuEditarUsuario/type';

export type ModalType = {
  cliente: ClienteDto;
  isActive: boolean;
  setActive: (value: boolean) => void;
};

export type ModalUseModalType = {
  setForm: (value: SaveOrEditClienteType) => void;
  setActive: (value: boolean) => void;
};
