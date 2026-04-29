import {z} from 'zod';

export const customersFilterSchema = z.object({
  searchText: z.string().trim().max(100).default(''),
});
