import {SettingsService} from '../services/settings.service';
import {LocalParameter} from '../types/local-parameter.types';

export class SettingsController {
  constructor(private readonly service = new SettingsService()) {}

  async getLocalParameters() {
    return this.service.getLocalParameters();
  }

  async saveLocalParameter(parameter: LocalParameter) {
    return this.service.saveLocalParameter(parameter);
  }
}
