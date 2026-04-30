import {beforeEach, describe, expect, it, jest} from '@jest/globals';

import ApiInstace from '@/api/ApiInstace';

import {OrganizationService} from './organization.service';

jest.mock('@/api/ApiInstace', () => ({
  __esModule: true,
  default: {
    openUrlTimer: jest.fn(),
  },
}));

describe('OrganizationService', () => {
  const organizationService = new OrganizationService();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('requests organization summaries from the timeout endpoint', async () => {
    (ApiInstace.openUrlTimer as ReturnType<typeof jest.fn>).mockResolvedValue({
      Resultado: [
        {
          Codigo: 1,
          NomeFantasia: 'DEMO RESTAURANTE',
        },
      ],
    });

    const result = await organizationService.getSummaries();

    expect(ApiInstace.openUrlTimer).toHaveBeenCalledWith({
      data: undefined,
      endPoint: 'arc/empresa/resumo',
      headers: undefined,
      method: 'get',
    });
    expect(result).toEqual([
      {
        Codigo: 1,
        NomeFantasia: 'DEMO RESTAURANTE',
      },
    ]);
  });

  it('returns an empty array when the API returns no response', async () => {
    (ApiInstace.openUrlTimer as ReturnType<typeof jest.fn>).mockResolvedValue(
      undefined,
    );

    await expect(organizationService.getSummaries()).resolves.toEqual([]);
  });
});
