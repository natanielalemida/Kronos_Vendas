import {describe, expect, it} from '@jest/globals';

import {formatCustomerDocument} from './customer-form.helpers';

describe('formatCustomerDocument', () => {
  it('applies partial cpf mask while typing', () => {
    expect(formatCustomerDocument('1')).toBe('1');
    expect(formatCustomerDocument('1234')).toBe('123.4');
    expect(formatCustomerDocument('1234567')).toBe('123.456.7');
    expect(formatCustomerDocument('12345678901')).toBe('123.456.789-01');
  });

  it('applies partial cnpj mask for company documents', () => {
    expect(formatCustomerDocument('123456789012')).toBe('12.345.678/9012');
    expect(formatCustomerDocument('12345678901234')).toBe('12.345.678/9012-34');
  });
});
