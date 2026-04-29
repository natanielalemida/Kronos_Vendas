import {CustomerRepository} from '@/services/repositories/customers/customer.repository';
import {CustomerForm} from '@/shared/types/customer-form.types';

import {mapCustomerFormToSavePayload} from '../mappers/customer-form.mapper';
import {CustomerEditRepository} from '../repositories/customer-edit.repository';

export class CustomerFormService {
  private readonly customerEditRepository = new CustomerEditRepository();
  private readonly customerRepository = new CustomerRepository();

  private validateCpf(cpf: string): boolean {
    const normalizedCpf = cpf.replace(/[^\d]+/g, '');

    if (normalizedCpf.length !== 11 || /^(\d)\1+$/.test(normalizedCpf)) {
      return false;
    }

    let total = 0;
    for (let index = 1; index <= 9; index += 1) {
      total += Number.parseInt(normalizedCpf.charAt(index - 1), 10) * (11 - index);
    }

    let remainder = (total * 10) % 11;
    remainder = remainder === 10 || remainder === 11 ? 0 : remainder;
    if (remainder !== Number.parseInt(normalizedCpf.charAt(9), 10)) {
      return false;
    }

    total = 0;
    for (let index = 1; index <= 10; index += 1) {
      total += Number.parseInt(normalizedCpf.charAt(index - 1), 10) * (12 - index);
    }

    remainder = (total * 10) % 11;
    remainder = remainder === 10 || remainder === 11 ? 0 : remainder;
    return remainder === Number.parseInt(normalizedCpf.charAt(10), 10);
  }

  private validateCnpj(cnpj: string): boolean {
    const normalizedCnpj = cnpj.replace(/[^\d]+/g, '');

    if (normalizedCnpj.length !== 14 || /^(\d)\1+$/.test(normalizedCnpj)) {
      return false;
    }

    let size = normalizedCnpj.length - 2;
    let numbers = normalizedCnpj.substring(0, size);
    const digits = normalizedCnpj.substring(size);
    let sum = 0;
    let position = size - 7;

    for (let index = size; index >= 1; index -= 1) {
      sum += Number.parseInt(numbers.charAt(size - index), 10) * position--;
      if (position < 2) {
        position = 9;
      }
    }

    let remainder = sum % 11;
    remainder = remainder < 2 ? 0 : 11 - remainder;
    if (remainder !== Number.parseInt(digits.charAt(0), 10)) {
      return false;
    }

    size += 1;
    numbers = normalizedCnpj.substring(0, size);
    sum = 0;
    position = size - 7;

    for (let index = size; index >= 1; index -= 1) {
      sum += Number.parseInt(numbers.charAt(size - index), 10) * position--;
      if (position < 2) {
        position = 9;
      }
    }

    remainder = sum % 11;
    remainder = remainder < 2 ? 0 : 11 - remainder;
    return remainder === Number.parseInt(digits.charAt(1), 10);
  }

  private validateDocument(document: string): boolean {
    const normalizedDocument = document.replace(/[^\d]+/g, '');

    if (normalizedDocument.length === 11) {
      return this.validateCpf(normalizedDocument);
    }

    if (normalizedDocument.length === 14) {
      return this.validateCnpj(normalizedDocument);
    }

    return false;
  }

  async saveOrUpdate(customerForm: CustomerForm) {
    const payload = mapCustomerFormToSavePayload(customerForm);
    const customerDocument = payload.Cliente.CNPJCPF;

    if (!customerDocument) {
      throw new Error('Customer document is required');
    }

    if (!this.validateDocument(customerDocument)) {
      throw new Error('CNPJ/CPF inválido');
    }

    const existingCustomer = await this.customerRepository.getByCnpjCpf(
      customerDocument,
    );

    if (existingCustomer && !payload.Cliente.id) {
      throw new Error('Cliente com o mesmo CNPJ/CPF já cadastrado');
    }

    if (payload.Cliente.id) {
      const currentCustomer = await this.customerEditRepository.findByCode(
        payload.Cliente.id,
      );

      if (!currentCustomer?.id) {
        return this.customerEditRepository.save(payload);
      }

      return this.customerEditRepository.update({
        ...payload,
        Endereco: {
          ...payload.Endereco,
          id: currentCustomer.EnderecoId,
        },
      });
    }

    return this.customerEditRepository.save(payload);
  }
}
