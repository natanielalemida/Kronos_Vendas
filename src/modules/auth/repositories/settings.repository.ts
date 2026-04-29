import {knexConfig} from '../../../database/connection';

import {SaveSettingsDto} from '../dto/save-settings.dto';
import {StoredSettingsDto} from '../dto/stored-settings.dto';
import {storedSettingsSchema} from '../schemas/stored-settings.schema';

export class SettingsRepository {
  async save(
    settings: SaveSettingsDto,
  ): Promise<StoredSettingsDto | undefined> {
    await knexConfig('settings').insert({
      host: settings.host,
      cod_loja: settings.cod_loja,
      terminal: settings.terminal,
      idConecction: settings.id,
    });

    return this.get();
  }

  async update(
    settings: SaveSettingsDto,
  ): Promise<StoredSettingsDto | undefined> {
    await knexConfig('settings').update({
      host: settings.host,
      cod_loja: settings.cod_loja,
      terminal: settings.terminal,
      idConecction: settings.id,
    });

    return this.get();
  }

  async get(): Promise<StoredSettingsDto | undefined> {
    const query = await knexConfig('settings').select('*').first();

    if (!query) {
      return undefined;
    }

    return storedSettingsSchema.parse(query);
  }

  async delete(): Promise<void> {
    await knexConfig('settings').del();
  }
}
