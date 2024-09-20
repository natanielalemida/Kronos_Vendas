import MunicipioMapper from '../mapper/municipioMapper';
import MunicipioRepository from '../repository/municipioRepository';
import {MunicipioDto} from '../type/municipioType';

export default class MunicipioService {
  private repository: MunicipioRepository;
  private mapper: MunicipioMapper;

  constructor() {
    this.repository = new MunicipioRepository();
    this.mapper = new MunicipioMapper();
  }

  async save(municipios: MunicipioDto[]) {
    const formattedMunicipios = municipios.map(municipio =>
      this.mapper.saveOne(municipio),
    );
    // Se o repositório suportar salvar em lote, use a função abaixo:
    await this.repository.saveBatch(formattedMunicipios);

    // Caso contrário, continue salvando um a um em paralelo:
    // await Promise.all(
    //   formattedMunicipios.map(async formatedMunicipio => {
    //     await this.repository.save(formatedMunicipio);
    //   }),
    // );
  }
}
