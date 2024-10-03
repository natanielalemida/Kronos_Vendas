import {knexConfig} from '../../../../database/connection';
import {UsuarioDto} from '../../../login/hooks/type';
import NovoCliente from '../mapper/mapperCliente';
import {EnviarPessoa} from '../type/enviarCliente';

export default class EnviarClienteRepository {
  private mapper: NovoCliente;

  constructor() {
    this.mapper = new NovoCliente();
  }
  async getClientes(usuario: UsuarioDto): Promise<EnviarPessoa[]> {
    const data = await knexConfig('pessoa')
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
      .innerJoin('endereco', 'endereco.CodigoPessoa', 'pessoa.id') // Verificar se esse join é correto
      .innerJoin('municipio', 'municipio.Codigo', 'endereco.CodigoMunicipio')
      .innerJoin('contato', 'contato.CodigoPessoa', 'pessoa.CodigoPessoa')
      .where('pessoa.isSincronizado', '0');

    const result = this.mapper.mappNovoCliente(data, usuario);
    return result;
  }

  async getClienteById(usuario: UsuarioDto, id: number): Promise<EnviarPessoa> {
    const data = await knexConfig('pessoa')
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
      .innerJoin('endereco', 'endereco.CodigoPessoa', 'pessoa.id') // Verificar se esse join é correto
      .innerJoin('municipio', 'municipio.Codigo', 'endereco.CodigoMunicipio')
      .innerJoin('contato', 'contato.CodigoPessoa', 'pessoa.CodigoPessoa')
      .andWhere('pessoa.id', id)
      .where('pessoa.isSincronizado', '0');

    const result = this.mapper.mappNovoCliente(data, usuario);
    return result[0];
  }

  async saveOneSync(cliente: ResultadoSingleClienteDto, id: number) {
    // Inicia a transação
    const trx = await knexConfig.transaction();

    try {
      // Atualiza a tabela 'pessoa'
      await trx('pessoa')
        .update({
          Codigo: cliente.Codigo,
          CategoriaCodigo: cliente.Categoria ? cliente.Categoria.Codigo : null,
          RegiaoCodigo: cliente.Regiao ? cliente.Regiao.Codigo : null,
          isSincronizado: 1,
          DiaPagamento: cliente.DiaPagamento,
          LimiteCompra: cliente.LimiteCompra,
          DescontoMaximo: cliente.DescontoMaximo,
          TipoPreco: cliente.TipoPreco,
          AcrescimoPercentual: cliente.AcrescimoPercentual,
          PermiteComprarPazo: cliente.PermiteComprarPazo,
          CodigoPessoa: cliente.CodigoPessoa,
          PessoaFJ: cliente.PessoaFJ,
          RazaoSocial: cliente.RazaoSocial,
          NomeFantasia: cliente.NomeFantasia,
          CNPJCPF: cliente.CNPJCPF,
          IERG: cliente.IERG,
          TipoContribuinte: cliente.TipoContribuinte,
          Observacao: cliente.Observacao,
          Ativo: cliente.Ativo,
        })
        .where('id', id);

      // Atualiza a tabela 'endereco' se houver endereços
      if (cliente.Enderecos.length > 0) {
        await Promise.all(
          cliente.Enderecos.map(async currentEndereco => {
            await trx('endereco')
              .update({
                Codigo: currentEndereco.Codigo,
                CodigoPessoa: currentEndereco.CodigoPessoa,
                Tipo: currentEndereco.Tipo,
                TipoDescricao: currentEndereco.TipoDescricao,
                CEP: currentEndereco.CEP,
                Logradouro: currentEndereco.Logradouro,
                Numero: currentEndereco.Numero,
                Bairro: currentEndereco.Bairro,
                Complemento: currentEndereco.Complemento,
                CodigoMunicipio: currentEndereco.Municipio.Codigo,
              })
              .where('Codigo', currentEndereco.Codigo); // Ajuste o 'where' conforme necessário
          }),
        );
      }

      // Atualiza a tabela 'contato' se houver contatos
      if (cliente.Contatos.length > 0) {
        await Promise.all(
          cliente.Contatos.map(async contato => {
            await trx('contato')
              .update({
                Codigo: contato.Codigo,
                CodigoPessoa: contato.CodigoPessoa,
                Tipo: contato.Tipo,
                Contato: contato.Contato,
              })
              .where('Codigo', contato.Codigo);
          }),
        );
      }

      // Confirma a transação
      await trx.commit();
      return id;
    } catch (error) {
      // Reverte a transação se ocorrer um erro
      console.error(error);
      await trx.rollback();
      throw error;
    }
  }

  async getByCode(code: number) {
    if (!code) return true;
    const result = await knexConfig('pessoa')
      .select('pessoa.id')
      .first()
      .where('pessoa.Codigo', code);
    if (!result) return true;
    return undefined;
  }

  async saveSyncOne(cliente: ResultadoSingleClienteDto) {
    // Inicia a transação
    const trx = await knexConfig.transaction();

    try {
      // Atualiza a tabela 'pessoa'
      const [client] = await trx('pessoa').insert({
        Codigo: cliente.Codigo,
        CategoriaCodigo: cliente.Categoria ? cliente.Categoria.Codigo : null,
        RegiaoCodigo: cliente.Regiao ? cliente.Regiao.Codigo : null,
        isSincronizado: 1,
        DiaPagamento: cliente.DiaPagamento,
        LimiteCompra: cliente.LimiteCompra,
        DescontoMaximo: cliente.DescontoMaximo,
        TipoPreco: cliente.TipoPreco,
        AcrescimoPercentual: cliente.AcrescimoPercentual,
        PermiteComprarPazo: cliente.PermiteComprarPazo,
        CodigoPessoa: cliente.CodigoPessoa,
        PessoaFJ: cliente.PessoaFJ,
        RazaoSocial: cliente.RazaoSocial,
        NomeFantasia: cliente.NomeFantasia,
        CNPJCPF: cliente.CNPJCPF,
        IERG: cliente.IERG,
        TipoContribuinte: cliente.TipoContribuinte,
        Observacao: cliente.Observacao,
        Ativo: cliente.Ativo,
      });

      if (cliente.Enderecos.length > 0) {
        await Promise.all(
          cliente.Enderecos.map(async currentEndereco => {
            await trx('endereco').insert({
              Codigo: currentEndereco.Codigo,
              CodigoPessoa: currentEndereco.CodigoPessoa,
              Tipo: currentEndereco.Tipo,
              TipoDescricao: currentEndereco.TipoDescricao,
              CEP: currentEndereco.CEP,
              Logradouro: currentEndereco.Logradouro,
              Numero: currentEndereco.Numero,
              Bairro: currentEndereco.Bairro,
              Complemento: currentEndereco.Complemento,
              CodigoMunicipio: currentEndereco.Municipio.Codigo,
            });
          }),
        );
      }

      // Atualiza a tabela 'contato' se houver contatos
      if (cliente.Contatos.length > 0) {
        await Promise.all(
          cliente.Contatos.map(async contato => {
            await trx('contato').insert({
              Codigo: contato.Codigo,
              CodigoPessoa: contato.CodigoPessoa,
              Tipo: contato.Tipo,
              Contato: contato.Contato,
            });
          }),
        );
      }

      // Confirma a transação se tudo der certo
      await trx.commit();
      return client;
    } catch (error) {
      // Se houver erro, desfaz todas as operações
      await trx.rollback();
      throw error;
    }
  }
}
