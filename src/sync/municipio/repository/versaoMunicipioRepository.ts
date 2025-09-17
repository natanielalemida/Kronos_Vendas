import {knexConfig} from '../../../database/connection';
import {MunicipioVersionDTO} from '../type/municipioType';

export default class VersaoMunicipioRepository {
  async save(data: MunicipioVersionDTO) {
    try {
      const [id] = await knexConfig('muncipio_version').insert({Codigo: data.Codigo, Versao: data.Versao, TipoRecurso: data.TipoRecurso});
      return id;
    } catch (error) {
      console.error('Erro ao salvar município:', error);
      throw error;
    }
  }
  async getAll() {
    const data = await knexConfig('muncipio_version').select('Codigo').first();
    return data;
  }
}
