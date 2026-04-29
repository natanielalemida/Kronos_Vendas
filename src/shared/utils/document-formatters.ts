export function formatCpf(value?: string): string {
  if (!value) {
    return '';
  }

  const numericValue = value.replace(/\D/g, '');

  return numericValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export function formatCnpj(value?: string): string {
  if (!value) {
    return '';
  }

  const numericValue = value.replace(/\D/g, '');

  return numericValue.replace(
    /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
    '$1.$2.$3/$4-$5',
  );
}
