import {ProdutoDto} from '../../../../../../../../../sync/products/type';

export type ModalType = {
  isActive: boolean;
  produto: ProdutoDto | undefined;
  setIsActive: (value: boolean) => void;
};
