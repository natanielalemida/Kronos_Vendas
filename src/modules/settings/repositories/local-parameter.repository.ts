import {knexConfig} from '@/database/connection';

import {LocalParameter} from '../types/local-parameter.types';

export class LocalParameterRepository {
  async save(parameter: LocalParameter) {
    await knexConfig('parametrosLocais').insert({
      Descricao: parameter.Descricao,
      Valor: parameter.Valor,
      Ativo: parameter.Ativo,
    });
  }

  async update(parameter: LocalParameter) {
    await knexConfig('parametrosLocais')
      .update({
        Descricao: parameter.Descricao,
        Valor: parameter.Valor,
        Ativo: parameter.Ativo,
      })
      .where('id', parameter.id);
  }

  async getByName(name: string) {
    return knexConfig('parametrosLocais')
      .select('*')
      .where('Descricao', name)
      .first();
  }

  async getLocalParameters(): Promise<LocalParameter[]> {
    const result = await knexConfig('parametrosLocais').select('*');
    return result as LocalParameter[];
  }
}
