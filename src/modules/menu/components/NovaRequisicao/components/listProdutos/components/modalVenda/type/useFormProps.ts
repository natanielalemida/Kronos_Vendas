import {ProdutoDto} from '../../../../../../../../../sync/products/type';

export type UseFormPros = {
  produto: ProdutoDto | undefined;
  setIsActive: (value: boolean) => void;
};
