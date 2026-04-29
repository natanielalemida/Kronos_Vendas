import {z} from 'zod';

export const organizationOptionSchema = z.object({
  NomeFantasia: z.string(),
  Codigo: z.number().int(),
});

const userSchema = z.object({
  Codigo: z.number().int(),
  CodigoPessoa: z.number().int(),
  Referencia: z.string(),
  Login: z.string(),
  Senha: z.string(),
  SenhaConfirmacao: z.string().nullable(),
  Hash: z.string(),
  CargoDescricao: z.string(),
  DescontoMaximoVenda: z.number(),
  DescontoMaximoRecebimento: z.number(),
  UsuarioAdministrador: z.boolean(),
  Image: z.string().nullable(),
  Privilegios: z.array(z.string()).optional().default([]),
  CNPJCPF: z.string().optional().default(''),
  AsResponsavelOperacao: z
    .object({
      CodigoUsuario: z.number().int(),
      Nome: z.string(),
      DescontoMaximoVenda: z.number(),
      DescontoMaximoRecebimento: z.number(),
    })
    .optional()
    .default({
      CodigoUsuario: 0,
      Nome: '',
      DescontoMaximoVenda: 0,
      DescontoMaximoRecebimento: 0,
    }),
});

export const loginResponseSchema = z.object({
  Resultado: z
    .object({
      Usuario: userSchema.optional(),
    })
    .optional(),
  Status: z.number(),
  Mensagens: z.array(z.string()),
});

export const companyResponseSchema = z.object({
  Resultado: z.object({
    Codigo: z.number().int(),
    NomeFantasia: z.string(),
  }),
  Mensagens: z.array(z.string()),
});

export const organizationSummaryResponseSchema = z.object({
  Resultado: z.array(organizationOptionSchema),
});
