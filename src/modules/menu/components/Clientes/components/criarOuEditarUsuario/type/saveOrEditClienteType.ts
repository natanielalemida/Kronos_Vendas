import {ContatoDto} from '../../../../../../../sync/clientes/type';
import {MunicipioSelectDto} from '../components/type';

export type SaveOrEditClienteType = {
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
  Municipio: MunicipioSelectDto | undefined;
  Celular: string[] | [];
  Email: string[] | [];
  CEP: number | undefined;
  IsSincronizado: number | undefined;
};

export type SaveOrEditClienteteToSaveType = {
  CNPJCPF: string;
  IE: string;
  NomeFantasia: string;
  RazaoSocial: string;
  Endereco: string;
  NumeroEndereco: number;
  isSincronizado: number;
  Bairro: string;
};

export type ClienteToSave = {
  Cliente: {
    id: number | undefined;
    CNPJCPF: string | undefined;
    IE: string | undefined;
    NomeFantasia: string | undefined;
    RazaoSocial: string | undefined;
  };
  Endereco: {
    CEP: number | undefined;
    Numero: string | undefined;
    Bairro: string | undefined;
    Logradouro: string | undefined;
    Complemento: string | undefined;
    Municipio: MunicipioSelectDto | undefined;
    CodigoPessoa: number | undefined;
    CodigoMunicipio: number | undefined;
  };
  Contatos: ContatoDto[];
};

export type HookSaveOrUpdateType = {
  clienteUpdate: SaveOrEditClienteteToSaveType;
};
