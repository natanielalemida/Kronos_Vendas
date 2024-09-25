import {ProdutoDto} from '../../../../../../../../../sync/products/type';

export type UseFormPros = {
  produto: ProdutoDto | undefined;
  isAtacado: boolean;
  setIsActive: (value: boolean) => void;
};
