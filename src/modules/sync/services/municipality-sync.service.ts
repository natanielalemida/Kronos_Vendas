import {
  MunicipalityVersionApiResponse,
  MunicipioResultado,
  MunicipioVersionDTO,
} from '../types/municipality-sync.types';
import {SyncRunMode, SyncStepRunResult} from '../types/sync-run.types';
import {MunicipalitySyncRepository} from '../repositories/municipality-sync.repository';
import {SyncApiRepository} from '../repositories/sync-api.repository';
import {UserDto} from '@/shared/types';

function normalizeVersion(
  versionResponse: MunicipalityVersionApiResponse['Resultado'],
): MunicipioVersionDTO {
  return {
    Codigo: versionResponse.Codigo,
    Versao: versionResponse.Versao ?? versionResponse['Versão'] ?? 0,
    TipoRecurso: versionResponse.TipoRecurso,
  };
}

export class MunicipalitySyncService {
  constructor(
    private readonly syncApiRepository: SyncApiRepository,
    private readonly municipalitySyncRepository: MunicipalitySyncRepository,
  ) {}

  async sync(
    user: UserDto,
    organizationCode: number,
    mode: SyncRunMode,
  ): Promise<SyncStepRunResult> {
    const versionResponse =
      await this.syncApiRepository.get<MunicipalityVersionApiResponse>(
        'arc/atualizacao/recurso/tipo?tipo=7',
        user,
        organizationCode,
      );

    if (versionResponse.Status !== 1) {
      throw new Error('Falha ao carregar a versão dos municípios.');
    }

    const normalizedVersion = normalizeVersion(versionResponse.Resultado);
    const localVersion =
      await this.municipalitySyncRepository.getLocalVersion();
    const shouldRefresh =
      mode === 'reset-and-sync' ||
      localVersion === undefined ||
      normalizedVersion.Versao > localVersion;

    if (!shouldRefresh) {
      return {
        skipped: true,
        message: 'Os municípios já estão atualizados.',
      };
    }

    const municipalityResponse =
      await this.syncApiRepository.get<MunicipioResultado>(
        'arc/endereco/municipio',
        user,
        organizationCode,
      );

    if (municipalityResponse.Status !== 1) {
      throw new Error('Falha ao sincronizar municípios.');
    }

    await this.municipalitySyncRepository.replaceMunicipalities(
      municipalityResponse.Resultado,
      normalizedVersion,
    );

    return {
      itemCount: municipalityResponse.Resultado.length,
      message: 'Municípios sincronizados.',
    };
  }
}
