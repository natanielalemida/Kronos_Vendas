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

export type MunicipioVersionDTO = {
  Codigo: number;
  Versao: number;
  TipoRecurso: number;
};

export type MunicipalityVersionApiResponse = {
  Resultado: {
    Codigo: number;
    Versao?: number;
    Versão?: number;
    TipoRecurso: number;
  };
  Status: number;
  Mensagens: string[];
};
