import {ContatoDto, EnderecoDto} from '@/modules/sync/types/customer-sync.types';

import {EditableCustomerRecord} from '../types/customer-edit.types';

function buildCustomerContacts(customer: EditableCustomerRecord): ContatoDto[] {
  return [...customer.Contatos.Celular, ...customer.Contatos.Email].map(contact => ({
    Codigo: contact.Codigo ?? 0,
    CodigoPessoa: customer.CodigoPessoa ?? customer.Codigo ?? 0,
    Contato: contact.Contato,
    Tipo: contact.Tipo,
  }));
}

function buildCustomerAddresses(customer: EditableCustomerRecord): EnderecoDto[] {
  if (!customer.Logradouro && !customer.Bairro && !customer.Numero) {
    return [];
  }

  return [
    {
      Bairro: customer.Bairro ?? '',
      CEP: customer.CEP ?? '',
      Codigo: customer.EnderecoId ?? 0,
      CodigoMunicipio:
        customer.Municipio?.MunicipioCodigo ?? customer.Municipio?.Codigo ?? 0,
      CodigoPessoa: customer.CodigoPessoa ?? customer.Codigo ?? 0,
      Complemento: customer.Complemento ?? '',
      Logradouro: customer.Logradouro ?? '',
      Municipio: {
        Codigo: customer.Municipio?.Codigo ?? 0,
        MunicipioCodigo:
          customer.Municipio?.MunicipioCodigo ?? customer.Municipio?.Codigo ?? 0,
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
) {
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
    Contatos: buildCustomerContacts(customer),
    DataCadastro: '',
    DataNascimento: null,
    DescontoMaximo: customer.DescontoMaximo ?? 0,
    DiaPagamento: customer.DiaPagamento ?? 0,
    Enderecos: buildCustomerAddresses(customer),
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
