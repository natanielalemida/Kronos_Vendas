import {knexConfig} from '../../../../../database/connection';
import {SaveSettingsDto} from '../dto';

export class SettingsRepository {
  async saveSettings(settings: SaveSettingsDto) {
    const [id] = await knexConfig('settings').insert({
      host: settings.host,
      cod_loja: settings.cod_loja,
      terminal: settings.terminal,
    });

    return await this.getById(id);
  }

  async updateSettings(settings: SaveSettingsDto) {
    try {
      await knexConfig('settings')
        .update({
          host: settings.host,
          cod_loja: settings.cod_loja,
          terminal: settings.terminal,
        })
        .where('id', settings.id);

      return await this.getById(settings.id);
    } catch (error) {
      console.log(error);
    }
  }

  async getById(id: number): Promise<SaveSettingsDto | undefined> {
    const query = await knexConfig('settings')
      .select('*')
      .where('id', id)
      .first();

    if (!query) return undefined;

    return query;
  }

  async get(): Promise<SaveSettingsDto | undefined> {
    const query = await knexConfig('settings').select('*').first();

    if (!query) return undefined;

    return query;
  }
}
