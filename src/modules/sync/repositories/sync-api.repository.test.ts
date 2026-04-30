import {beforeEach, describe, expect, it, jest} from '@jest/globals';

import ApiInstace from '@/api/ApiInstace';

import {SyncApiRepository} from './sync-api.repository';

jest.mock('@/api/ApiInstace', () => ({
  __esModule: true,
  default: {
    openUrl: jest.fn(),
  },
}));

describe('SyncApiRepository', () => {
  const syncApiRepository = new SyncApiRepository();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sends the auth hash and company code headers for sync requests', async () => {
    (ApiInstace.openUrl as ReturnType<typeof jest.fn>).mockResolvedValue({
      Status: 1,
    });

    await syncApiRepository.get('arc/produto/vendas/mobile', {Hash: 'hash'}, 1);

    expect(ApiInstace.openUrl).toHaveBeenCalledWith({
      data: undefined,
      method: 'get',
      endPoint: 'arc/produto/vendas/mobile',
      headers: {
        Auth: 'hash',
        Empresa: 1,
      },
    });
  });
});
