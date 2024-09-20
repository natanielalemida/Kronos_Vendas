import {knexConfig} from '../../../database/connection';
import MapperPagamento from '../mapper/mapperPagamento';
import {
  CondicaoPagamentoDto,
  FormaPagamento,
  FormaPagamentoToSaveDto,
} from '../type/pagamentoType';

export default class PagamentoRepository {
  private mapper: MapperPagamento;

  constructor() {
    this.mapper = new MapperPagamento();
  }

  async getCodicaoPagamentoByCodigo(
    Codigo: number,
  ): Promise<CondicaoPagamentoDto | undefined> {
    const result = await knexConfig('condicaoPagamento')
      .select('*')
      .where('Codigo', Codigo)
      .first();

    if (!result) return undefined;

    return result;
  }

  async getFormaPagamentoByCodigo(
    Codigo: number,
  ): Promise<CondicaoPagamentoDto | undefined> {
    const result = await knexConfig('formaPagamento')
      .select('*')
      .where('Codigo', Codigo)
      .first();

    if (!result) return undefined;

    return result;
  }

  async saveFormaPagamento(formaPagamento: FormaPagamentoToSaveDto) {
    const [id] = await knexConfig('formaPagamento').insert({
      ...formaPagamento,
    });
  }

  async saveCondicaoPagamento(codicaoPagamento: CondicaoPagamentoDto) {
    await knexConfig('condicaoPagamento').insert({
      ...codicaoPagamento,
    });
  }

  async getFormaPagamento(): Promise<FormaPagamento[]> {
    const query = await knexConfig('formaPagamento')
      .select('*')
      .innerJoin(
        'condicaoPagamento',
        'formaPagamento.Codigo',
        'condicaoPagamento.CodigoFormaPagamento',
      );

    return this.mapper.mapperFormaPagamentoSeach(query);
  }
}
