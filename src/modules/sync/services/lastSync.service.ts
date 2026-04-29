import {LastSyncRepository} from '../repositories/lastSync.repository';

export class LastSyncService {
  constructor(private readonly lastSyncRepository: LastSyncRepository) {}

  async getFormattedLastSync(): Promise<string | undefined> {
    const lastSync = await this.lastSyncRepository.getLastSync();

    if (!lastSync) {
      return undefined;
    }

    return this.formatDate(lastSync);
  }

  private formatDate(value: string): string {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };

    const formatted = new Date(value).toLocaleString('pt-BR', options);
    const [datePart, timePart] = formatted.split(' ');

    if (!datePart || !timePart) {
      return formatted;
    }

    const [day, month, year] = datePart.split('/');
    const [hour, minute] = timePart.split(':');

    return `${day}/${month}/${year} às ${hour}:${minute}`;
  }
}
