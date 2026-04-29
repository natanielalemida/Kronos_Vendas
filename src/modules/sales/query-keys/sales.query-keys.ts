export const salesQueryKeys = {
  all: ['sales'] as const,
  paymentMethods: () => [...salesQueryKeys.all, 'payment-methods'] as const,
};
