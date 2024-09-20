export type MunicipioDto = {
  Codigo: number;
  MunicipioCodigo: number;
  MunicipioNome: string;
  UFCodigo: number;
  UFNome: string;
  UFSigla: string;
  PaisCodigo: number;
  PaisNome: string;
};

export type MunicipioResultado = {
  Resultado: MunicipioDto[];
  Status: number;
  Mensagens: string[];
};
