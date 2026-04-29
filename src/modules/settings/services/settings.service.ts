import {LocalParameterRepository} from '../repositories/local-parameter.repository';
import {LocalParameter} from '../types/local-parameter.types';

export class SettingsService {
  constructor(private readonly repository = new LocalParameterRepository()) {}

  async getLocalParameters(): Promise<LocalParameter[]> {
    return this.repository.getLocalParameters();
  }

  async saveLocalParameter(
    parameter: LocalParameter,
  ): Promise<LocalParameter[]> {
    const existingParameter = await this.repository.getByName(
      parameter.Descricao ?? '',
    );

    if (existingParameter) {
      await this.repository.update({
        ...parameter,
        id: existingParameter.id,
      });
    } else {
      await this.repository.save(parameter);
    }

    return this.repository.getLocalParameters();
  }
}
