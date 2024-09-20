import {SaveSettingsDto} from '../dto';
import {SettingsRepository} from '../repository';

export class SettingsService {
  private settingsRepository = new SettingsRepository();

  async saveOrUpdate(settings: SaveSettingsDto) {
    const hasSettings = await this.settingsRepository.get();

    if (hasSettings) {
      return await this.settingsRepository.updateSettings(settings);
    }

    await this.settingsRepository.saveSettings(settings);
  }
}
