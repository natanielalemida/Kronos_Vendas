import {z} from 'zod';

export const salesSearchSchema = z.object({
  searchText: z.string().trim().max(100).default(''),
});

export const salesDraftRouteParamsSchema = z.object({
  id: z.number().int().positive().optional(),
});

export const salesCheckoutPaymentSelectionSchema = z.object({
  paymentMethodCode: z.number().int().positive(),
  paymentConditionCode: z.number().int().positive(),
  amount: z.number().nonnegative(),
});

export const salesCheckoutConditionSchema = z.object({
  Codigo: z.number().int().positive(),
  CodigoFormaPagamento: z.number().int().positive(),
  QtdeParcelas: z.number().int().positive(),
  IntervaloDias: z.number().int().nonnegative(),
  QtdeDiasParcelaInicial: z.number().int().nonnegative(),
  Ativo: z.boolean(),
  Tarifas: z.string(),
  ValorPago: z.number().nonnegative().optional(),
});

export const salesCheckoutPaymentMethodSchema = z.object({
  id: z.number().int().nonnegative(),
  Codigo: z.number().int().positive(),
  Descricao: z.string().trim().min(1),
  EmissaoCupomFiscalObrigatoria: z.boolean(),
  FormaPagamentoPadrao: z.number().int(),
  Identificador: z.number().int(),
  IntervaloDias: z.number().int().nonnegative(),
  IsCartao: z.boolean(),
  IsPrazo: z.boolean(),
  IsRecebimentoEmConta: z.boolean(),
  PermitePagamentoPromocao: z.boolean(),
  PermiteRecebimento: z.boolean(),
  QtdeDiasParcelaInicial: z.number().int().nonnegative(),
  QtdeParcelas: z.number().int().positive(),
  SolicitarDadosOperadoraBandeiraCartao: z.boolean(),
  Tarifas: z.string(),
  UtilizaCreditoDevolucao: z.boolean(),
  CondicaoPagamento: z.array(salesCheckoutConditionSchema),
});

export const salesCheckoutProductSchema = z.object({
  Codigo: z.number().int().positive(),
  Referencia: z.string(),
  Descricao: z.string().trim().min(1),
  UnidadeMedida: z.string().trim().min(1),
  CodigoDeBarras: z.string(),
  ValorVendaDesconto: z.number().nonnegative(),
  ValorVenda: z.number().nonnegative(),
  VendeProdutoNoAtacado: z.boolean(),
  ValorVendaAtacado: z.number().nonnegative(),
  CodigoBarrasAtacado: z.string(),
  UnidadeMedidaAtacado: z.string(),
  PermiteFracionar: z.boolean(),
  CodigoSetor: z.number().int(),
  CodigoGrupo: z.number().int(),
  CodigoSubGrupo: z.number().int().nullable(),
  CodigoMarca: z.number().int().nullable(),
  Quantidade: z.number().positive(),
  Observacao: z.string(),
});

export const saveSalesCheckoutSchema = z.object({
  customerCode: z.number().int().positive().optional(),
  note: z.string().max(500),
  orderId: z.number().int().positive().optional(),
  paymentMethods: z.array(salesCheckoutPaymentMethodSchema),
  products: z.array(salesCheckoutProductSchema).min(1),
});
