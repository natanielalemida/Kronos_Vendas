import {ClienteDto} from '@/modules/sync/types/customer-sync.types';
import {CustomerListItem} from '@/modules/customers/types/customer-list.types';
import {ProductListItem} from '@/modules/products/types/product.types';
import {ProdutoBodyCreateQtAndObsDto} from '@/modules/sync/types/product-sync.types';

export function mapCustomerListItemToClienteDto(
  customer: CustomerListItem,
): ClienteDto {
  return {
    ...customer,
    AcrescimoPercentual: null,
    Ativo: true,
    BloquearCliente: false,
    CarenciaPagamento: 0,
    Categoria: null,
    Contatos: [],
    DataCadastro: '',
    DataNascimento: null,
    DescontoMaximo: 0,
    DiaPagamento: 0,
    Enderecos: customer.Enderecos.map((address, index) => ({
      Bairro: address.Bairro ?? '',
      CEP: '',
      Codigo: index,
      CodigoMunicipio: 0,
      CodigoPessoa: customer.CodigoPessoa,
      Complemento: address.Complemento ?? '',
      Logradouro: address.Logradouro ?? '',
      Municipio: {
        Codigo: 0,
        MunicipioCodigo: 0,
        MunicipioNome: '',
        PaisCodigo: 0,
        PaisNome: '',
        UFCodigo: 0,
        UFNome: '',
        UFSigla: '',
      },
      Numero: address.Numero ?? '',
      Tipo: 0,
      TipoDescricao: 'Principal',
    })),
    ForcarAtualizacaoCadastro: false,
    IERG: customer.IERG ?? null,
    LimiteCompra: 0,
    MeiosPagamento: [],
    Observacao: null,
    PermiteComprarPazo: false,
    PessoaFJ: customer.CNPJCPF?.length > 11 ? 1 : 0,
    PessoaReferencia: [],
    Regiao: null,
    ResponsavelCadastro: {
      CodigoUsuario: 0,
      Nome: null,
      DescontoMaximoRecebimento: 0,
      DescontoMaximoVenda: 0,
    },
    TipoContribuinte: 0,
    Veiculos: null,
  };
}

export function mapProductListItemToSelectedProduct(
  product: ProductListItem,
): ProdutoBodyCreateQtAndObsDto {
  return {
    ...product,
    Observacao: '',
    Quantidade: 1,
    ValorVendaDesconto: product.ValorVenda,
  };
}

export function sanitizeDecimalInput(value: string): number {
  const sanitizedValue = value.replace(',', '.').replace(/[^0-9.]/g, '');
  const parsedValue = Number.parseFloat(sanitizedValue);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

export function formatDecimalInput(value: number): string {
  return value.toFixed(2);
}

export function sanitizeQuantityInput(value: string, allowsFraction: boolean): string {
  if (allowsFraction) {
    return value
      .replace(/[^\d.,]/g, '')
      .replace(/,/g, '.')
      .replace(/([.])(?=.*[.])/g, '');
  }

  return value.replace(/[^0-9]/g, '');
}

export function getSelectedProductBasePrice(
  product: SalesEditableProduct,
  isWholesaleActive: boolean,
): number {
  if (isWholesaleActive && product.ValorVendaAtacado > 0) {
    return product.ValorVendaAtacado;
  }

  return product.ValorVenda;
}

type SalesEditableProduct = ProductListItem | ProdutoBodyCreateQtAndObsDto;

export function inferWholesaleSelection(product: SalesEditableProduct): boolean {
  if (product.ValorVendaAtacado <= 0) {
    return false;
  }

  if ('ValorVendaDesconto' in product) {
    return product.ValorVendaDesconto === product.ValorVendaAtacado;
  }

  return false;
}

export function calculateDiscountPercent({
  basePrice,
  unitPrice,
}: {
  basePrice: number;
  unitPrice: number;
}): number {
  if (!basePrice || unitPrice >= basePrice) {
    return 0;
  }

  return ((basePrice - unitPrice) / basePrice) * 100;
}

export function applyDiscountPercent({
  basePrice,
  discountPercent,
  maxDiscountPercent,
}: {
  basePrice: number;
  discountPercent: number;
  maxDiscountPercent: number;
}): number {
  const clampedDiscount = Math.max(0, Math.min(discountPercent, maxDiscountPercent));

  return Math.max(0, basePrice - (clampedDiscount / 100) * basePrice);
}

export function clampUnitPrice({
  basePrice,
  requestedUnitPrice,
  maxDiscountPercent,
}: {
  basePrice: number;
  requestedUnitPrice: number;
  maxDiscountPercent: number;
}): number {
  const minimumPrice = applyDiscountPercent({
    basePrice,
    discountPercent: maxDiscountPercent,
    maxDiscountPercent,
  });

  return requestedUnitPrice >= basePrice
    ? requestedUnitPrice
    : Math.max(requestedUnitPrice, minimumPrice);
}

export function buildSelectedProductDraft({
  product,
  quantity,
  note,
  unitPrice,
  isWholesaleActive,
}: {
  product: SalesEditableProduct;
  quantity: number;
  note: string;
  unitPrice: number;
  isWholesaleActive: boolean;
}): ProdutoBodyCreateQtAndObsDto {
  const modeBasePrice = getSelectedProductBasePrice(product, isWholesaleActive);
  const storedBasePrice = unitPrice > modeBasePrice ? unitPrice : modeBasePrice;

  return {
    Codigo: product.Codigo,
    CodigoBarrasAtacado: product.CodigoBarrasAtacado,
    CodigoDeBarras: product.CodigoDeBarras,
    CodigoGrupo: product.CodigoGrupo,
    CodigoMarca: product.CodigoMarca,
    CodigoSetor: product.CodigoSetor,
    CodigoSubGrupo: product.CodigoSubGrupo,
    Descricao: product.Descricao,
    Observacao: note,
    PermiteFracionar: product.PermiteFracionar,
    Quantidade: quantity,
    Referencia: product.Referencia,
    UnidadeMedida: product.UnidadeMedida,
    UnidadeMedidaAtacado: product.UnidadeMedidaAtacado,
    ValorVenda: storedBasePrice,
    ValorVendaAtacado: product.ValorVendaAtacado,
    ValorVendaDesconto: unitPrice,
    VendeProdutoNoAtacado: product.VendeProdutoNoAtacado,
  };
}
