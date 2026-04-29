import {z} from 'zod';

export const storedSettingsSchema = z.object({
  id: z.number().int().positive(),
  host: z.string().min(1),
  cod_loja: z.number().int().nonnegative(),
  terminal: z.number().int().nonnegative(),
  idConecction: z.number().int().positive(),
});
