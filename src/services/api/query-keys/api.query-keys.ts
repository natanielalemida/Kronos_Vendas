export const apiQueryKeys = {
  all: ['api'] as const,
  connection: () => [...apiQueryKeys.all, 'connection'] as const,
};
