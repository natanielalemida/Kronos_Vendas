import {Knex} from 'knex';

import {chunkArray} from '../utils/chunk.util';

export class KnexBatchRepository {
  async insertInChunks<TRecord extends object>(
    transaction: Knex.Transaction,
    tableName: string,
    records: TRecord[],
    chunkSize = 200,
  ): Promise<void> {
    if (records.length === 0) {
      return;
    }

    const chunks = chunkArray(records, chunkSize);

    for (const chunk of chunks) {
      await transaction(tableName).insert(chunk);
    }
  }
}
