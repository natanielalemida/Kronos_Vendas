import {ContatoDto} from '@/modules/sync/types/customer-sync.types';

export type MunicipalityOption = {
  MunicipioNome: string;
  Codigo: number;
  MunicipioCodigo?: number;
  Estado?: string;
};

export type CustomerForm = {
  id: number | undefined;
  CNPJCPF: string | undefined;
  IE: string | undefined;
  NomeFantasia: string | undefined;
  RazaoSocial: string | undefined;
  Endereco: string | undefined;
  NumeroEndereco: string | undefined;
  Bairro: string | undefined;
  Logradouro: string | undefined;
  Complemento: string | undefined;
  Municipio: MunicipalityOption | undefined;
  Celular: ContatoDto[];
  Email: ContatoDto[];
  CEP: string | undefined;
  IsSincronizado: number | undefined;
};

export type CustomerFormToSave = {
  Cliente: {
    id: number | undefined;
    CNPJCPF: string | undefined;
    IE: string | undefined;
    NomeFantasia: string | undefined;
    RazaoSocial: string | undefined;
  };
  Endereco: {
    id?: number;
    CEP: string | undefined;
    Numero: string | undefined;
    Bairro: string | undefined;
    Logradouro: string | undefined;
    Complemento: string | undefined;
    Municipio: MunicipalityOption | undefined;
    CodigoPessoa: number | undefined;
    CodigoMunicipio: number | undefined;
  };
  Contatos: ContatoDto[];
};

export type CustomerFormUpdatePayload = {
  CNPJCPF: string;
  IE: string;
  NomeFantasia: string;
  RazaoSocial: string;
  Endereco: string;
  NumeroEndereco: number;
  isSincronizado: number;
  Bairro: string;
};
