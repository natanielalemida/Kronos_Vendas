import {knexConfig} from '../../../../../database/connection';
import {ParametrosLocaisDto} from '../type';

export default class parametrosLocaisRepository {
  async save(parametro: ParametrosLocaisDto) {
    await knexConfig('parametrosLocais').insert({
      Descricao: parametro.Descricao,
      Valor: parametro.Valor,
      Ativo: parametro.Ativo,
    });
  }

  async update(parametro: ParametrosLocaisDto) {
    await knexConfig('parametrosLocais')
      .update({
        Descricao: parametro.Descricao,
        Valor: parametro.Valor,
        Ativo: parametro.Ativo,
      })
      .where('id', parametro.id);
  }

  async getByName(name: string) {
    const data = await knexConfig('parametrosLocais')
      .select('*')
      .where('Descricao', name)
      .first();

    if (!data) return undefined;
    return data;
  }

  async getParametros() {
    const data = await knexConfig('parametrosLocais').select('*');
    return data;
  }
}
