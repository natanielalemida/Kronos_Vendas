import {Knex} from 'knex';

import {knexConfig} from '@/database/connection';

import {
  MunicipioDto,
  MunicipioVersionDTO,
} from '../types/municipality-sync.types';
import {KnexBatchRepository} from './knex-batch.repository';

type MunicipalityVersionRow = {
  Codigo: number;
  Versao: number;
  TipoRecurso: number;
};

export class MunicipalitySyncRepository {
  private readonly knexBatchRepository = new KnexBatchRepository();

  async getLocalVersion(): Promise<number | undefined> {
    const result = await knexConfig('muncipio_version')
      .select('Versao')
      .first();

    return result?.Versao as number | undefined;
  }

  async replaceMunicipalities(
    municipalities: MunicipioDto[],
    version: MunicipioVersionDTO,
  ): Promise<void> {
    await knexConfig.transaction(async (transaction: Knex.Transaction) => {
      await transaction('municipio').del();
      await transaction('muncipio_version').del();

      await this.knexBatchRepository.insertInChunks(
        transaction,
        'municipio',
        municipalities,
      );

      const versionRow: MunicipalityVersionRow = {
        Codigo: version.Codigo,
        Versao: version.Versao,
        TipoRecurso: version.TipoRecurso,
      };

      await transaction('muncipio_version').insert(versionRow);
    });
  }
}
