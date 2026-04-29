import {z} from 'zod';

export const syncExecutionContextSchema = z.object({
  organizationCode: z.number().int().positive(),
  userHash: z.string().trim().min(1),
});

export const syncApiProductSchema = z.object({
  Estoque: z.number(),
  Codigo: z.number().int(),
  Referencia: z.string().nullable(),
  Descricao: z.string().nullable(),
  UnidadeMedida: z.string().nullable(),
  CodigoDeBarras: z.string().nullable(),
  ValorVenda: z.number(),
  VendeProdutoNoAtacado: z.boolean(),
  ValorVendaAtacado: z.number(),
  CodigoBarrasAtacado: z.string().nullable(),
  UnidadeMedidaAtacado: z.string().nullable(),
  PermiteFracionar: z.boolean(),
  CodigoSetor: z.number().int(),
  CodigoGrupo: z.number().int().nullable(),
  CodigoSubGrupo: z.number().int().nullable(),
  CodigoMarca: z.number().int().nullable(),
});

export const syncProductsApiResponseSchema = z.object({
  Resultado: z.array(syncApiProductSchema),
  Status: z.number(),
  Mensagens: z.array(z.string()),
});
