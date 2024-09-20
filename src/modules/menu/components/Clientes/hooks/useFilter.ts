import {useEffect} from 'react';
import {UseFilterProps} from '../type';

export default function useFilter({
  textFilter,
  clientes,
  setFilteresClientes,
}: UseFilterProps) {
  useEffect(() => {
    const filterProducts = () => {
      const lowercasedFilter = textFilter.toLowerCase();

      const filtered = clientes.filter(product => {
        const descricao = product.NomeFantasia
          ? product.NomeFantasia.toLowerCase()
          : '';
        const codigo = product.Codigo
          ? String(product.Codigo).toLowerCase()
          : '';
        const codigoDeBarras = product.CNPJCPF
          ? product.CNPJCPF.toLowerCase()
          : '';

        return (
          descricao.includes(lowercasedFilter) ||
          codigo.includes(lowercasedFilter) ||
          codigoDeBarras.includes(lowercasedFilter)
        );
      });

      setFilteresClientes(filtered);
    };

    filterProducts();
  }, [textFilter, clientes]);
}
