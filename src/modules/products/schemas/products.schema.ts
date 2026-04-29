import {z} from 'zod';

export const productsFilterSchema = z.object({
  searchText: z.string().trim().max(100).default(''),
});

export const productRouteParamsSchema = z.object({
  id: z.number(),
});
