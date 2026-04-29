import {UserDto} from '@/shared/types';
import {ClienteDto} from '@/modules/sync/types/customer-sync.types';

import {
  CustomerUploadApiPayload,
  PendingCustomerPayload,
} from '../types/customer-upload.types';

type UploadCustomerQueryRow = {
  id: number;
  Codigo: number;
  CategoriaCodigo: number | null;
  RegiaoCodigo: number | null;
  DiaPagamento: number | null;
  LimiteCompra: number | null;
  DescontoMaximo: number | null;
  TipoPreco: string | null;
  AcrescimoPercentual: number | null;
  PermiteComprarPazo: boolean | null;
  PessoaFJ: number | null;
  RazaoSocial: string;
  NomeFantasia: string;
  CNPJCPF: string;
  IERG?: string | null;
  BloquearCliente?: boolean | null;
  ForcarAtualizacaoCadastro?: boolean | null;
  CarenciaPagamento?: number | null;
  DataNascimento?: string | null;
  PessoaReferencia?: unknown[] | null;
  Veiculos?: unknown | null;
  TipoContribuinte?: number | null;
  Observacao?: string | null;
  Ativo?: boolean | null;
  DataCadastro?: string | null;
  CodigoPessoa: number | null;
  CodigoEndereco: number | null;
  Tipo: number | null;
  TipoDescricao: string | null;
  CEP: string | null;
  Logradouro: string | null;
  Numero: string | null;
  Bairro: string | null;
  Complemento: string | null;
  CodigoMunicipio: number | null;
  MunicipioCodigo: number | null;
  UFCodigo: number | null;
  MunicipioNome: string | null;
  UFNome: string | null;
  UFSigla: string | null;
  PaisCodigo: number | null;
  PaisNome: string | null;
  TipoContato: number | null;
  CodigoContato: number | null;
  Contato: string | null;
};

type UploadCustomerContactGroup = {
  Email: {Codigo: number; CodigoPessoa: number; Tipo: number; Contato: string}[];
  Celular: {Codigo: number; CodigoPessoa: number; Tipo: number; Contato: string}[];
};

function groupCustomerContacts(
  rows: UploadCustomerQueryRow[],
  customerCode: number,
): UploadCustomerContactGroup {
  return rows
    .filter(row => row.CodigoPessoa === customerCode)
    .reduce<UploadCustomerContactGroup>(
      (contacts, row) => {
        if (row.TipoContato === 2 && row.Contato) {
          contacts.Email.push({
            Codigo: row.CodigoContato ?? 0,
            CodigoPessoa: row.CodigoPessoa ?? 0,
            Tipo: row.TipoContato,
            Contato: row.Contato,
          });
        } else if (row.TipoContato === 1 && row.Contato) {
          contacts.Celular.push({
            Codigo: row.CodigoContato ?? 0,
            CodigoPessoa: row.CodigoPessoa ?? 0,
            Tipo: row.TipoContato,
            Contato: row.Contato,
          });
        }

        return contacts;
      },
      {Email: [], Celular: []},
    );
}

export class CustomerUploadMapper {
  mapPendingCustomers(
    rows: UploadCustomerQueryRow[],
    user: UserDto,
  ): PendingCustomerPayload[] {
    return rows.map(customer => {
      const contacts = groupCustomerContacts(rows, customer.Codigo);

      return {
        Codigo: customer.Codigo || 0,
        Categoria: customer.CategoriaCodigo || null,
        Regiao: customer.RegiaoCodigo || null,
        DiaPagamento: customer.DiaPagamento || 30,
        LimiteCompra: customer.LimiteCompra || 5000,
        BloquearCliente: customer.BloquearCliente || true,
        ForcarAtualizacaoCadastro: customer.ForcarAtualizacaoCadastro || false,
        CarenciaPagamento: customer.CarenciaPagamento || 3,
        DescontoMaximo: customer.DescontoMaximo || 0,
        DataNascimento: customer.DataNascimento || null,
        TipoPreco: customer.TipoPreco || null,
        PessoaReferencia: customer.PessoaReferencia || null,
        AcrescimoPercentual: customer.AcrescimoPercentual || 0,
        Veiculos: customer.Veiculos || null,
        PermiteComprarPazo: customer.PermiteComprarPazo || true,
        CodigoPessoa: customer.CodigoPessoa || 0,
        PessoaFJ: customer.PessoaFJ || 0,
        RazaoSocial: customer.RazaoSocial,
        NomeFantasia: customer.NomeFantasia,
        CNPJCPF: customer.CNPJCPF || '',
        IERG: customer.IERG || '',
        TipoContribuinte:
          customer.PessoaFJ === 1 && customer.IERG ? 1 : customer.TipoContribuinte || 9,
        Observacao: customer.Observacao || '',
        Ativo: customer.Ativo || true,
        DataCadastro: customer.DataCadastro || new Date().toISOString(),
        ResponsavelCadastro: {
          CodigoUsuario: user.Codigo,
          Nome: user.Referencia,
        },
        Enderecos: [
          {
            Codigo: customer.CodigoEndereco || 0,
            CodigoPessoa: customer.Codigo || 0,
            Tipo: customer.Tipo || 0,
            TipoDescricao: customer.TipoDescricao || 'Principal',
            CEP: customer.CEP || '',
            Logradouro: customer.Logradouro || '',
            Numero: customer.Numero || '',
            Bairro: customer.Bairro || '',
            Complemento: customer.Complemento || '',
            Municipio: {
              Codigo: customer.CodigoMunicipio || 0,
              MunicipioCodigo: customer.MunicipioCodigo || 0,
              MunicipioNome: customer.MunicipioNome || '',
              UFCodigo: customer.UFCodigo || 0,
              UFNome: customer.UFNome || '',
              UFSigla: customer.UFSigla || '',
              PaisCodigo: customer.PaisCodigo || 0,
              PaisNome: customer.PaisNome || '',
            },
          },
        ],
        Contatos:
          [...contacts.Email, ...contacts.Celular].length > 0
            ? [...contacts.Email, ...contacts.Celular]
            : null,
      };
    });
  }

  mapCustomerFormPayload(
    customer: ClienteDto,
    user: UserDto,
  ): CustomerUploadApiPayload {
    const emails =
      customer.Contatos?.filter(contact => contact.Tipo === 2).map(contact => ({
        Codigo: 0,
        CodigoPessoa: 0,
        Tipo: 2,
        Contato: contact.Contato,
      })) ?? [];
    const phones =
      customer.Contatos?.filter(contact => contact.Tipo === 1).map(contact => ({
        Codigo: 0,
        CodigoPessoa: 0,
        Tipo: 1,
        Contato: contact.Contato,
      })) ?? [];

    return {
      Codigo: customer.Codigo || 0,
      Categoria: customer.Categoria?.Codigo || null,
      Regiao: customer.Regiao?.Codigo || null,
      DiaPagamento: customer.DiaPagamento || 30,
      LimiteCompra: customer.LimiteCompra || 0,
      BloquearCliente: customer.BloquearCliente || true,
      ForcarAtualizacaoCadastro: customer.ForcarAtualizacaoCadastro || false,
      CarenciaPagamento: customer.CarenciaPagamento || 3,
      DescontoMaximo: customer.DescontoMaximo || 0,
      DataNascimento: customer.DataNascimento || null,
      TipoPreco: customer.TipoPreco || null,
      PessoaReferencia: customer.PessoaReferencia || null,
      AcrescimoPercentual: customer.AcrescimoPercentual || 0,
      Veiculos: customer.Veiculos || null,
      PermiteComprarPazo: customer.PermiteComprarPazo || true,
      CodigoPessoa: customer.CodigoPessoa || 0,
      PessoaFJ: customer.PessoaFJ || 0,
      NomeFantasia: customer.NomeFantasia,
      RazaoSocial: customer.RazaoSocial || customer.NomeFantasia,
      CNPJCPF: customer.CNPJCPF || '',
      IERG: customer.IERG || '',
      TipoContribuinte: customer.CNPJCPF.length > 11 && customer.IERG ? 1 : 9,
      Observacao: customer.Observacao || '',
      Ativo: customer.Ativo || true,
      DataCadastro: customer.DataCadastro || new Date().toISOString(),
      ResponsavelCadastro: {
        CodigoUsuario: user.Codigo,
        Nome: user.Referencia,
      },
      Enderecos: [
        {
          Codigo: customer.Enderecos?.[0]?.Codigo || 0,
          CodigoPessoa: customer.Codigo || 0,
          Tipo: customer.Enderecos?.[0]?.Tipo || 0,
          TipoDescricao: customer.Enderecos?.[0]?.TipoDescricao || 'Principal',
          CEP: customer.Enderecos?.[0]?.CEP || '',
          Logradouro: customer.Enderecos?.[0]?.Logradouro || '',
          Numero: customer.Enderecos?.[0]?.Numero || '',
          Bairro: customer.Enderecos?.[0]?.Bairro || '',
          Complemento: customer.Enderecos?.[0]?.Complemento || '',
          Municipio: {
            Codigo: customer.Enderecos?.[0]?.Municipio?.Codigo || 0,
            MunicipioCodigo:
              customer.Enderecos?.[0]?.Municipio?.MunicipioCodigo || 0,
          },
        },
      ],
      Contatos: [...emails, ...phones].length > 0 ? [...emails, ...phones] : null,
    };
  }
}
