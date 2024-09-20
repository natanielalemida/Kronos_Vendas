import {MunicipioDto} from '../type/municipioType';

export default class MunicipioMapper {
  saveOne(municipio: MunicipioDto): MunicipioDto {
    return {
      Codigo: municipio.Codigo,
      MunicipioCodigo: municipio.MunicipioCodigo,
      MunicipioNome: municipio.MunicipioNome,
      UFCodigo: municipio.UFCodigo,
      UFNome: municipio.UFNome,
      UFSigla: municipio.UFSigla,
      PaisCodigo: municipio.PaisCodigo,
      PaisNome: municipio.PaisNome,
    };
  }
}
