import {z} from 'zod';

export const connectionSettingsFormSchema = z.object({
  codStore: z.string().min(1, 'Informe o código da loja'),
  host: z.string().min(1, 'Informe o host'),
  terminal: z.string().min(1, 'Informe o terminal'),
});

export const saveSettingsSchema = z.object({
  id: z.number().int().positive(),
  host: z.string().min(1),
  cod_loja: z.number().int().nonnegative(),
  terminal: z.number().int().nonnegative(),
});
