import {z} from 'zod';

export const orderSummaryRouteParamsSchema = z.object({
  Codigo: z.number().optional(),
  goBack: z.boolean().optional(),
  id: z.number(),
  idCliente: z.number().nullish(),
});
