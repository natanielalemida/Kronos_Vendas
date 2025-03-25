import {knexConfig} from '../../../../../database/connection';
import {SaveSettingsDto} from '../dto';

export class SettingsRepository {
  async saveSettings(settings: SaveSettingsDto) {
    const [id] = await knexConfig('settings').insert({
      host: settings.host,
      cod_loja: settings.cod_loja,
      terminal: settings.terminal,
      idConecction: settings.id
    });

    return await this.getById();
  }

  async updateSettings(settings: SaveSettingsDto) {
    try {
      await knexConfig('settings')
        .update({
          host: settings.host,
          cod_loja: settings.cod_loja,
          terminal: settings.terminal,
          idConecction: settings.id,
        })

      return await this.getById();
    } catch (error) {
      console.log(error);
    }
  }

  async getById(): Promise<SaveSettingsDto | undefined> {
    const query = await knexConfig('settings')
      .select('*')
      .first();

    if (!query) return undefined;

    return query;
  }

  async get(): Promise<SaveSettingsDto | undefined> {
    const query = await knexConfig('settings').select('*').first();

    if (!query) return undefined;

    return query;
  }

  async delete(): Promise<void> {
    await knexConfig('settings').del();
  }
  
}
