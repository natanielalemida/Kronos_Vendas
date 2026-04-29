import {colors} from '@/modules/styles';
import {formatCnpj, formatCpf} from '@/shared/utils/document-formatters';
import {ProdutoBodyCreateQtAndObsDto} from '@/modules/sync/types/product-sync.types';

import {SalesAddressLineSource} from '../types/sales-page.types';

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function calculateSelectedProductsTotal(
  selectedProducts: ProdutoBodyCreateQtAndObsDto[],
): number {
  return selectedProducts.reduce((total, product) => {
    return total + product.Quantidade * product.ValorVendaDesconto;
  }, 0);
}

export function getSelectedProductBackgroundColor(
  index: number,
  productCode: number,
  selectedProductCode?: number,
): string {
  if (productCode === selectedProductCode) {
    return colors.arcGreenNeon;
  }

  return index % 2 === 0 ? colors.grayList : colors.white;
}

export function getSelectedProductContainerStyle(backgroundColor: string) {
  return {backgroundColor};
}

export function formatCustomerDocument(value?: string): string {
  if (!value) {
    return '';
  }

  return value.length > 11 ? formatCnpj(value) : formatCpf(value);
}

export function getCustomerDocumentLabel(value?: string): 'CNPJ' | 'CPF' {
  return value && value.length > 11 ? 'CNPJ' : 'CPF';
}

export function mapCustomerAddressLines(
  addresses?: SalesAddressLineSource[],
): string[] {
  if (!addresses?.length) {
    return [];
  }

  return addresses
    .filter(address => !!address.Logradouro)
    .map(address => {
      return [address.Logradouro, address.Numero, address.Bairro]
        .filter(Boolean)
        .join(' - ');
    });
}
