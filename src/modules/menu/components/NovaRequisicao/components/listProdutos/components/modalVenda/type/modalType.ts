import {ProdutoDto} from '../../../../../../../../../sync/products/type';

export type ModalType = {
  isActive: boolean;
  produto: ProdutoDto | undefined;
  isAtacado: boolean;
  setIsActive: (value: boolean) => void;
};
