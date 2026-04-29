import {Knex} from 'knex';

import {knexConfig} from '@/database/connection';
import {CustomerFormToSave} from '@/shared/types/customer-form.types';

import {EditableCustomerRecord} from '../types/customer-edit.types';

type EditableCustomerRow = {
  id: number;
  Codigo: number | null;
  CodigoPessoa: number | null;
  isSincronizado: number | null;
  NomeFantasia: string | null;
  RazaoSocial: string | null;
  CNPJCPF: string | null;
  IERG: string | null;
  LimiteCompra: number | null;
  DescontoMaximo: number | null;
  Bairro: string | null;
  Logradouro: string | null;
  Numero: string | null;
  TipoPreco: string | null;
  Complemento: string | null;
  EnderecoId?: number;
  CodigoMunicipioRepository?: number;
  MunicipioNome?: string;
  MunicipioCodigo?: number;
  Estado?: string;
  CEP?: string;
  DiaPagamento?: number | null;
  TipoContato?: number;
  CodigoContato?: number;
  Contato?: string;
};

function createEmptyEditableCustomerRecord(): EditableCustomerRecord {
  return {
    Bairro: null,
    CEP: null,
    CNPJCPF: null,
    Codigo: null,
    CodigoPessoa: null,
    Complemento: null,
    Contatos: {
      Celular: [],
      Email: [],
    },
    DescontoMaximo: null,
    DiaPagamento: null,
    IERG: null,
    LimiteCompra: null,
    Logradouro: null,
    NomeFantasia: null,
    Numero: null,
    RazaoSocial: null,
    TipoPreco: null,
    isSincronizado: null,
  };
}

function mapEditableCustomerRows(rows: EditableCustomerRow[]): EditableCustomerRecord {
  return rows.reduce<EditableCustomerRecord>((customerRecord, row) => {
    if (customerRecord.CodigoPessoa === null) {
      customerRecord.id = row.id;
      customerRecord.Codigo = row.Codigo;
      customerRecord.CodigoPessoa = row.CodigoPessoa;
      customerRecord.isSincronizado = row.isSincronizado;
      customerRecord.NomeFantasia = row.NomeFantasia;
      customerRecord.RazaoSocial = row.RazaoSocial;
      customerRecord.CNPJCPF = row.CNPJCPF;
      customerRecord.IERG = row.IERG;
      customerRecord.LimiteCompra = row.LimiteCompra;
      customerRecord.DescontoMaximo = row.DescontoMaximo;
      customerRecord.Bairro = row.Bairro;
      customerRecord.Logradouro = row.Logradouro;
      customerRecord.Numero = row.Numero;
      customerRecord.TipoPreco = row.TipoPreco;
      customerRecord.Complemento = row.Complemento;
      customerRecord.EnderecoId = row.EnderecoId;
      customerRecord.Municipio = {
        Codigo: row.CodigoMunicipioRepository ?? 0,
        Estado: row.Estado ?? '',
        MunicipioCodigo: row.MunicipioCodigo ?? 0,
        MunicipioNome: row.MunicipioNome ?? '',
      };
      customerRecord.CEP = row.CEP;
      customerRecord.DiaPagamento = row.DiaPagamento;
    }

    if (row.TipoContato && row.Contato) {
      const contact = {
        Codigo: row.CodigoContato,
        Tipo: row.TipoContato,
        Contato: row.Contato,
      };

      if (row.TipoContato === 2) {
        customerRecord.Contatos.Email.push(contact);
      } else if (row.TipoContato === 1) {
        customerRecord.Contatos.Celular.push(contact);
      }
    }

    return customerRecord;
  }, createEmptyEditableCustomerRecord());
}

export class CustomerEditRepository {
  async save(customerToSave: CustomerFormToSave): Promise<EditableCustomerRecord> {
    const transaction = await knexConfig.transaction();

    try {
      const {Cliente, Contatos, Endereco} = customerToSave;
      const [id] = await transaction('pessoa').insert({
        CNPJCPF: Cliente.CNPJCPF,
        RazaoSocial: Cliente.RazaoSocial,
        NomeFantasia: Cliente.NomeFantasia,
        IERG: Cliente.IE,
      });

      await transaction('endereco').insert({
        Bairro: Endereco.Bairro,
        CEP: Endereco.CEP,
        CodigoMunicipio: Endereco.CodigoMunicipio,
        CodigoPessoa: id,
        Complemento: Endereco.Complemento,
        Logradouro: Endereco.Logradouro,
        Numero: Endereco.Numero,
        Tipo: 0,
        TipoDescricao: 'Principal',
      });

      await Promise.all(
        Contatos.map(contact =>
          transaction('contato').insert({
            CodigoPessoa: id,
            Contato: contact.Contato,
            Tipo: contact.Tipo,
          }),
        ),
      );

      await transaction.commit();
      return this.findById(id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async update(customerToSave: CustomerFormToSave): Promise<EditableCustomerRecord> {
    const transaction = await knexConfig.transaction();

    try {
      await transaction('pessoa')
        .update({
          CNPJCPF: customerToSave.Cliente.CNPJCPF,
          IERG: customerToSave.Cliente.IE,
          NomeFantasia: customerToSave.Cliente.NomeFantasia,
          RazaoSocial: customerToSave.Cliente.RazaoSocial,
        })
        .where('id', customerToSave.Cliente.id);

      await transaction('endereco')
        .update({
          Bairro: customerToSave.Endereco.Bairro,
          CEP: customerToSave.Endereco.CEP,
          CodigoMunicipio: customerToSave.Endereco.CodigoMunicipio,
          CodigoPessoa: customerToSave.Cliente.id,
          Complemento: customerToSave.Endereco.Complemento,
          Logradouro: customerToSave.Endereco.Logradouro,
          Numero: customerToSave.Endereco.Numero,
          Tipo: 0,
          TipoDescricao: 'Principal',
        })
        .where('id', customerToSave.Endereco.id);

      await transaction.commit();
      return this.findById(customerToSave.Cliente.id as number);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async findById(id: number): Promise<EditableCustomerRecord> {
    const rows = await knexConfig('pessoa')
      .select(
        'pessoa.*',
        'endereco.id as EnderecoId',
        'endereco.CEP',
        'endereco.Logradouro',
        'endereco.Numero',
        'endereco.Bairro',
        'endereco.Complemento',
        'endereco.CodigoMunicipio',
        'endereco.Tipo',
        'endereco.TipoDescricao',
        'municipio.MunicipioNome',
        'municipio.Codigo as CodigoMunicipioRepository',
        'municipio.MunicipioCodigo',
        'municipio.UFSigla as Estado',
        'contato.Tipo as TipoContato',
        'contato.Codigo as CodigoContato',
        'contato.Contato',
      )
      .leftJoin('endereco', 'endereco.CodigoPessoa', 'pessoa.id')
      .leftJoin(
        'municipio',
        'municipio.MunicipioCodigo',
        'endereco.CodigoMunicipio',
      )
      .leftJoin('contato', 'contato.CodigoPessoa', 'pessoa.id')
      .where('pessoa.id', id);

    return mapEditableCustomerRows(rows);
  }

  async findByCode(id: number): Promise<EditableCustomerRecord> {
    const rows = await knexConfig('pessoa')
      .select(
        'pessoa.*',
        'endereco.id as EnderecoId',
        'endereco.CEP',
        'endereco.Logradouro',
        'endereco.Numero',
        'endereco.Bairro',
        'endereco.Complemento',
        'endereco.CodigoMunicipio',
        'endereco.Tipo',
        'endereco.TipoDescricao',
        'municipio.MunicipioNome',
        'municipio.UFSigla as Estado',
        'municipio.Codigo as CodigoMunicipioRepository',
        'municipio.MunicipioCodigo',
        'contato.Tipo as TipoContato',
        'contato.Codigo as CodigoContato',
        'contato.Contato',
      )
      .leftJoin('endereco', 'endereco.CodigoPessoa', 'pessoa.CodigoPessoa')
      .leftJoin(
        'municipio',
        'municipio.MunicipioCodigo',
        'endereco.CodigoMunicipio',
      )
      .leftJoin('contato', 'contato.CodigoPessoa', 'pessoa.CodigoPessoa')
      .where('pessoa.id', id);

    return mapEditableCustomerRows(rows);
  }

  async findByDocument(document: string): Promise<EditableCustomerRecord> {
    const rows = await knexConfig('pessoa')
      .select(
        'pessoa.*',
        'endereco.id as EnderecoId',
        'endereco.CEP',
        'endereco.Logradouro',
        'endereco.Numero',
        'endereco.Bairro',
        'endereco.Complemento',
        'endereco.CodigoMunicipio',
        'endereco.Tipo',
        'endereco.TipoDescricao',
        'municipio.MunicipioNome',
        'municipio.Codigo as CodigoMunicipioRepository',
        'municipio.MunicipioCodigo',
        'municipio.UFSigla as Estado',
        'contato.Tipo as TipoContato',
        'contato.Codigo as CodigoContato',
        'contato.Contato',
      )
      .leftJoin('endereco', function (this: Knex.JoinClause) {
        this.on(function (this: Knex.JoinClause) {
          this.on('pessoa.CodigoPessoa', '=', 'endereco.CodigoPessoa').orOn(
            knexConfig.raw(
              'pessoa.Codigo IS NULL AND pessoa.id = endereco.CodigoPessoa',
            ),
          );
        });
      })
      .leftJoin(
        'municipio',
        'municipio.MunicipioCodigo',
        'endereco.CodigoMunicipio',
      )
      .leftJoin('contato', function (this: Knex.JoinClause) {
        this.on('contato.CodigoPessoa', 'pessoa.CodigoPessoa')
          .orOn(function (this: Knex.JoinClause) {
            this.on(knexConfig.raw('pessoa.Codigo = 0')).orOnNull('pessoa.Codigo');
          })
          .on('contato.CodigoPessoa', 'pessoa.id');
      })
      .where('pessoa.CNPJCPF', document);

    return mapEditableCustomerRows(rows);
  }

  async deleteById(id: number): Promise<void> {
    await knexConfig('pessoa').where('id', id).del();
  }
}
