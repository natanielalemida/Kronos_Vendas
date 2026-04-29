import {SettingsRepository} from '@/modules/auth/repositories/settings.repository';
import {AppStorageGateway} from '@/modules/storage/services/app-storage.gateway';

type ResolvedApiConfig = {
  host?: string;
  terminal?: number;
};

export class ApiConfigService {
  private readonly settingsRepository = new SettingsRepository();

  async resolve(): Promise<ResolvedApiConfig> {
    const activeConnection = await AppStorageGateway.getActiveConnection();
    const storedTerminal = await AppStorageGateway.getTerminal();

    if (activeConnection?.host) {
      return {
        host: activeConnection.host,
        terminal:
          storedTerminal ?? Number.parseInt(activeConnection.terminal, 10),
      };
    }

    const fallbackSettings = await this.settingsRepository.get();

    if (!fallbackSettings) {
      return {
        host: undefined,
        terminal: storedTerminal,
      };
    }

    await AppStorageGateway.setActiveConnectionId(
      fallbackSettings.idConecction,
    );
    await AppStorageGateway.setTerminal(fallbackSettings.terminal);

    return {
      host: fallbackSettings.host,
      terminal: fallbackSettings.terminal,
    };
  }
}
