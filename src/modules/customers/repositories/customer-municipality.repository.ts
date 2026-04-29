import {knexConfig} from '@/database/connection';
import {MunicipalityOption} from '@/shared/types/customer-form.types';

export class CustomerMunicipalityRepository {
  async getMunicipalities(): Promise<MunicipalityOption[]> {
    const rows = await knexConfig('municipio').select([
      'Codigo',
      'MunicipioNome',
      'MunicipioCodigo',
      'UFSigla as Estado',
    ]);

    return rows as MunicipalityOption[];
  }
}
