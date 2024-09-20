import MapperPagamento from '../mapper/mapperPagamento';
import PagamentoRepository from '../repository/pagamentoRepository';
import {CondicaoPagamentoDto, FormaPagamentoDto} from '../type';

export default class PagamentoService {
  private repository: PagamentoRepository;
  private mapper: MapperPagamento;

  constructor() {
    this.repository = new PagamentoRepository();
    this.mapper = new MapperPagamento();
  }

  async save(formaPagamento: FormaPagamentoDto[]) {
    await Promise.all(
      formaPagamento.map(async pagamento => {
        await this.saveFormaPagamento(pagamento);
      }),
    );
  }

  async saveFormaPagamento(formaPagamentoDto: FormaPagamentoDto) {
    const haveFormaPagamento = await this.repository.getFormaPagamentoByCodigo(
      formaPagamentoDto.Codigo,
    );
    if (!haveFormaPagamento) {
      const formatedPay = this.mapper.mappeToSave(formaPagamentoDto);
      await this.repository.saveFormaPagamento(formatedPay);
      await this.saveCodicaoPagamento(formaPagamentoDto.CondicoesPagamento);
      return;
    }
  }

  async saveCodicaoPagamento(codicaoPagamento: CondicaoPagamentoDto[]) {
    Promise.all(
      codicaoPagamento.map(async pagamento => {
        await this.saveOneCodicaoPagamento(pagamento);
      }),
    );
  }

  async saveOneCodicaoPagamento(codicaoPagamento: CondicaoPagamentoDto) {
    const HaveCodicaoPagamento =
      await this.repository.getCodicaoPagamentoByCodigo(
        codicaoPagamento.Codigo,
      );

    if (!HaveCodicaoPagamento) {
      const result = this.mapper.mapCodicaoPagamento(codicaoPagamento);
      await this.repository.saveCondicaoPagamento(result);
      return;
    }
  }
}
