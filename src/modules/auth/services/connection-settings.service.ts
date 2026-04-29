import {AppStorageGateway} from '@/modules/storage/services/app-storage.gateway';
import {ConnectionOption} from '@/modules/storage/types/app-storage.types';

import {SaveSettingsDto} from '../dto/save-settings.dto';
import {SettingsRepository} from '../repositories/settings.repository';

export class ConnectionSettingsService {
  private readonly settingsRepository = new SettingsRepository();

  async getCurrentSettings() {
    return this.settingsRepository.get();
  }

  async activateConnection(connection: ConnectionOption): Promise<void> {
    await this.saveOrUpdate({
      id: connection.id,
      host: connection.host,
      cod_loja: Number(connection.codStore),
      terminal: Number(connection.terminal),
    });
  }

  async saveOrUpdate(settings: SaveSettingsDto): Promise<void> {
    const hasSettings = await this.settingsRepository.get();

    if (hasSettings) {
      await this.settingsRepository.update(settings);
    } else {
      await this.settingsRepository.save(settings);
    }

    await AppStorageGateway.setActiveConnectionId(settings.id);
    await AppStorageGateway.setTerminal(settings.terminal);
  }

  async deleteCurrentSettings(): Promise<void> {
    await this.settingsRepository.delete();
    await AppStorageGateway.setActiveConnectionId(undefined);
  }
}
