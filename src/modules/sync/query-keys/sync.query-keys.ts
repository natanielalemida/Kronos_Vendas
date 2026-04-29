export const syncQueryKeys = {
  all: ['sync'] as const,
  lastSync: (organizationCode: number | undefined) =>
    [...syncQueryKeys.all, 'last-sync', organizationCode ?? 'unknown'] as const,
};
