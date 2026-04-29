import {
  ClienteDto,
  ContatoDto,
  EnderecoDto,
} from '@/modules/sync/types/customer-sync.types';
import {ProdutoBodyCreateQtAndObsDto} from '@/modules/sync/types/product-sync.types';
import {EditableCustomerRecord} from '@/modules/customers/types/customer-edit.types';

import {
  OrderSummaryCompany,
  OrderSummaryProduct,
} from '../types/order-summary.types';

function buildCustomerContacts(
  customer: EditableCustomerRecord,
  customerCode: number,
): ContatoDto[] {
  const contacts = [...customer.Contatos.Celular, ...customer.Contatos.Email];

  return contacts.map(contact => ({
    Codigo: contact.Codigo ?? 0,
    CodigoPessoa: customer.CodigoPessoa ?? customerCode,
    Contato: contact.Contato,
    Tipo: contact.Tipo,
  }));
}

function buildCustomerAddresses(
  customer: EditableCustomerRecord,
  customerCode: number,
): EnderecoDto[] {
  if (!customer.Logradouro && !customer.Bairro && !customer.Numero) {
    return [];
  }

  return [
    {
      Bairro: customer.Bairro ?? '',
      CEP: customer.CEP ?? '',
      Codigo: customer.EnderecoId ?? 0,
      CodigoMunicipio: customer.Municipio?.MunicipioCodigo ?? 0,
      CodigoPessoa: customer.CodigoPessoa ?? customerCode,
      Complemento: customer.Complemento ?? '',
      Logradouro: customer.Logradouro ?? '',
      Municipio: {
        Codigo: customer.Municipio?.Codigo ?? 0,
        MunicipioCodigo: customer.Municipio?.MunicipioCodigo ?? 0,
        MunicipioNome: customer.Municipio?.MunicipioNome ?? '',
        PaisCodigo: 0,
        PaisNome: '',
        UFCodigo: 0,
        UFNome: customer.Municipio?.Estado ?? '',
        UFSigla: customer.Municipio?.Estado ?? '',
      },
      Numero: customer.Numero ?? '',
      Tipo: 0,
      TipoDescricao: 'Principal',
    },
  ];
}

export function mapEditableCustomerRecordToClienteDto(
  customer: EditableCustomerRecord,
): ClienteDto {
  const customerCode = customer.Codigo ?? 0;

  return {
    AcrescimoPercentual: null,
    Ativo: true,
    BloquearCliente: false,
    CarenciaPagamento: 0,
    Categoria: null,
    Codigo: customerCode,
    CodigoPessoa: customer.CodigoPessoa ?? customerCode,
    CNPJCPF: customer.CNPJCPF ?? '',
    Contatos: buildCustomerContacts(customer, customerCode),
    DataCadastro: '',
    DataNascimento: null,
    DescontoMaximo: customer.DescontoMaximo ?? 0,
    DiaPagamento: customer.DiaPagamento ?? 0,
    Enderecos: buildCustomerAddresses(customer, customerCode),
    ForcarAtualizacaoCadastro: false,
    IERG: customer.IERG ?? null,
    LimiteCompra: customer.LimiteCompra ?? 0,
    MeiosPagamento: [],
    NomeFantasia: customer.NomeFantasia ?? '',
    Observacao: null,
    PermiteComprarPazo: false,
    PessoaFJ: (customer.CNPJCPF ?? '').length > 11 ? 1 : 0,
    PessoaReferencia: [],
    RazaoSocial: customer.RazaoSocial ?? '',
    Regiao: null,
    ResponsavelCadastro: {
      CodigoUsuario: 0,
      DescontoMaximoRecebimento: 0,
      DescontoMaximoVenda: 0,
      Nome: null,
    },
    TipoContribuinte: 0,
    TipoPreco: customer.TipoPreco ?? null,
    Veiculos: null,
    id: customer.id ?? 0,
    isSincronizado: customer.isSincronizado ?? 0,
  };
}

export function mapOrderSummaryProductsToDraft(
  products: OrderSummaryProduct[],
): ProdutoBodyCreateQtAndObsDto[] {
  return products.map(product => ({
    Codigo: product.CodigoProduto,
    CodigoBarrasAtacado: product.CodigoBarrasAtacado,
    CodigoDeBarras: product.CodigoDeBarras,
    CodigoGrupo: product.CodigoGrupo,
    CodigoMarca: product.CodigoMarca,
    CodigoSetor: product.CodigoSetor,
    CodigoSubGrupo: product.CodigoSubGrupo,
    Descricao: product.Descricao,
    Observacao: product.Observacao ?? '',
    PermiteFracionar: product.PermiteFracionar,
    Quantidade: product.Quantidade,
    Referencia: product.Referencia,
    UnidadeMedida: product.UnidadeMedida,
    UnidadeMedidaAtacado: product.UnidadeMedidaAtacado,
    ValorVenda: product.ValorVenda,
    ValorVendaAtacado: product.ValorVendaAtacado,
    ValorVendaDesconto: product.ValorVendaDesconto,
    VendeProdutoNoAtacado: product.VendeProdutoNoAtacado,
  }));
}

export function formatOrderSummaryDate(dateValue?: string): string {
  if (!dateValue) {
    return '';
  }

  const date = new Date(dateValue);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export function calculateDiscountPercent(
  originalValue: number,
  discountedValue: number,
): string {
  if (!originalValue || discountedValue >= originalValue) {
    return '0.00';
  }

  return (((originalValue - discountedValue) / originalValue) * 100).toFixed(2);
}

export function getCompanyPrimaryContact(
  company: OrderSummaryCompany | undefined,
  type: number,
): string {
  return (
    company?.Contatos?.find(currentContact => currentContact.Tipo === type)
      ?.Contato ?? 'Não informado'
  );
}
