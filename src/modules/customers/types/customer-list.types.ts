export type CustomerListItemAddress = {
  Bairro?: string;
  Complemento?: string;
  Logradouro?: string;
  Numero?: string;
};

export type CustomerListItem = {
  CNPJCPF: string;
  Codigo: number;
  CodigoPessoa: number;
  Enderecos: CustomerListItemAddress[];
  IERG?: string | null;
  NomeFantasia: string;
  RazaoSocial: string;
  TipoPreco: string | null;
  id: number;
  isSincronizado: number;
};
