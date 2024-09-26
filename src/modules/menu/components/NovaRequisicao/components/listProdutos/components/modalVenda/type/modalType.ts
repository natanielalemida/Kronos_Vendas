import {ProdutoDto} from '../../../../../../../../../sync/products/type';

export type ModalType = {
  isActive: boolean;
  produto: ProdutoDto | undefined;
  isAtacadoActive: boolean;
  canSetAtacado: boolean;
  setAtacadoActive: (value: boolean) => void;
  setIsActive: (value: boolean) => void;
};
