import {knexConfig} from '../../../database/connection';
import MapperCliente from '../mapper/mapperCliente';
import {CategoriaRegiaoDto, ClienteDto, ContatoDto, EnderecoDto} from '../type';

export default class ClienteRepository {
  private mapper: MapperCliente;

  constructor() {
    this.mapper = new MapperCliente();
  }

  async save(cliente: ClienteDto): Promise<ClienteDto | undefined> {
    const tsx = await knexConfig.transaction();
    try {
      const client = await this.mapper.mapCliente(cliente);
      const [id] = await tsx('pessoa').insert({
        ...client.Clientes,
      });

      // if (cliente.Regiao) {
      //   await this.saveRegiao(tsx, cliente.Regiao);
      // }

      // if (cliente.Categoria) {
      //   await this.saveCategoria(tsx, cliente.Categoria);
      // }

      if (cliente.Enderecos.length > 0) {
        await this.saveEndereco(tsx, cliente.Enderecos);
      }

      if (cliente.Contatos.length > 0) {
        await this.saveContato(tsx, cliente.Contatos);
      }

      await tsx.commit();
      const result = await this.getById(id);
      return result;
    } catch (error) {
      await tsx.rollback();
      console.error('Transaction error:', error);
      // @ts-ignore
      throw new Error(error.message);
    }
  }

  async saveEndereco(
    tsx: any,
    enderecos: EnderecoDto[],
  ): Promise<EnderecoDto | undefined> {
    await Promise.all(
      enderecos.map(async endereco => {
        await tsx('endereco').insert({
          Codigo: endereco.Codigo,
          CodigoPessoa: endereco.CodigoPessoa,
          Tipo: endereco.Tipo,
          TipoDescricao: endereco.TipoDescricao,
          CEP: endereco.CEP,
          Logradouro: endereco.Logradouro,
          Numero: endereco.Numero,
          Bairro: endereco.Bairro,
          Complemento: endereco.Complemento,
          CodigoMunicipio: endereco.Municipio.Codigo,
        });
      }),
    );

    return;
  }

  async saveContato(tsx: any, contatos: ContatoDto[]) {
    await Promise.all(
      contatos.map(async contato => {
        await tsx('contato').insert({
          Codigo: contato.Codigo,
          CodigoPessoa: contato.CodigoPessoa,
          Tipo: contato.Tipo,
          Contato: contato.Contato,
        });
      }),
    );
  }

  async saveRegiao(
    tsx: any,
    regiao: CategoriaRegiaoDto,
  ): Promise<CategoriaRegiaoDto | undefined> {
    const haveRegiao = await this.getByTsxCode(tsx, regiao.Codigo, 'regiao');
    if (!regiao && haveRegiao) return;

    await tsx('regiao').insert({
      Codigo: regiao.Codigo,
      Descricao: regiao.Descricao,
    });
    return;
  }

  async saveCategoria(
    tsx: any,
    categoria: CategoriaRegiaoDto,
  ): Promise<CategoriaRegiaoDto | undefined> {
    const haveCategoria = await this.getByTsxCode(
      tsx,
      categoria.Codigo,
      'categoria',
    );
    if (!categoria && haveCategoria) return;
    await tsx('categoria').insert({
      Codigo: categoria.Codigo,
      Descricao: categoria.Descricao,
    });
    return;
  }

  async getById(id: number): Promise<ClienteDto | undefined> {
    const result = await knexConfig('pessoa')
      .select('*')
      .where('pessoa.id', id)
      .first()
      .leftJoin('categoria', 'categoria.Codigo', 'pessoa.CategoriaCodigo')
      .leftJoin('regiao', 'regiao.Codigo', 'pessoa.RegiaoCodigo');

    if (!result) return undefined;

    return result;
  }

  async getByCode(Codigo: number): Promise<ClienteDto | undefined> {
    const result = await knexConfig('pessoa')
      .select('*')
      .where('Codigo', Codigo)
      .first();

    if (!result) return undefined;

    return result;
  }

  async getByCNPJCPF(CNPJCPF: string): Promise<ClienteDto | undefined> {
    const result = await knexConfig('pessoa')
      .select('*')
      .where('CNPJCPF', CNPJCPF)
      .first();

    if (!result) return undefined;

    return result;
  }

  async getRegiaoByCodigo(
    codigo: number,
  ): Promise<CategoriaRegiaoDto | undefined> {
    const result = await knexConfig('regiao')
      .select('*')
      .where('Codigo', codigo)
      .first();

    if (!result) return undefined;

    return result;
  }

  async getCategoriaByCodigo(
    codigo: number,
  ): Promise<CategoriaRegiaoDto | undefined> {
    const result = await knexConfig('categoria')
      .select('*')
      .where('Codigo', codigo)
      .first();

    if (!result) return undefined;

    return result;
  }

  async search(textFilter?: string) {
    // Cria a base da query
    const query = knexConfig('pessoa')
      .select(
        'pessoa.id',
        'pessoa.Codigo',
        'pessoa.NomeFantasia',
        'pessoa.CNPJCPF',
        'pessoa.isSincronizado',
        'pessoa.TipoPreco',
      )
      .limit(50)
      .orderBy('pessoa.NomeFantasia');

    // Adiciona o filtro se estiver presente
    if (textFilter && textFilter.length > 0) {
      query.andWhereRaw('LOWER(pessoa.NomeFantasia) LIKE ?', [
        `%${textFilter.toLowerCase()}%`,
      ]);
    }

    // Obtém os dados filtrados
    const data = await query;

    // Obtém o total de registros sem filtro
    const totalResult = await knexConfig('pessoa').count('* as count').first();
    const total = totalResult || 0;

    return {data, total};
  }

  private async getByTsxCode(
    tsx: any,
    codigo: number,
    tableName: string,
  ): Promise<CategoriaRegiaoDto | undefined> {
    const result = await tsx(tableName)
      .select('*')
      .where('Codigo', codigo)
      .first();

    if (!result) return undefined;

    return result;
  }
}
