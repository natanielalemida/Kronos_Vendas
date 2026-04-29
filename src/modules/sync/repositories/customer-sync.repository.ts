import {Knex} from 'knex';

import {knexConfig} from '@/database/connection';

import {
  ClienteDto,
  ContatoDto,
  EnderecoDto,
} from '../types/customer-sync.types';
import {KnexBatchRepository} from './knex-batch.repository';

type CustomerRow = {
  Codigo: number;
  CategoriaCodigo: number | null;
  RegiaoCodigo: number | null;
  DiaPagamento: number;
  LimiteCompra: number;
  DescontoMaximo: number;
  TipoPreco: string | null;
  AcrescimoPercentual: number | null;
  PermiteComprarPazo: boolean;
  CodigoPessoa: number;
  isSincronizado: number;
  PessoaFJ: number;
  RazaoSocial: string;
  NomeFantasia: string | null;
  CNPJCPF: string | null;
  IERG: string | null;
  TipoContribuinte: number;
  Observacao: string | null;
  Ativo: boolean;
  DataCadastro: Date;
};

type AddressRow = {
  Codigo: number;
  CodigoPessoa: number;
  Tipo: number;
  TipoDescricao: string;
  CEP: string;
  Logradouro: string;
  Numero: string;
  Bairro: string;
  Complemento: string;
  CodigoMunicipio: number;
};

type ContactRow = {
  Codigo: number;
  CodigoPessoa: number;
  Tipo: number;
  Contato: string;
};

function createCustomerRow(customer: ClienteDto): CustomerRow {
  return {
    Codigo: customer.Codigo,
    CategoriaCodigo: customer.Categoria?.Codigo ?? null,
    RegiaoCodigo: customer.Regiao?.Codigo ?? null,
    DiaPagamento: customer.DiaPagamento,
    LimiteCompra: customer.LimiteCompra,
    DescontoMaximo: customer.DescontoMaximo,
    TipoPreco: customer.TipoPreco ?? null,
    AcrescimoPercentual: customer.AcrescimoPercentual ?? null,
    PermiteComprarPazo: customer.PermiteComprarPazo,
    CodigoPessoa: customer.CodigoPessoa,
    isSincronizado: customer.isSincronizado === 0 ? 0 : 1,
    PessoaFJ: customer.PessoaFJ,
    RazaoSocial: customer.RazaoSocial,
    NomeFantasia: customer.NomeFantasia ?? null,
    CNPJCPF: customer.CNPJCPF ?? null,
    IERG: customer.IERG ?? null,
    TipoContribuinte: customer.TipoContribuinte,
    Observacao: customer.Observacao ?? null,
    Ativo: customer.Ativo,
    DataCadastro: new Date(customer.DataCadastro),
  };
}

function createAddressRows(addresses: EnderecoDto[]): AddressRow[] {
  return addresses.map(address => ({
    Codigo: address.Codigo,
    CodigoPessoa: address.CodigoPessoa,
    Tipo: address.Tipo,
    TipoDescricao: address.TipoDescricao,
    CEP: address.CEP,
    Logradouro: address.Logradouro,
    Numero: address.Numero,
    Bairro: address.Bairro,
    Complemento: address.Complemento,
    CodigoMunicipio: address.Municipio.MunicipioCodigo,
  }));
}

function createContactRows(contacts: ContatoDto[]): ContactRow[] {
  return contacts.map(contact => ({
    Codigo: contact.Codigo,
    CodigoPessoa: contact.CodigoPessoa,
    Tipo: contact.Tipo,
    Contato: contact.Contato,
  }));
}

function uniqueRows<T extends {Codigo: number}>(rows: T[]): T[] {
  const rowMap = new Map<number, T>();

  rows.forEach(row => {
    rowMap.set(row.Codigo, row);
  });

  return [...rowMap.values()];
}

export class CustomerSyncRepository {
  private readonly knexBatchRepository = new KnexBatchRepository();

  async replaceCustomers(customers: ClienteDto[]): Promise<void> {
    const customerRows = customers.map(createCustomerRow);
    const addressRows = customers.flatMap(customer =>
      createAddressRows(customer.Enderecos),
    );
    const contactRows = customers.flatMap(customer =>
      createContactRows(customer.Contatos),
    );
    const regionRows = uniqueRows(
      customers
        .flatMap(customer => (customer.Regiao ? [customer.Regiao] : []))
        .map(region => ({
          Codigo: region.Codigo,
          Descricao: region.Descricao,
        })),
    );
    const categoryRows = uniqueRows(
      customers
        .flatMap(customer => (customer.Categoria ? [customer.Categoria] : []))
        .map(category => ({
          Codigo: category.Codigo,
          Descricao: category.Descricao,
        })),
    );

    await knexConfig.transaction(async (transaction: Knex.Transaction) => {
      await transaction('contato').whereNotNull('Codigo').del();
      await transaction('endereco').where('Codigo', '!=', 0).del();
      await transaction('pessoa')
        .whereNotNull('Codigo')
        .orWhere('Codigo', '!=', 0)
        .del();
      await transaction('regiao').del();
      await transaction('categoria').del();

      await this.knexBatchRepository.insertInChunks(
        transaction,
        'regiao',
        regionRows,
      );
      await this.knexBatchRepository.insertInChunks(
        transaction,
        'categoria',
        categoryRows,
      );
      await this.knexBatchRepository.insertInChunks(
        transaction,
        'pessoa',
        customerRows,
      );
      await this.knexBatchRepository.insertInChunks(
        transaction,
        'endereco',
        addressRows,
      );
      await this.knexBatchRepository.insertInChunks(
        transaction,
        'contato',
        contactRows,
      );
    });
  }
}
