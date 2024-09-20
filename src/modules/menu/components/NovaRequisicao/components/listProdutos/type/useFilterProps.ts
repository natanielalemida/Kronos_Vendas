import {ProdutoDto} from '../../../../../sync/products/type';

export type UseFilterProps = {
  textFilter: string;
  produtos: ProdutoDto[];
  setFilteredProdutos: (filteredProdutos: ProdutoDto[]) => void;
};
