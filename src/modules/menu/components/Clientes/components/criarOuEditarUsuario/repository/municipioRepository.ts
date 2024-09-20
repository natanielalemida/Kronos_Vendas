import {knexConfig} from '../../../../../../../database/connection';
import {MunicipioSelectDto} from '../components/type';

export default class MunicipioRepository {
  async getMunicipios(): Promise<MunicipioSelectDto[]> {
    const data = await knexConfig('municipio').select([
      'Codigo',
      'MunicipioNome',
    ]);
    return data;
  }
}
