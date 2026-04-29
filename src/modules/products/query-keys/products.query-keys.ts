export const productsQueryKeys = {
  all: ['products'] as const,
  details: (productCode: number) =>
    [...productsQueryKeys.all, 'details', productCode] as const,
  list: (searchText: string) =>
    [...productsQueryKeys.all, 'list', searchText] as const,
};
