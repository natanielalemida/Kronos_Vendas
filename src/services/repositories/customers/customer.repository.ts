import {Knex} from 'knex';

import {knexConfig} from '@/database/connection';
import {
  CategoriaRegiaoDto,
  ClienteDto,
  ContatoDto,
  EnderecoDto,
} from '@/modules/sync/types/customer-sync.types';
import {
  CustomerInsertSource,
  CustomerSearchResult,
  CustomerSearchRow,
  GroupedCustomerRow,
  MappedCustomerInsert,
} from './types/customer-repository.types';

function mapCustomerInsert(
  customer: CustomerInsertSource,
): MappedCustomerInsert {
  return {
    customer: {
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
    },
    addresses: customer.Enderecos,
    contacts: customer.Contatos,
  };
}

function mapSearchCustomers(rows: CustomerSearchRow[]): GroupedCustomerRow[] {
  return rows.reduce<GroupedCustomerRow[]>((customers, row) => {
    const existingCustomer = customers.find(
      currentCustomer => currentCustomer.Codigo === row.Codigo,
    );

    if (!existingCustomer) {
      customers.push({
        Codigo: row.Codigo,
        CodigoPessoa: row.CodigoPessoa ?? 0,
        NomeFantasia: row.NomeFantasia,
        RazaoSocial: row.RazaoSocial,
        id: row.id,
        CNPJCPF: row.CNPJCPF,
        TipoPreco: row.TipoPreco,
        isSincronizado: row.isSincronizado,
        Enderecos: [],
      });
    }

    const targetCustomer = existingCustomer ?? customers[customers.length - 1];

    targetCustomer.Enderecos.push({
      Logradouro: row.Logradouro,
      Numero: row.Numero,
      Complemento: row.Complemento,
      Bairro: row.Bairro,
    });

    return customers;
  }, []);
}

export class CustomerRepository {
  async save(customer: ClienteDto): Promise<ClienteDto | undefined> {
    const transaction = await knexConfig.transaction();

    try {
      const mappedCustomer = mapCustomerInsert(customer);
      const [id] = await transaction('pessoa').insert(mappedCustomer.customer);

      if (mappedCustomer.addresses.length > 0) {
        await this.saveAddresses(transaction, mappedCustomer.addresses);
      }

      if (mappedCustomer.contacts.length > 0) {
        await this.saveContacts(transaction, mappedCustomer.contacts);
      }

      await transaction.commit();

      return this.getById(id);
    } catch (error) {
      await transaction.rollback();

      const normalizedError =
        error instanceof Error ? error : new Error('Customer save failed.');

      throw normalizedError;
    }
  }

  async saveAddresses(
    transaction: Knex.Transaction,
    addresses: EnderecoDto[],
  ): Promise<void> {
    await Promise.all(
      addresses.map(async address => {
        await transaction('endereco').insert({
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
        });
      }),
    );
  }

  async saveContacts(
    transaction: Knex.Transaction,
    contacts: ContatoDto[],
  ): Promise<void> {
    await Promise.all(
      contacts.map(async contact => {
        await transaction('contato').insert({
          Codigo: contact.Codigo,
          CodigoPessoa: contact.CodigoPessoa,
          Tipo: contact.Tipo,
          Contato: contact.Contato,
        });
      }),
    );
  }

  async getById(id: number): Promise<ClienteDto | undefined> {
    const result = await knexConfig('pessoa')
      .select('*')
      .where('pessoa.id', id)
      .first()
      .leftJoin('categoria', 'categoria.Codigo', 'pessoa.CategoriaCodigo')
      .leftJoin('regiao', 'regiao.Codigo', 'pessoa.RegiaoCodigo');

    return result as ClienteDto | undefined;
  }

  async getByCode(code: number): Promise<ClienteDto | undefined> {
    const result = await knexConfig('pessoa')
      .select('*')
      .where('Codigo', code)
      .first();

    return result as ClienteDto | undefined;
  }

  async getByCnpjCpf(cnpjCpf: string): Promise<ClienteDto | undefined> {
    const result = await knexConfig('pessoa')
      .select('*')
      .where('CNPJCPF', cnpjCpf)
      .first();

    return result as ClienteDto | undefined;
  }

  async getRegionByCode(code: number): Promise<CategoriaRegiaoDto | undefined> {
    const result = await knexConfig('regiao')
      .select('*')
      .where('Codigo', code)
      .first();

    return result as CategoriaRegiaoDto | undefined;
  }

  async getCategoryByCode(
    code: number,
  ): Promise<CategoriaRegiaoDto | undefined> {
    const result = await knexConfig('categoria')
      .select('*')
      .where('Codigo', code)
      .first();

    return result as CategoriaRegiaoDto | undefined;
  }

  async search(textFilter?: string): Promise<CustomerSearchResult> {
    const query = knexConfig('pessoa')
      .select(
        'pessoa.id',
        'pessoa.Codigo',
        'pessoa.CodigoPessoa',
        'pessoa.NomeFantasia',
        'pessoa.CNPJCPF',
        'pessoa.isSincronizado',
        'pessoa.RazaoSocial',
        'pessoa.TipoPreco',
        'endereco.Bairro',
        'endereco.Logradouro',
        'endereco.Numero',
        'endereco.Complemento',
      )
      .limit(50)
      .leftJoin('endereco', function joinAddress(this: Knex.JoinClause) {
        this.on(function joinAddressRows(this: Knex.JoinClause) {
          this.on('pessoa.CodigoPessoa', '=', 'endereco.CodigoPessoa').orOn(
            knexConfig.raw(
              'pessoa.Codigo IS NULL AND pessoa.id = endereco.CodigoPessoa',
            ),
          );
        });
      });

    if (textFilter && textFilter.length > 0) {
      query.andWhere(function applySearchFilter(this: Knex.QueryBuilder) {
        this.whereRaw('LOWER(pessoa.NomeFantasia) LIKE ?', [
          `%${textFilter.toLowerCase()}%`,
        ]).orWhereRaw('pessoa.CNPJCPF LIKE ?', [`%${textFilter}%`]);
      });
    }

    const rows = (await query) as CustomerSearchRow[];
    const total = await knexConfig('pessoa').count('* as count').first();

    return {
      data: mapSearchCustomers(rows),
      total: {
        count: Number(total?.count ?? 0),
      },
    };
  }
}
