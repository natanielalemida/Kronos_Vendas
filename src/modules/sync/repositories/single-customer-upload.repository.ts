import {knexConfig} from '@/database/connection';
import {UserDto} from '@/shared/types';
import {CustomerEditRepository} from '@/modules/customers/repositories/customer-edit.repository';

import {CustomerUploadMapper} from '../mappers/customer-upload.mapper';
import {
  CustomerUploadResult,
  PendingCustomerPayload,
} from '../types/customer-upload.types';

export class SingleCustomerUploadRepository {
  private readonly mapper = new CustomerUploadMapper();
  private readonly customerEditRepository = new CustomerEditRepository();

  async getPendingCustomers(user: UserDto): Promise<PendingCustomerPayload[]> {
    const rows = await knexConfig('pessoa')
      .select(
        'pessoa.id',
        'pessoa.Codigo',
        'pessoa.CategoriaCodigo',
        'pessoa.RegiaoCodigo',
        'pessoa.DiaPagamento',
        'pessoa.LimiteCompra',
        'pessoa.DescontoMaximo',
        'pessoa.TipoPreco',
        'pessoa.AcrescimoPercentual',
        'pessoa.PermiteComprarPazo',
        'pessoa.PessoaFJ',
        'pessoa.RazaoSocial',
        'pessoa.NomeFantasia',
        'pessoa.CNPJCPF',
        'pessoa.IERG',
        'pessoa.BloquearCliente',
        'pessoa.ForcarAtualizacaoCadastro',
        'pessoa.CarenciaPagamento',
        'pessoa.DataNascimento',
        'pessoa.PessoaReferencia',
        'pessoa.Veiculos',
        'pessoa.TipoContribuinte',
        'pessoa.Observacao',
        'pessoa.Ativo',
        'pessoa.DataCadastro',
        'endereco.Codigo as CodigoEndereco',
        'endereco.Tipo',
        'endereco.TipoDescricao',
        'endereco.CEP',
        'endereco.Logradouro',
        'endereco.Numero',
        'endereco.Bairro',
        'endereco.Complemento',
        'municipio.Codigo as CodigoMunicipio',
        'municipio.MunicipioCodigo',
        'municipio.UFCodigo',
        'municipio.MunicipioNome',
        'municipio.UFNome',
        'municipio.UFSigla',
        'municipio.PaisCodigo',
        'municipio.PaisNome',
        'contato.Tipo as TipoContato',
        'contato.Codigo as CodigoContato',
        'contato.Contato',
      )
      .innerJoin('endereco', 'endereco.CodigoPessoa', 'pessoa.id')
      .innerJoin('municipio', 'municipio.Codigo', 'endereco.CodigoMunicipio')
      .innerJoin('contato', 'contato.CodigoPessoa', 'pessoa.CodigoPessoa')
      .where('pessoa.isSincronizado', '0');

    return this.mapper.mapPendingCustomers(rows, user);
  }

  async getPendingCustomerById(
    user: UserDto,
    id: number,
  ): Promise<PendingCustomerPayload | undefined> {
    const customers = await this.getPendingCustomers(user);

    return customers.find(customer => customer.Codigo === id || customer.CodigoPessoa === id);
  }

  async getExistingAddressIdByCode(code: number) {
    if (!code) {
      return true;
    }

    const result = await knexConfig('pessoa')
      .select('endereco.id')
      .leftJoin('endereco', 'endereco.CodigoPessoa', 'pessoa.id')
      .first()
      .where('pessoa.Codigo', code);

    if (!result) {
      return result;
    }

    return undefined;
  }

  async getExistingAddressIdById(id: number) {
    if (!id) {
      return true;
    }

    const result = await knexConfig('pessoa')
      .select('endereco.id')
      .leftJoin('endereco', 'endereco.CodigoPessoa', 'pessoa.id')
      .first()
      .where('pessoa.id', id);

    if (!result) {
      return undefined;
    }

    return result.id;
  }

  async saveSyncedCustomer(
    customer: CustomerUploadResult,
    id: number,
    addressId: number,
  ) {
    const transaction = await knexConfig.transaction();

    try {
      await transaction('pessoa')
        .update({
          Codigo: customer.Codigo,
          CategoriaCodigo: customer.Categoria ? customer.Categoria.Codigo : null,
          RegiaoCodigo: customer.Regiao ? customer.Regiao.Codigo : null,
          isSincronizado: 1,
          DiaPagamento: customer.DiaPagamento,
          LimiteCompra: customer.LimiteCompra,
          DescontoMaximo: customer.DescontoMaximo,
          TipoPreco: customer.TipoPreco,
          AcrescimoPercentual: customer.AcrescimoPercentual,
          PermiteComprarPazo: customer.PermiteComprarPazo,
          CodigoPessoa: customer.CodigoPessoa,
          PessoaFJ: customer.PessoaFJ,
          RazaoSocial: customer.RazaoSocial,
          NomeFantasia: customer.NomeFantasia,
          CNPJCPF: customer.CNPJCPF,
          IERG: customer.IERG,
          TipoContribuinte: customer.TipoContribuinte,
          Observacao: customer.Observacao,
          Ativo: customer.Ativo,
        })
        .where('id', id);

      if (customer.Enderecos.length > 0) {
        await Promise.all(
          customer.Enderecos.map(async currentAddress => {
            await transaction('endereco')
              .update({
                Codigo: currentAddress.Codigo,
                CodigoPessoa: currentAddress.CodigoPessoa,
                Tipo: currentAddress.Tipo,
                TipoDescricao: currentAddress.TipoDescricao,
                CEP: currentAddress.CEP,
                Logradouro: currentAddress.Logradouro,
                Numero: currentAddress.Numero,
                Bairro: currentAddress.Bairro,
                Complemento: currentAddress.Complemento,
                CodigoMunicipio: currentAddress.Municipio.MunicipioCodigo,
              })
              .where('id', addressId);
          }),
        );
      }

      if (customer.Contatos.length > 0) {
        await Promise.all(
          customer.Contatos.map(async contact => {
            await transaction('contato')
              .update({
                Codigo: contact.Codigo,
                CodigoPessoa: contact.CodigoPessoa,
                Tipo: contact.Tipo,
                Contato: contact.Contato,
              })
              .where('Codigo', contact.Codigo);
          }),
        );
      }

      await transaction.commit();
      return this.customerEditRepository.findByCode(id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async insertSyncedCustomer(customer: CustomerUploadResult) {
    const transaction = await knexConfig.transaction();

    try {
      const [insertedCustomerId] = await transaction('pessoa').insert({
        Codigo: customer.Codigo,
        CategoriaCodigo: customer.Categoria ? customer.Categoria.Codigo : null,
        RegiaoCodigo: customer.Regiao ? customer.Regiao.Codigo : null,
        isSincronizado: 1,
        DiaPagamento: customer.DiaPagamento,
        LimiteCompra: customer.LimiteCompra,
        DescontoMaximo: customer.DescontoMaximo,
        TipoPreco: customer.TipoPreco,
        AcrescimoPercentual: customer.AcrescimoPercentual,
        PermiteComprarPazo: customer.PermiteComprarPazo,
        CodigoPessoa: customer.CodigoPessoa,
        PessoaFJ: customer.PessoaFJ,
        RazaoSocial: customer.RazaoSocial,
        NomeFantasia: customer.NomeFantasia,
        CNPJCPF: customer.CNPJCPF,
        IERG: customer.IERG,
        TipoContribuinte: customer.TipoContribuinte,
        Observacao: customer.Observacao,
        Ativo: customer.Ativo,
      });

      if (customer.Enderecos.length > 0) {
        await Promise.all(
          customer.Enderecos.map(async currentAddress => {
            await transaction('endereco').insert({
              Codigo: currentAddress.Codigo,
              CodigoPessoa: currentAddress.CodigoPessoa,
              Tipo: currentAddress.Tipo,
              TipoDescricao: currentAddress.TipoDescricao,
              CEP: currentAddress.CEP,
              Logradouro: currentAddress.Logradouro,
              Numero: currentAddress.Numero,
              Bairro: currentAddress.Bairro,
              Complemento: currentAddress.Complemento,
              CodigoMunicipio: currentAddress.Municipio.MunicipioCodigo,
            });
          }),
        );
      }

      if (customer.Contatos.length > 0) {
        await Promise.all(
          customer.Contatos.map(async contact => {
            await transaction('contato').insert({
              Codigo: contact.Codigo,
              CodigoPessoa: contact.CodigoPessoa,
              Tipo: contact.Tipo,
              Contato: contact.Contato,
            });
          }),
        );
      }

      await transaction.commit();
      return this.customerEditRepository.findById(insertedCustomerId);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
