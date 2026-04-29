import {Alert} from 'react-native';

import {
  ClienteDto,
  ContatoDto,
  EnderecoDto,
} from '@/modules/sync/types/customer-sync.types';
import {createEmptyCustomerForm} from '@/shared/factories/customerForm.factory';
import {CustomerForm, MunicipalityOption} from '@/shared/types/customer-form.types';

export function formatCustomerDocument(document?: string): string {
  if (!document) {
    return '';
  }

  const normalizedDocument = document.replace(/\D/g, '');

  if (normalizedDocument.length > 11) {
    return normalizedDocument.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      '$1.$2.$3/$4-$5',
    );
  }

  return normalizedDocument.replace(
    /(\d{3})(\d{3})(\d{3})(\d{2})/,
    '$1.$2.$3-$4',
  );
}

export function isCompanyDocument(document?: string): boolean {
  return (document?.length ?? 0) > 11;
}

export function appendContact(
  contacts: ContatoDto[],
  contactValue: string,
  type: number,
): ContatoDto[] {
  const trimmedValue = contactValue.trim();

  if (!trimmedValue) {
    return contacts;
  }

  if (contacts.some(contact => contact.Contato === trimmedValue)) {
    return contacts;
  }

  return [
    ...contacts,
    {
      Codigo: 0,
      CodigoPessoa: 0,
      Contato: trimmedValue,
      Tipo: type,
    },
  ];
}

export function removeContact(
  contacts: ContatoDto[],
  contactValue: string,
): ContatoDto[] {
  return contacts.filter(contact => contact.Contato !== contactValue);
}

export function confirmContactRemoval(
  contactValue: string,
  onConfirm: () => void,
): void {
  Alert.alert('Você tem certeza?', `Deseja deletar o contato ${contactValue}?`, [
    {
      style: 'cancel',
      text: 'Cancelar',
    },
    {
      onPress: onConfirm,
      text: 'OK',
    },
  ]);
}

export function createUpdatedCustomerForm(
  form: CustomerForm,
  updates: Partial<CustomerForm>,
): CustomerForm {
  return {
    ...form,
    ...updates,
  };
}

function mapCustomerFormContacts(form: CustomerForm): ContatoDto[] {
  return [...form.Celular, ...form.Email].map(contact => ({
    Codigo: contact.Codigo ?? 0,
    CodigoPessoa: contact.CodigoPessoa ?? 0,
    Contato: contact.Contato,
    Tipo: contact.Tipo,
  }));
}

function mapCustomerFormAddresses(form: CustomerForm): EnderecoDto[] {
  const municipality = form.Municipio;

  if (!municipality || !form.Logradouro) {
    return [];
  }

  return [
    {
      Bairro: form.Bairro ?? '',
      CEP: form.CEP ?? '',
      Codigo: 0,
      CodigoMunicipio: municipality.MunicipioCodigo ?? municipality.Codigo,
      CodigoPessoa: form.id ?? 0,
      Complemento: form.Complemento ?? '',
      Logradouro: form.Logradouro,
      Municipio: {
        Codigo: municipality.Codigo,
        MunicipioCodigo: municipality.MunicipioCodigo ?? municipality.Codigo,
        MunicipioNome: municipality.MunicipioNome,
        PaisCodigo: 0,
        PaisNome: '',
        UFCodigo: 0,
        UFNome: municipality.Estado ?? '',
        UFSigla: municipality.Estado ?? '',
      },
      Numero: form.NumeroEndereco ?? '',
      Tipo: 0,
      TipoDescricao: 'Principal',
    },
  ];
}

export function mapCustomerFormToClienteDto(form: CustomerForm): ClienteDto {
  return {
    AcrescimoPercentual: null,
    Ativo: true,
    BloquearCliente: false,
    CarenciaPagamento: 0,
    Categoria: null,
    Codigo: 0,
    CodigoPessoa: form.id ?? 0,
    CNPJCPF: form.CNPJCPF ?? '',
    Contatos: mapCustomerFormContacts(form),
    DataCadastro: '',
    DataNascimento: null,
    DescontoMaximo: 0,
    DiaPagamento: 0,
    Enderecos: mapCustomerFormAddresses(form),
    ForcarAtualizacaoCadastro: false,
    IERG: form.IE ?? null,
    LimiteCompra: 0,
    MeiosPagamento: [],
    NomeFantasia: form.NomeFantasia ?? '',
    Observacao: null,
    PermiteComprarPazo: false,
    PessoaFJ: isCompanyDocument(form.CNPJCPF) ? 1 : 0,
    PessoaReferencia: [],
    RazaoSocial:
      isCompanyDocument(form.CNPJCPF) && form.RazaoSocial
        ? form.RazaoSocial
        : form.NomeFantasia ?? '',
    Regiao: null,
    ResponsavelCadastro: {
      CodigoUsuario: 0,
      DescontoMaximoRecebimento: 0,
      DescontoMaximoVenda: 0,
      Nome: null,
    },
    TipoContribuinte: 0,
    TipoPreco: null,
    Veiculos: null,
    id: form.id ?? 0,
    isSincronizado: form.IsSincronizado ?? 0,
  };
}

export function mapMunicipalityQueryValue(
  query: string,
  municipalities: MunicipalityOption[],
): MunicipalityOption[] {
  const trimmedQuery = query.trim().toLowerCase();

  if (!trimmedQuery) {
    return [];
  }

  return municipalities.filter(municipality =>
    municipality.MunicipioNome.toLowerCase().includes(trimmedQuery),
  );
}

export function normalizeCustomerForm(customerForm: CustomerForm): CustomerForm {
  return {
    ...createEmptyCustomerForm(),
    ...customerForm,
  };
}
