import {ProdutoDto} from '../../../../../../../../../sync/products/type';

export type UseFormPros = {
  produto: ProdutoDto | undefined;
  isAtacadoActive: boolean;
  isAtacado: boolean;
  setIsActive: (value: boolean) => void;
};
