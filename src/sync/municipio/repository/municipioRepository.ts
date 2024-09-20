import {knexConfig} from '../../../database/connection';
import {MunicipioDto} from '../type/municipioType';

export default class MunicipioRepository {
  async saveBatch(municipios: MunicipioDto[]) {
    const batchSize = 10;
    const batches = [];

    for (let i = 0; i < municipios.length; i += batchSize) {
      const batch = municipios.slice(i, i + batchSize);
      batches.push(batch);
    }

    await knexConfig.transaction(async trx => {
      for (const batch of batches) {
        await trx('municipio').insert(batch);
      }
    });
  }

  async save(municipio: MunicipioDto) {
    try {
      const [id] = await knexConfig('municipio').insert({...municipio});
      return id;
    } catch (error) {
      console.error('Erro ao salvar município:', error);
      throw error;
    }
  }
  async getAll() {
    const data = await knexConfig('municipio').select('Codigo');
    return data;
  }
}
