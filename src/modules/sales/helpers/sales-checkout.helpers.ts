import {CondicaoPagamento, FormaPagamento} from '@/modules/sync/types/payment-method-sync.types';
import {ProdutoBodyCreateQtAndObsDto} from '@/modules/sync/types/product-sync.types';
import {SalesCheckout} from '@/shared/types/sales-draft.types';

export function sanitizeDecimalInput(value: string): number {
  const sanitizedValue = value.replace(',', '.').replace(/[^0-9.]/g, '');
  const parsedValue = Number.parseFloat(sanitizedValue);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

export function roundCurrency(value: number): number {
  return Number(value.toFixed(2));
}

export function formatCurrencyInput(value: number): string {
  return roundCurrency(value).toFixed(2);
}

export function calculateGrossTotal(products: ProdutoBodyCreateQtAndObsDto[]): number {
  return products.reduce((total, product) => {
    return total + product.Quantidade * product.ValorVenda;
  }, 0);
}

export function calculateNetTotal(products: ProdutoBodyCreateQtAndObsDto[]): number {
  return products.reduce((total, product) => {
    return total + product.Quantidade * product.ValorVendaDesconto;
  }, 0);
}

export function calculateDiscountPercent({
  grossTotal,
  netTotal,
}: {
  grossTotal: number;
  netTotal: number;
}): number {
  if (!grossTotal) {
    return 0;
  }

  return roundCurrency(((grossTotal - netTotal) / grossTotal) * 100);
}

export function applyDiscountPercent(
  products: ProdutoBodyCreateQtAndObsDto[],
  discountPercent: number,
): ProdutoBodyCreateQtAndObsDto[] {
  return products.map(product => {
    const discountValue = product.ValorVenda * (discountPercent / 100);

    return {
      ...product,
      ValorVendaDesconto: roundCurrency(product.ValorVenda - discountValue),
    };
  });
}

export function buildCheckoutDraft({
  products,
  discountPercent,
  note,
}: {
  products: ProdutoBodyCreateQtAndObsDto[];
  discountPercent: number;
  note: string;
}): SalesCheckout {
  const grossTotal = calculateGrossTotal(products);
  const netTotal = calculateNetTotal(products);

  return {
    ValorBruto: roundCurrency(grossTotal),
    Desconto: roundCurrency(discountPercent),
    ValorTotal: roundCurrency(netTotal),
    Observacao: note,
  };
}

export function clampDiscountPercent(value: number, maxDiscountPercent: number): number {
  return Math.max(0, Math.min(roundCurrency(value), roundCurrency(maxDiscountPercent)));
}

export function clampNetTotal({
  grossTotal,
  maxDiscountPercent,
  requestedNetTotal,
}: {
  grossTotal: number;
  maxDiscountPercent: number;
  requestedNetTotal: number;
}): number {
  const minimumNetTotal = grossTotal - grossTotal * (maxDiscountPercent / 100);
  return Math.min(grossTotal, Math.max(roundCurrency(minimumNetTotal), roundCurrency(requestedNetTotal)));
}

export function getRemainingPaymentAmount({
  checkout,
  paidAmount,
}: {
  checkout?: SalesCheckout;
  paidAmount: number;
}): number {
  return Math.max(0, roundCurrency((checkout?.ValorTotal ?? 0) - paidAmount));
}

export function buildSelectedPaymentMethod({
  paymentMethod,
  paymentCondition,
  amount,
}: {
  paymentMethod: FormaPagamento;
  paymentCondition: CondicaoPagamento;
  amount: number;
}): FormaPagamento {
  return {
    ...paymentMethod,
    CondicaoPagamento: [
      {
        ...paymentCondition,
        ValorPago: roundCurrency(amount),
      },
    ],
  };
}

export function upsertSelectedPaymentMethod({
  paymentMethods,
  paymentMethod,
  paymentCondition,
  amount,
}: {
  paymentMethods: FormaPagamento[];
  paymentMethod: FormaPagamento;
  paymentCondition: CondicaoPagamento;
  amount: number;
}): FormaPagamento[] {
  const existingPaymentMethodIndex = paymentMethods.findIndex(
    currentPaymentMethod => currentPaymentMethod.id === paymentMethod.id,
  );

  if (existingPaymentMethodIndex === -1) {
    return [
      ...paymentMethods,
      buildSelectedPaymentMethod({paymentMethod, paymentCondition, amount}),
    ];
  }

  return paymentMethods.map((currentPaymentMethod, index) => {
    if (index !== existingPaymentMethodIndex) {
      return currentPaymentMethod;
    }

    return {
      ...currentPaymentMethod,
      CondicaoPagamento: [
        ...currentPaymentMethod.CondicaoPagamento,
        {
          ...paymentCondition,
          ValorPago: roundCurrency(amount),
        },
      ],
    };
  });
}

export function removeSelectedPaymentMethod({
  paymentMethods,
  paymentMethodCode,
}: {
  paymentMethods: FormaPagamento[];
  paymentMethodCode: number;
}) {
  return paymentMethods.filter(
    paymentMethod => paymentMethod.Codigo !== paymentMethodCode,
  );
}

export function calculatePaidAmount(paymentMethods: FormaPagamento[]): number {
  return roundCurrency(
    paymentMethods.reduce((total, paymentMethod) => {
      return (
        total +
        paymentMethod.CondicaoPagamento.reduce((subtotal, condition) => {
          return subtotal + (condition.ValorPago ?? 0);
        }, 0)
      );
    }, 0),
  );
}

export function splitAmount(amount: number, parts: number): number[] {
  const totalInCents = Math.round(amount * 100);
  const baseValueInCents = Math.floor(totalInCents / parts);
  const valuesInCents = Array(parts).fill(baseValueInCents) as number[];

  valuesInCents[parts - 1] += totalInCents - baseValueInCents * parts;

  return valuesInCents.map(value => value / 100);
}

export function addDays(baseDate: Date, days: number): Date {
  const nextDate = new Date(baseDate);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

export function formatDate(value: Date): string {
  return value.toLocaleDateString('pt-BR');
}
