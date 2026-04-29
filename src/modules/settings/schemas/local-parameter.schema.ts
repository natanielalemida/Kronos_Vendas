import {z} from 'zod';

export const localParameterSchema = z.object({
  Ativo: z.boolean(),
  Descricao: z.string().trim().min(1),
  Valor: z.string().trim().nullable(),
  id: z.number().optional(),
});

export const localParametersSchema = z.array(localParameterSchema);
