import {ProdutoDto} from '../../../../../../../sync/products/type';

export type UseSetSelectedsType = {
  setIsActive?: (value: false) => void;
  setObservacao?: (value: string) => void;
  setQuantidade?: (value: number) => void;
  cleanForm?: () => void;
  produto?: ProdutoDto;
  isActive?: boolean;
};
