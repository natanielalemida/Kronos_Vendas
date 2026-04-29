import {z} from 'zod';

const customerUploadMunicipalitySchema = z.object({
  Codigo: z.number().int().nonnegative(),
  MunicipioCodigo: z.number().int().nonnegative(),
  MunicipioNome: z.string().nullable(),
  UFCodigo: z.number().int().nonnegative(),
  UFNome: z.string().nullable(),
  UFSigla: z.string().nullable(),
  PaisCodigo: z.number().int().nonnegative(),
  PaisNome: z.string(),
});

const customerUploadAddressSchema = z.object({
  CodigoMunicipio: z.number().int().nonnegative(),
  Codigo: z.number().int().nonnegative(),
  CodigoPessoa: z.number().int().nonnegative(),
  Tipo: z.number().int(),
  TipoDescricao: z.string(),
  CEP: z.string(),
  Logradouro: z.string(),
  Numero: z.string(),
  Bairro: z.string(),
  Complemento: z.string(),
  Municipio: customerUploadMunicipalitySchema,
});

const customerUploadContactSchema = z.object({
  Codigo: z.number().int().nonnegative(),
  CodigoPessoa: z.number().int().nonnegative(),
  Tipo: z.number().int(),
  Contato: z.string(),
});

const customerUploadCategoryRegionSchema = z.object({
  Codigo: z.number().int().nonnegative(),
  Descricao: z.string(),
});

const customerUploadManagerSchema = z.object({
  CodigoUsuario: z.number().int().nonnegative(),
  Nome: z.string().nullable(),
  DescontoMaximoVenda: z.number(),
  DescontoMaximoRecebimento: z.number(),
});

export const customerUploadPayloadSchema = z.object({
  Codigo: z.number().int().nonnegative(),
  Categoria: z.union([z.number(), z.string()]).nullable(),
  Regiao: z.union([z.number(), z.string()]).nullable(),
  DiaPagamento: z.number().int(),
  LimiteCompra: z.number(),
  BloquearCliente: z.boolean(),
  ForcarAtualizacaoCadastro: z.boolean(),
  CarenciaPagamento: z.number().int(),
  DescontoMaximo: z.number(),
  DataNascimento: z.string().nullable(),
  TipoPreco: z.string().nullable(),
  PessoaReferencia: z.union([z.array(z.unknown()), z.string()]).nullable(),
  AcrescimoPercentual: z.number(),
  Veiculos: z.union([z.unknown(), z.string()]).nullable(),
  PermiteComprarPazo: z.boolean(),
  CodigoPessoa: z.number().int().nonnegative(),
  PessoaFJ: z.number().int(),
  RazaoSocial: z.string(),
  NomeFantasia: z.string(),
  CNPJCPF: z.string(),
  IERG: z.string(),
  TipoContribuinte: z.number().int(),
  Observacao: z.string(),
  Ativo: z.boolean(),
  ResponsavelCadastro: customerUploadManagerSchema,
  DataCadastro: z.string(),
  Enderecos: z.array(customerUploadAddressSchema),
  Contatos: z.array(customerUploadContactSchema).nullable(),
});

export const customerUploadResultSchema = z.object({
  id: z.number().int().positive().optional(),
  Codigo: z.number().int().positive(),
  isSincronizado: z.number().int().optional(),
  Categoria: customerUploadCategoryRegionSchema.nullable(),
  Regiao: customerUploadCategoryRegionSchema.nullable(),
  DiaPagamento: z.number().int(),
  LimiteCompra: z.number(),
  BloquearCliente: z.boolean(),
  ForcarAtualizacaoCadastro: z.boolean(),
  CarenciaPagamento: z.number().int(),
  DescontoMaximo: z.number(),
  DataNascimento: z.string().nullable(),
  TipoPreco: z.string().nullable(),
  PessoaReferencia: z.array(z.unknown()),
  MeiosPagamento: z.array(z.unknown()).optional().default([]),
  AcrescimoPercentual: z.number(),
  Veiculos: z.unknown().nullable(),
  PermiteComprarPazo: z.boolean(),
  CodigoPessoa: z.number().int().nonnegative(),
  PessoaFJ: z.number().int(),
  RazaoSocial: z.string(),
  NomeFantasia: z.string(),
  CNPJCPF: z.string(),
  IERG: z.string().nullable(),
  TipoContribuinte: z.number().int(),
  Observacao: z.string().nullable(),
  Ativo: z.boolean(),
  DataCadastro: z.string(),
  ResponsavelCadastro: customerUploadManagerSchema,
  Enderecos: z.array(customerUploadAddressSchema),
  Contatos: z.array(customerUploadContactSchema),
});

export const customerUploadApiResponseSchema = z.object({
  Resultado: customerUploadResultSchema,
  Status: z.number(),
  Mensagens: z.array(
    z.object({
      Conteudo: z.string().optional(),
      conteudo: z.string().optional(),
    }),
  ),
});
