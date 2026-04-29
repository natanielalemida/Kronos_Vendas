import {CustomerForm} from '@/shared/types/customer-form.types';

export function createEmptyCustomerForm(): CustomerForm {
  return {
    id: undefined,
    CNPJCPF: undefined,
    IE: undefined,
    NomeFantasia: undefined,
    RazaoSocial: undefined,
    Endereco: undefined,
    NumeroEndereco: undefined,
    Bairro: undefined,
    Complemento: undefined,
    Logradouro: undefined,
    Municipio: undefined,
    Celular: [],
    Email: [],
    CEP: undefined,
    IsSincronizado: undefined,
  };
}
