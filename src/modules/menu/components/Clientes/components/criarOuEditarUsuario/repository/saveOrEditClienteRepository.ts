import {knexConfig} from '../../../../../../../database/connection';
import {ClienteToSave} from '../type';

export default class ClienteRepository {
  async save(clienteToSaveDto: ClienteToSave): Promise<void> {
    const trx = await knexConfig.transaction();

    try {
      const {Cliente, Endereco, Contatos} = clienteToSaveDto;

      // Inserindo o cliente na tabela pessoa dentro da transação
      const [id] = await trx('pessoa').insert({
        CNPJCPF: Cliente.CNPJCPF,
        RazaoSocial: Cliente.RazaoSocial,
        NomeFantasia: Cliente.NomeFantasia,
        IERG: Cliente.IE,
      });

      // Inserindo o endereço na tabela endereco dentro da transação
      await trx('endereco').insert({
        CodigoPessoa: id,
        Tipo: 0,
        TipoDescricao: 'Principal',
        CEP: Endereco.CEP,
        Logradouro: Endereco.Logradouro,
        Numero: Endereco.Numero,
        Bairro: Endereco.Bairro,
        Complemento: Endereco.Complemento,
        CodigoMunicipio: 1,
      });

      await Promise.all(
        Contatos.map(async contato => {
          await trx('contato').insert({
            CodigoPessoa: id,
            Tipo: contato.Tipo,
            Contato: contato.Contato,
          });
        }),
      );

      // Confirmando as operações, finalizando a transação
      await trx.commit();
    } catch (error) {
      // Desfazendo as operações caso ocorra algum erro
      await trx.rollback();
      console.log(error);
    }
  }

  async update(clienteToSaveDto: ClienteToSave): Promise<void> {
    const {Cliente, Endereco} = clienteToSaveDto;
    const transaction = await knexConfig.transaction();

    try {
      await transaction('pessoa')
        .update({
          CNPJCPF: Cliente.CNPJCPF,
          RazaoSocial: Cliente.RazaoSocial,
          NomeFantasia: Cliente.NomeFantasia,
          IERG: Cliente.IE,
        })
        .where('id', Cliente.id);

      await transaction('endereco')
        .update({
          CodigoPessoa: Cliente.id,
          Tipo: 0,
          TipoDescricao: 'Principal',
          CEP: Endereco.CEP,
          Logradouro: Endereco.Logradouro,
          Numero: Endereco.Numero,
          Bairro: Endereco.Bairro,
          Complemento: Endereco.Complemento,
          CodigoMunicipio: Endereco.CodigoMunicipio,
        })
        .where('id', Endereco.id);
      await transaction.commit();
    } catch (err) {
      console.log(err);
      await transaction.rollback();
    }
  }

  async pessoaComEndereco(id: number) {
    const data = await knexConfig('pessoa')
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
        'contato.Tipo as TipoContato',
        'contato.Codigo as CodigoContato',
        'contato.Contato',
      )
      .leftJoin('endereco', 'endereco.CodigoPessoa', 'pessoa.CodigoPessoa')
      .leftJoin('municipio', 'municipio.Codigo', 'endereco.CodigoMunicipio')
      .leftJoin('contato', 'contato.CodigoPessoa', 'pessoa.CodigoPessoa')
      .where('pessoa.id', id);

    const pessoaComContatos = data.reduce((acc, curr) => {
      // Inicializar o objeto no primeiro item
      if (!acc.Codigo) {
        (acc.id = curr.id), (acc.Codigo = curr.Codigo);
        acc.isSincronizado = curr.isSincronizado;
        acc.NomeFantasia = curr.NomeFantasia;
        acc.RazaoSocial = curr.RazaoSocial;
        acc.CNPJCPF = curr.CNPJCPF;
        acc.IERG = curr.IERG;
        acc.LimiteCompra = curr.LimiteCompra;
        acc.DescontoMaximo = curr.DescontoMaximo;
        acc.Bairro = curr.Bairro;
        acc.Logradouro = curr.Logradouro;
        acc.Numero = curr.Numero;
        acc.Complemento = curr.Complemento;
        acc.CEP = curr.CEP;
        acc.Municipio = {
          Codigo: acc.CodigoMunicipioRepository,
          MunicipioNome: acc.MunicipioNome,
        };
        acc.DiaPagamento = curr.DiaPagamento;
        acc.Contatos = {
          Email: [],
          Celular: [],
        };
      }

      // Adicionar contatos ao array Contatos baseado no tipo
      if (curr.TipoContato === 2) {
        acc.Contatos.Email.push({
          Codigo: curr.CodigoContato,
          Tipo: curr.TipoContato,
          Contato: curr.Contato,
        });
      } else if (curr.TipoContato === 1) {
        acc.Contatos.Celular.push({
          Codigo: curr.CodigoContato,
          Tipo: curr.TipoContato,
          Contato: curr.Contato,
        });
      }

      return acc;
    }, {});

    return pessoaComContatos;
  }

  async pessoaComEnderecoById(id: number) {
    const data = await knexConfig('pessoa')
      .select(
        'pessoa.*',
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
        'contato.Tipo as TipoContato',
        'contato.Codigo as CodigoContato',
        'contato.Contato',
      )
      .leftJoin('endereco', 'endereco.CodigoPessoa', 'pessoa.id')
      .leftJoin('municipio', 'municipio.Codigo', 'endereco.CodigoMunicipio')
      .leftJoin('contato', 'contato.CodigoPessoa', 'pessoa.id')
      .where('pessoa.id', id);

    const pessoaComContatos = data.reduce(
      (acc, item) => {
        // Atualiza as informações principais apenas uma vez
        if (acc.CodigoPessoa === null) {
          (acc.id = item.id), (acc.Codigo = item.Codigo);
          acc.isSincronizado = item.isSincronizado;
          acc.CodigoPessoa = item.CodigoPessoa;
          acc.NomeFantasia = item.NomeFantasia;
          acc.RazaoSocial = item.RazaoSocial;
          acc.CNPJCPF = item.CNPJCPF;
          acc.IERG = item.IERG;
          acc.LimiteCompra = item.LimiteCompra;
          acc.DescontoMaximo = item.DescontoMaximo;
          acc.Bairro = item.Bairro;
          acc.Logradouro = item.Logradouro;
          acc.Numero = item.Numero;
          acc.Complemento = item.Complemento;
          acc.Municipio = {
            Codigo: acc.CodigoMunicipioRepository,
            MunicipioNome: acc.MunicipioNome,
          };
          acc.CEP = item.CEP;
          acc.DiaPagamento = item.DiaPagamento;
        }

        // Adiciona contatos ao array
        const contato = {
          Codigo: item.CodigoContato,
          Tipo: item.TipoContato,
          Contato: item.Contato,
        };

        if (item.TipoContato === 2) {
          acc.Contatos.Email.push(contato);
        } else if (item.TipoContato === 1) {
          acc.Contatos.Celular.push(contato);
        }

        return acc;
      },
      {
        CodigoPessoa: null,
        NomeFantasia: null,
        RazaoSocial: null,
        CNPJCPF: null,
        IERG: null,
        LimiteCompra: null,
        DescontoMaximo: null,
        Bairro: null,
        Logradouro: null,
        Numero: null,
        Complemento: null,
        CEP: null,
        DiaPagamento: null,
        Contatos: {
          Email: [],
          Celular: [],
        },
      },
    );

    return pessoaComContatos;
  }

  async deleteByCNPJCPF(CNPJCPF: string): Promise<void> {
    await knexConfig('pessoa').where('CNPJCPF', CNPJCPF).del();
  }

  async deleteById(id: number): Promise<void> {
    await knexConfig('pessoa').where('id', id).del();
  }
}
