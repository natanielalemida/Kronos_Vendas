export const settingsQueryKeys = {
  all: ['settings'] as const,
  localParameters: () =>
    [...settingsQueryKeys.all, 'local-parameters'] as const,
};
