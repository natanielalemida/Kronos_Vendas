import {z} from 'zod';

export const customerSummaryRequiredSchema = z.object({
  CNPJCPF: z.string().trim().min(1),
  CEP: z.string().trim().min(1),
  Municipio: z.object({
    Codigo: z.number(),
    MunicipioNome: z.string().trim().min(1),
  }),
  NomeFantasia: z.string().trim().min(1),
});
