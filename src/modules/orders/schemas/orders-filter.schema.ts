import {z} from 'zod';

export const ordersFilterSchema = z.object({
  clienteId: z.number().optional(),
  notSyncd: z.boolean(),
  syncds: z.boolean(),
});

export const ordersSearchSchema = z.object({
  textFilter: z.string().trim().max(100).default(''),
});

export const ordersRouteParamsSchema = z.object({
  clienteId: z.number().optional(),
});
