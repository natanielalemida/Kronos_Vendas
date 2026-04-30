import {beforeEach, describe, expect, it, jest} from '@jest/globals';
import {UserDto} from '@/shared/types';

import {MunicipalitySyncRepository} from '../repositories/municipality-sync.repository';
import {SyncApiRepository} from '../repositories/sync-api.repository';
import {MunicipalitySyncService} from './municipality-sync.service';

describe('MunicipalitySyncService', () => {
  const user = {Hash: 'hash'} as UserDto;
  const organizationCode = 1;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  function createService(...responses: unknown[]) {
    const syncApiRepository = {
      get: jest.fn(),
    } as unknown as SyncApiRepository;
    (syncApiRepository as {get: ReturnType<typeof jest.fn>}).get
      .mockResolvedValueOnce(responses[0])
      .mockResolvedValueOnce(responses[1]);

    const municipalitySyncRepository = {
      getLocalVersion: jest.fn().mockResolvedValue(undefined),
      replaceMunicipalities: jest.fn().mockResolvedValue(undefined),
    } as unknown as MunicipalitySyncRepository;

    return {
      service: new MunicipalitySyncService(
        syncApiRepository,
        municipalitySyncRepository,
      ),
      syncApiRepository: syncApiRepository as {get: ReturnType<typeof jest.fn>},
      municipalitySyncRepository: municipalitySyncRepository as {
        getLocalVersion: ReturnType<typeof jest.fn>;
        replaceMunicipalities: ReturnType<typeof jest.fn>;
      },
    };
  }

  it('loads municipality version, fetches municipalities, and saves them', async () => {
    const versionResponse = {
      Resultado: {
        Codigo: 7,
        Versão: 3,
        TipoRecurso: 7,
      },
      Status: 1,
      Mensagens: [],
    };
    const municipalities = [
      {
        Codigo: 1,
        MunicipioCodigo: 1501402,
        MunicipioNome: 'Belem',
        UFCodigo: 15,
        UFNome: 'Para',
        UFSigla: 'PA',
        PaisCodigo: 55,
        PaisNome: 'Brasil',
      },
    ];
    const municipalityResponse = {
      Resultado: municipalities,
      Status: 1,
      Mensagens: [],
    };
    const {service, syncApiRepository, municipalitySyncRepository} =
      createService(versionResponse, municipalityResponse);

    await expect(
      service.sync(user, organizationCode, 'sync'),
    ).resolves.toEqual({
      itemCount: 1,
      message: 'Municípios sincronizados.',
    });

    expect(syncApiRepository.get).toHaveBeenNthCalledWith(
      1,
      'arc/atualizacao/recurso/tipo?tipo=7',
      user,
      organizationCode,
    );
    expect(syncApiRepository.get).toHaveBeenNthCalledWith(
      2,
      'arc/endereco/municipio',
      user,
      organizationCode,
    );
    expect(
      municipalitySyncRepository.replaceMunicipalities,
    ).toHaveBeenCalledWith(municipalities, {
      Codigo: 7,
      Versao: 3,
      TipoRecurso: 7,
    });
  });

  it('skips the municipality download when the local version is already current', async () => {
    const {service, syncApiRepository, municipalitySyncRepository} =
      createService({
        Resultado: {
          Codigo: 7,
          Versao: 3,
          TipoRecurso: 7,
        },
        Status: 1,
        Mensagens: [],
      });
    municipalitySyncRepository.getLocalVersion.mockResolvedValue(3);

    await expect(
      service.sync(user, organizationCode, 'sync'),
    ).resolves.toEqual({
      skipped: true,
      message: 'Os municípios já estão atualizados.',
    });

    expect(syncApiRepository.get).toHaveBeenCalledTimes(1);
    expect(
      municipalitySyncRepository.replaceMunicipalities,
    ).not.toHaveBeenCalled();
  });
});
