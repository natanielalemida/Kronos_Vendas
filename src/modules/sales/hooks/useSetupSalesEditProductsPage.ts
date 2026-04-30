import {useMemo, useState} from 'react';

import {useDebouncedSearchText} from '@/modules/customers/hooks/useDebouncedSearchText';
import {useAppSession} from '@/shared/hooks/useAppSession';

import {formatCurrency} from '../helpers/sales-page.helpers';
import {salesSearchSchema} from '../schemas/sales.schema';
import {UseSetupSalesEditProductsPageResult} from '../types/sales-selection.types';

export function useSetupSalesEditProductsPage(): UseSetupSalesEditProductsPageResult {
  const {ProdutosSelecionados} = useAppSession();
  const [searchText, setSearchText] = useState('');
  const [selectedProductCode, setSelectedProductCode] = useState<number>();
  const debouncedSearchText = useDebouncedSearchText(searchText);
  const filteredProducts = useMemo(() => {
    const normalizedSearch = debouncedSearchText.trim().toLowerCase();

    if (!normalizedSearch) {
      return ProdutosSelecionados;
    }

    return ProdutosSelecionados.filter(product => {
      return (
        product.Descricao.toLowerCase().includes(normalizedSearch) ||
        String(product.Codigo).includes(normalizedSearch)
      );
    });
  }, [ProdutosSelecionados, debouncedSearchText]);
  const selectedProduct = useMemo(
    () =>
      ProdutosSelecionados.find(product => product.Codigo === selectedProductCode),
    [ProdutosSelecionados, selectedProductCode],
  );
  const products = useMemo(
    () =>
      filteredProducts.map(product => ({
        id: String(product.Codigo),
        code: product.Codigo,
        description: product.Descricao,
        quantityLabel: `${product.Quantidade}`,
        totalPriceLabel: formatCurrency(
          product.Quantidade * product.ValorVendaDesconto,
        ),
        unitPriceLabel: formatCurrency(product.ValorVendaDesconto),
      })),
    [filteredProducts],
  );
  const handleSearchTextChange = (value: string) => {
    setSearchText(salesSearchSchema.parse({searchText: value}).searchText);
  };

  return {
    data: {
      products,
      searchText,
      selectedProduct,
    },
    handlers: {
      handleCloseEditor: () => setSelectedProductCode(undefined),
      handleOpenEditor: productCode => setSelectedProductCode(productCode),
      handleSearchTextChange,
    },
    viewState: {
      shouldShowEditor: !!selectedProduct,
      shouldShowEmptyState: filteredProducts.length === 0,
    },
  };
}
