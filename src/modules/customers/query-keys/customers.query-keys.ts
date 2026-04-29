export const customersQueryKeys = {
  all: ['customers'] as const,
  list: (searchText: string) =>
    [...customersQueryKeys.all, 'list', searchText] as const,
};
