import {ContatoDto} from '@/modules/sync/types/customer-sync.types';
import {CustomerForm, CustomerFormToSave} from '@/shared/types/customer-form.types';

import {EditableCustomerRecord} from '../types/customer-edit.types';

export function mapCustomerFormToSavePayload(
  customerForm: CustomerForm,
): CustomerFormToSave {
  const contacts: ContatoDto[] = [
    ...customerForm.Email.map(email => ({
      Codigo: email.Codigo ?? 0,
      Tipo: 2,
      CodigoPessoa: email.CodigoPessoa ?? 0,
      Contato: email.Contato,
    })),
    ...customerForm.Celular.map(phone => ({
      Codigo: phone.Codigo ?? 0,
      Tipo: 1,
      CodigoPessoa: phone.CodigoPessoa ?? 0,
      Contato: phone.Contato,
    })),
  ];

  return {
    Cliente: {
      id: customerForm.id,
      CNPJCPF: customerForm.CNPJCPF,
      IE: customerForm.IE,
      NomeFantasia: customerForm.NomeFantasia?.toUpperCase(),
      RazaoSocial:
        (customerForm.CNPJCPF?.length ?? 0) <= 11
          ? customerForm.NomeFantasia?.toUpperCase()
          : customerForm.RazaoSocial?.toUpperCase(),
    },
    Endereco: {
      CEP: customerForm.CEP,
      Bairro: customerForm.Bairro,
      Complemento: customerForm.Complemento,
      CodigoMunicipio:
        customerForm.Municipio?.MunicipioCodigo ?? customerForm.Municipio?.Codigo,
      CodigoPessoa: undefined,
      Logradouro: customerForm.Logradouro,
      Municipio: customerForm.Municipio,
      Numero: customerForm.NumeroEndereco,
      id: undefined,
    },
    Contatos: contacts,
  };
}

export function mapEditableCustomerRecordToForm(
  customerRecord: EditableCustomerRecord,
): CustomerForm {
  return {
    id: customerRecord.id,
    Bairro: customerRecord.Bairro ?? undefined,
    CEP: customerRecord.CEP ?? undefined,
    CNPJCPF: customerRecord.CNPJCPF ?? undefined,
    Celular: customerRecord.Contatos.Celular.map(contact => ({
      Codigo: contact.Codigo ?? 0,
      CodigoPessoa: customerRecord.CodigoPessoa ?? customerRecord.Codigo ?? 0,
      Contato: contact.Contato,
      Tipo: contact.Tipo,
    })),
    Complemento: customerRecord.Complemento ?? undefined,
    Email: customerRecord.Contatos.Email.map(contact => ({
      Codigo: contact.Codigo ?? 0,
      CodigoPessoa: customerRecord.CodigoPessoa ?? customerRecord.Codigo ?? 0,
      Contato: contact.Contato,
      Tipo: contact.Tipo,
    })),
    Endereco: customerRecord.Logradouro ?? undefined,
    IE: customerRecord.IERG ?? undefined,
    IsSincronizado: customerRecord.Codigo ? 1 : 0,
    Logradouro: customerRecord.Logradouro ?? undefined,
    Municipio: customerRecord.Municipio,
    NomeFantasia: customerRecord.NomeFantasia ?? undefined,
    NumeroEndereco: customerRecord.Numero ?? undefined,
    RazaoSocial: customerRecord.RazaoSocial ?? undefined,
  };
}
