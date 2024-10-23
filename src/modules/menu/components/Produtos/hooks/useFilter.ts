import {useEffect} from 'react';
import {UseFilterProps} from '../type';

export default function useFilter({
  textFilter,
  produtos,
  setFilteredProdutos,
}: UseFilterProps) {
  useEffect(() => {
    const filterProducts = () => {
      const lowercasedFilter = textFilter.toLowerCase();

      const filtered = produtos.filter(product => {
        const descricao = product.Descricao
          ? product.Descricao.toLowerCase()
          : '';
        const codigo = product.Codigo
          ? String(product.Codigo).toLowerCase()
          : '';
        const codigoDeBarras = product.CodigoDeBarras
          ? product.CodigoDeBarras.toLowerCase()
          : '';

        const nomeFantasia = product.NomeFantasia
          ? String(product.NomeFantasia).toLowerCase()
          : '';

        return (
          descricao.includes(lowercasedFilter) ||
          codigo.includes(lowercasedFilter) ||
          codigoDeBarras.includes(lowercasedFilter) ||
          nomeFantasia.includes(lowercasedFilter)
        );
      });

      setFilteredProdutos(filtered);
    };

    filterProducts();
  }, [textFilter, produtos]);
}
